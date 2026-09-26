import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Posiciones de las cinco estrellas del logo (mismo dibujo que StarsMark, 34×34).
const LOGO = [
  [10, 7],
  [24, 7],
  [5, 18],
  [29, 18],
  [17, 27],
];

/** Estrella de cuatro puntas con lados curvos, como las del logo. */
function sparkleShape(r: number) {
  const s = new THREE.Shape();
  const k = r * 0.16; // qué tan cerrada es la cintura entre puntas
  s.moveTo(0, r);
  s.quadraticCurveTo(k, k, r, 0);
  s.quadraticCurveTo(k, -k, 0, -r);
  s.quadraticCurveTo(-k, -k, -r, 0);
  s.quadraticCurveTo(-k, k, 0, r);
  return s;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export type EmblemScene = {
  /** Progreso del capítulo, 0–1. */
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  /** Posición en pantalla (px) y visibilidad de cada estrella, para las etiquetas. */
  onLabels(cb: (items: { x: number; y: number; show: number }[]) => void): void;
  start(): void;
  stop(): void;
  dispose(): void;
};

export function createEmblemScene(canvas: HTMLCanvasElement, { reducedMotion = false } = {}): EmblemScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 13);

  // Luz cálida de costado y un contraluz frío: los bordes biselados brillan.
  const key = new THREE.DirectionalLight('#ffe6c4', 2.4);
  key.position.set(4, 5, 6);
  const rim = new THREE.DirectionalLight('#b9c8ff', 1.6);
  rim.position.set(-6, -2, -4);
  scene.add(key, rim);

  const material = new THREE.MeshPhysicalMaterial({
    color: '#e3ddd2',
    metalness: 1,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.25,
  });
  const geometry = new THREE.ExtrudeGeometry(sparkleShape(1.25), {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelSegments: 10,
    curveSegments: 40,
  });
  geometry.center();

  const group = new THREE.Group();
  scene.add(group);
  const stars = LOGO.map(([x, y], i) => {
    const mesh = new THREE.Mesh(geometry, material);
    const base = new THREE.Vector3((x - 17) / 4.3, -(y - 17) / 4.3, 0);
    mesh.position.copy(base);
    group.add(mesh);
    return {
      mesh,
      base,
      // Hacia dónde sale al separarse: desde el centro, con algo de profundidad.
      out: base.clone().normalize().multiplyScalar(1.9).add(new THREE.Vector3(0, 0, [1.4, -1.2, 0.6, -0.8, 1.8][i])),
      spin: i % 2 ? 1 : -1,
    };
  });

  let progress = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let labelsCb: ((items: { x: number; y: number; show: number }[]) => void) | null = null;
  let raf = 0;
  let running = false;
  const timer = new THREE.Timer();
  const v = new THREE.Vector3();

  const spread = new THREE.Vector3(1.6, 0.62, 1);
  const tmp = new THREE.Vector3();
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas angostas se aleja la cámara para que quepa todo.
    camera.position.z = w < h ? 34 : 19;
    // Pantalla ancha: se abren hacia los lados; angosta: hacia arriba y abajo.
    spread.set(w < h ? 0.5 : 1.6, w < h ? 0.95 : 0.62, 1);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const render = () => {
    timer.update();
    const t = reducedMotion ? 0 : timer.getElapsed();
    const p = progress;
    pointer.sx += (pointer.x - pointer.sx) * 0.06;
    pointer.sy += (pointer.y - pointer.sy) * 0.06;

    const enter = smooth(0, 0.28, p);
    const explode = smooth(0.3, 0.5, p) * (1 - smooth(0.7, 0.88, p));
    const settle = smooth(0.82, 1, p);

    group.rotation.y = (1 - enter) * -1.4 + settle * 0.55 + pointer.sx * 0.35 + Math.sin(t * 0.4) * 0.05;
    group.rotation.x = (1 - enter) * 0.5 - pointer.sy * 0.25 + Math.cos(t * 0.33) * 0.03;
    group.position.y = 0.35 - explode * 0.25 + Math.sin(t * 0.8) * 0.08;
    const s = 0.65 + enter * 0.35 - explode * 0.26;
    group.scale.setScalar(s);

    for (const st of stars) {
      st.mesh.position.copy(st.base).add(tmp.copy(st.out).multiply(spread).multiplyScalar(explode));
      st.mesh.rotation.z = explode * Math.PI * 0.5 * st.spin;
      st.mesh.rotation.y = explode * Math.PI * st.spin + settle * 0.2;
    }

    renderer.render(scene, camera);

    if (labelsCb) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      labelsCb(
        stars.map((st) => {
          st.mesh.getWorldPosition(v).project(camera);
          return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, show: smooth(0.42, 0.5, p) * (1 - smooth(0.66, 0.72, p)) };
        }),
      );
    }
  };

  const loop = () => {
    render();
    raf = requestAnimationFrame(loop);
  };

  return {
    setProgress(p) {
      progress = p;
      if (!running) render();
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    onLabels(cb) {
      labelsCb = cb;
    },
    start() {
      if (running) return;
      running = true;
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      this.stop();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
