// Studio renderer for the catalogue photos (driven by scripts/render-products.mjs).
// Each shot builds a piece, lays it on the table and frames it.
import * as THREE from 'three';
import {
  createMaterials,
  setupStudio,
  createShadowCatcher,
  cubanChain,
  ropeChain,
  tennisChain,
  icedPlaque,
  icedCross,
  letterS,
  signetRing,
  cubanRing,
  stud,
  necklaceCurve,
  ovalCurve,
  disposeTree,
} from './jewelry.js';

const W = 1000;
const H = 1250;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
setupStudio(renderer, scene);
const floor = createShadowCatcher(0.2);
scene.add(floor);
const camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100);
const m = createMaterials();

/** Turns a piece modelled in XY (Z up) onto the table (Y up). */
function layFlat(object, spin = 0) {
  const g = new THREE.Group();
  object.rotation.z = spin;
  g.add(object);
  g.rotation.x = -Math.PI / 2;
  return g;
}

/** Chain with a pendant hanging from its lowest point. */
function withPendant(pendant, pendantHeight, { curve = necklaceCurve({ w: 1.7, h: 1.5, drop: 0.3 }) } = {}) {
  const g = new THREE.Group();
  g.add(ropeChain(curve, { width: 0.06, strands: 4, turns: 1.2, materials: m }));
  const low = curve.getPointAt(0.5);
  pendant.position.set(low.x, low.y - pendantHeight / 2 - 0.08, 0.03);
  g.add(pendant);
  return g;
}

const shots = {
  'cubana-iced-14': () => layFlat(cubanChain(ovalCurve(0.78, 1.0), { width: 0.24, iced: true, materials: m }), 0.08),
  'cubana-14': () => layFlat(cubanChain(ovalCurve(0.78, 1.0), { width: 0.22, materials: m }), -0.08),
  'tenis-5': () => layFlat(tennisChain(ovalCurve(0.78, 1.0), { stone: 0.06, materials: m }), 0.06),
  'cubana-8': () => layFlat(cubanChain(ovalCurve(0.78, 1.0), { width: 0.15, materials: m }), 0.05),
  'franco-4': () => layFlat(ropeChain(ovalCurve(0.78, 1.0), { width: 0.1, strands: 4, turns: 1.1, materials: m }), 0.04),
  'soga-5': () => layFlat(ropeChain(ovalCurve(0.78, 1.0), { width: 0.12, materials: m }), -0.06),
  'placa-iced': () => layFlat(withPendant(icedPlaque(m), 0.86)),
  'cruz-iced': () => layFlat(withPendant(icedCross(m), 0.95)),
  'inicial-s': () => {
    const { group } = letterS(m, { size: 0.85 });
    return layFlat(withPendant(group, 0.85));
  },
  'pulsera-cubana-iced': () => layFlat(cubanChain(ovalCurve(0.62, 0.5), { width: 0.18, iced: true, materials: m }), 0.3),
  'pulsera-cubana': () => layFlat(cubanChain(ovalCurve(0.62, 0.5), { width: 0.17, materials: m }), -0.3),
  'pulsera-tenis': () => layFlat(tennisChain(ovalCurve(0.6, 0.48), { stone: 0.055, materials: m }), 0.2),
  'anillo-sello': () => {
    const ring = signetRing(m);
    ring.rotation.x = 0.55;
    ring.rotation.y = 0.35;
    return ring;
  },
  'anillo-cubano-iced': () => {
    const ring = cubanRing(m);
    ring.rotation.x = -1.05;
    ring.rotation.z = 0.4;
    return ring;
  },
  'topos-solitario': () => {
    const g = new THREE.Group();
    [-0.22, 0.22].forEach((x, i) => {
      const s = stud(m, 0.13);
      s.position.set(x, 0, i ? -0.12 : 0.1);
      s.rotation.x = -0.9;
      g.add(s);
    });
    return g;
  },
  'argollas-cubanas': () => {
    const g = new THREE.Group();
    [[-0.3, 0.15, 0.4], [0.28, -0.2, -0.3]].forEach(([x, y, spin]) => {
      const hoop = cubanRing(m, { radius: 0.36, width: 0.15, iced: false });
      hoop.position.set(x, y, 0);
      hoop.rotation.z = spin;
      g.add(hoop);
    });
    return layFlat(g);
  },
  // Close crop of the house chain for the 3D/detail sections.
  'detalle-iced': () => {
    const curve = new THREE.CatmullRomCurve3(
      [[-0.9, -2.2], [-0.55, -1.0], [0.25, -0.25], [0.55, 0.9], [0.2, 2.2]].map(([x, y]) => new THREE.Vector3(x, y, 0)),
    );
    return layFlat(cubanChain(curve, { width: 0.42, iced: true, materials: m }));
  },
};

// Camera elevation per shot (radians above the table); flat pieces are seen from higher up.
const elevation = { 'anillo-sello': 0.42, 'anillo-cubano-iced': 0.5, 'topos-solitario': 0.45 };
const zoom = { 'detalle-iced': 0.62 };

/** World box that accounts for every instance (Box3.setFromObject does not). */
function boxOf(object) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  const part = new THREE.Box3();
  const m4 = new THREE.Matrix4();
  object.traverse((o) => {
    if (!o.geometry) return;
    o.geometry.computeBoundingBox();
    const count = o.isInstancedMesh ? o.count : 1;
    for (let i = 0; i < count; i++) {
      if (o.isInstancedMesh) o.getMatrixAt(i, m4);
      else m4.identity();
      part.copy(o.geometry.boundingBox).applyMatrix4(m4).applyMatrix4(o.matrixWorld);
      box.union(part);
    }
  });
  return box;
}

function frame(object, id) {
  let box = boxOf(object);
  object.position.y -= box.min.y; // rest on the table
  box = boxOf(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const elev = elevation[id] ?? 1.05;
  const fitH = Math.max(size.z * Math.sin(elev) + size.y * Math.cos(elev), (size.x * H) / W);
  const dist = ((fitH * 1.28) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * (zoom[id] ?? 1);
  camera.position.set(center.x, center.y + Math.sin(elev) * dist, center.z + Math.cos(elev) * dist);
  camera.lookAt(center);
  floor.position.y = 0;
}

function shoot(id) {
  const object = shots[id]();
  object.traverse((o) => (o.castShadow = true));
  scene.add(object);
  scene.updateMatrixWorld(true);
  frame(object, id);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/webp', 0.9);
  scene.remove(object);
  disposeTree(object);
  return url;
}

window.shotIds = Object.keys(shots);
window.shoot = shoot;
