import * as THREE from 'three';
import { createGarment, addStudioLights } from './garment';
import type { GarmentConfig } from './garmentTexture';

export interface Hotspot {
  el: HTMLElement;
  /** Point on the garment, in the 1024 design space. */
  x: number;
  y: number;
}

export interface HeroScene {
  setProgress(p: number): void;
  dispose(): void;
}

// Garment bounds in world units (hook tip to hem, sleeve to sleeve).
const GARMENT_H = 2.95;
const GARMENT_W = 2.66;
const GARMENT_CY = 0.26;

function dustTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function createDust(count: number) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
    speeds[i] = 0.04 + Math.random() * 0.08;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.035,
    map: dustTexture(),
    color: '#e0c48a',
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.speeds = speeds;
  return points;
}

/**
 * Hero scene: a TEOCORS tee hanging from a gold hanger, moving like cloth,
 * following the pointer and turning as the page scrolls.
 */
export async function createHeroScene({
  canvas,
  container,
  garment: garmentConfig,
  hotspots = [],
  reducedMotion,
}: {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  garment: GarmentConfig;
  hotspots?: Hotspot[];
  reducedMotion: boolean;
}): Promise<HeroScene> {
  await Promise.all([
    document.fonts.load('600 60px "Montserrat Variable"'),
    document.fonts.load('600 94px "Cormorant"'),
  ]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const lights = addStudioLights(scene);
  const garment = createGarment(renderer, garmentConfig, { textureSize: 2048, segments: 150 });
  scene.add(garment.object);
  const dust = createDust(reducedMotion ? 0 : 260);
  scene.add(dust);

  const state = {
    pointer: new THREE.Vector2(),
    target: new THREE.Vector2(),
    wind: 1,
    progress: 0,
    time: 1.6,
    running: false,
    width: 1,
    height: 1,
    mobile: false,
  };
  const camTarget = new THREE.Vector3();
  const baseCam = new THREE.Vector3();
  const baseY = garment.object.position.y;

  function layout() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    state.width = w;
    state.height = h;
    state.mobile = w / h < 0.85;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tan = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitH = GARMENT_H / (state.mobile ? 0.56 : 0.74);
    const fitW = GARMENT_W / (state.mobile ? 0.86 : 0.5) / camera.aspect;
    const visH = Math.max(fitH, fitW);
    // Where the garment centre sits on screen (fractions of width / height).
    const screenX = camera.aspect > 1.2 ? 0.57 : 0.5;
    const screenY = state.mobile ? 0.36 : 0.5;
    camTarget.set(-(screenX - 0.5) * visH * camera.aspect, GARMENT_CY - (0.5 - screenY) * visH, 0);
    baseCam.set(camTarget.x, camTarget.y, visH / tan);
    camera.updateProjectionMatrix();
  }

  const onPointer = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    state.wind = Math.min(2.2, state.wind + Math.hypot(x - state.target.x, y - state.target.y) * 1.6);
    state.target.set(x, y);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const projected = new THREE.Vector3();
  function placeHotspots() {
    for (const h of hotspots) {
      projected.copy(garment.anchor(h.x, h.y)).project(camera);
      const sx = (projected.x * 0.5 + 0.5) * state.width;
      const sy = (-projected.y * 0.5 + 0.5) * state.height;
      h.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
    }
  }

  let last = performance.now();
  function frame(now = performance.now()) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reducedMotion) state.time += dt;
    state.pointer.lerp(state.target, 1 - Math.exp(-dt * 3));
    state.wind += (1 - state.wind) * (1 - Math.exp(-dt * 1.2));

    const { pointer, progress, time } = state;
    garment.uniforms.uTime.value = time;
    garment.uniforms.uWind.value = state.wind;
    const swing = reducedMotion ? 0 : Math.sin(time * 0.45) * 0.03;
    garment.object.rotation.set(pointer.y * 0.08, pointer.x * 0.38 - 0.12 + progress * 1.1, swing);
    garment.object.position.y = baseY + progress * 0.5;

    lights.key.position.set(3.2 + pointer.x * 2.5, 3.5 - pointer.y * 1.5, 5);

    camera.position.copy(baseCam);
    camera.position.z *= 1 - progress * 0.18;
    camera.position.x = baseCam.x - pointer.x * 0.25;
    camera.lookAt(camTarget);

    if (dust.userData.speeds) {
      const pos = dust.geometry.attributes.position as THREE.BufferAttribute;
      const sp = dust.userData.speeds as Float32Array;
      for (let i = 0; i < sp.length; i++) {
        let y = pos.getY(i) + sp[i] * dt;
        if (y > 3) y = -3;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(time * 0.3 + i) * 0.0008);
      }
      pos.needsUpdate = true;
    }

    renderer.render(scene, camera);
    placeHotspots();
  }

  function setRunning(on: boolean) {
    if (on === state.running) return;
    state.running = on;
    last = performance.now();
    renderer.setAnimationLoop(on ? frame : null);
  }

  const resizeObserver = new ResizeObserver(() => {
    layout();
    if (!state.running) frame();
  });
  resizeObserver.observe(container);
  layout();

  let inView = true;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    setRunning(inView && !document.hidden);
  });
  io.observe(container);
  const onVisibility = () => setRunning(inView && !document.hidden);
  document.addEventListener('visibilitychange', onVisibility);

  frame();
  setRunning(true);

  return {
    setProgress(p) {
      state.progress = p;
    },
    dispose() {
      setRunning(false);
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      garment.dispose();
      renderer.dispose();
    },
  };
}
