// Studio renderer for product and detail images (used by scripts/render-products.mjs).
import '@fontsource-variable/montserrat';
import '@fontsource/cormorant/latin-600.css';
import * as THREE from 'three';
import { createGarment, addStudioLights } from './three/garment';
import { products, detailShots, type Product } from './data/products';

declare global {
  interface Window {
    renderAll?: () => Promise<Record<string, string>>;
  }
}

const W = 960;
const H = 1200;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
addStudioLights(scene);
const camera = new THREE.PerspectiveCamera(20, W / H, 0.1, 100);

function shoot(
  product: Product,
  { focus, height, time, turn }: { focus?: [number, number]; height: number; time: number; turn: number },
) {
  const garment = createGarment(renderer, product.garment, { textureSize: 2048, segments: 160 });
  garment.uniforms.uTime.value = time;
  garment.uniforms.uWind.value = 0.55;
  garment.object.rotation.y = turn;
  scene.add(garment.object);
  scene.updateMatrixWorld(true);

  const target = focus ? garment.anchor(...focus) : new THREE.Vector3(0, 0.29, 0);
  const dist = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  camera.position.set(target.x + dist * 0.06, target.y + dist * 0.02, target.z + dist);
  camera.lookAt(target);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/webp', 0.9);

  scene.remove(garment.object);
  garment.dispose();
  return url;
}

window.renderAll = async () => {
  await Promise.all([
    document.fonts.load('600 60px "Montserrat Variable"'),
    document.fonts.load('600 94px "Cormorant"'),
  ]);
  const out: Record<string, string> = {};
  products.forEach((p, i) => {
    out[p.id] = shoot(p, { height: 3.35, time: 1.4 + i * 0.9, turn: -0.16 });
  });
  detailShots.forEach((d, i) => {
    const p = products.find((x) => x.id === d.product)!;
    out[d.id] = shoot(p, { focus: d.focus, height: d.height, time: 2 + i, turn: -0.22 });
  });
  return out;
};
