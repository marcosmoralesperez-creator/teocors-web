// Studio renderer for the catalogue photos (driven by scripts/render-products.mjs).
// Each shot builds a piece, lays it on the table and frames it.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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
  threadMaterial,
  wovenCord,
  macrame,
  slidingKnot,
  goldBead,
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

/**
 * Woven bracelet lying flat: braided cord, an optional macramé band at the
 * bottom with the gold piece on it, and the sliding knot with two tails on top.
 */
function manilla(color, center) {
  const thread = threadMaterial(color);
  const curve = ovalCurve(0.62, 0.5);
  const g = new THREE.Group();
  g.add(wovenCord(curve, { width: 0.055, material: thread }));
  const bottom = curve.getPointAt(0.75);
  if (center.band) g.add(macrame(curve, 0.62, 0.88, { width: 0.13, material: thread }));
  const lift = center.band ? 0.05 : 0.03;
  if (center.beads) {
    for (let i = 0; i < center.beads; i++) {
      const t = 0.75 + (i - (center.beads - 1) / 2) * 0.035;
      const b = goldBead(m, 0.052);
      b.position.copy(curve.getPointAt(t)).setZ(0.03);
      g.add(b);
    }
  }
  if (center.piece) {
    const piece = center.piece();
    piece.position.set(bottom.x, bottom.y, lift);
    g.add(piece);
  }
  // Sliding knot on top, with the two tails ending in gold beads.
  g.add(slidingKnot(curve, 0.25, { width: 0.055, material: thread }));
  const top = curve.getPointAt(0.25);
  for (const side of [-1, 1]) {
    const tail = new THREE.CatmullRomCurve3([
      top.clone().add(new THREE.Vector3(side * 0.12, 0.0, 0.02)),
      top.clone().add(new THREE.Vector3(side * 0.24, 0.12, 0.01)),
      top.clone().add(new THREE.Vector3(side * 0.3, 0.3, 0)),
    ]);
    g.add(wovenCord(tail, { width: 0.05, material: thread }));
    const end = goldBead(m, 0.045);
    end.position.copy(tail.getPointAt(1)).setZ(0.02);
    g.add(end);
  }
  return layFlat(g, center.spin ?? 0);
}

/** Small polished plate, long side along X, for ID bracelets and manillas. */
function plate(w, h) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.05, 4, 0.02), m.gold);
  mesh.castShadow = true;
  return mesh;
}

// Same palette as threadColors in src/data/products.ts; the slug names the photo.
const threadColors = {
  negro: '#0b0b0b',
  cafe: '#4a2c19',
  rojo: '#7a1010',
  'azul-noche': '#121c33',
  'verde-oliva': '#3d4426',
  beige: '#9c7f55',
};

const manillas = {
  'manilla-balines': { color: 'cafe', beads: 5, spin: 0.12 },
  'manilla-placa': { color: 'negro', band: true, piece: () => plate(0.34, 0.13), spin: -0.1 },
  'manilla-cruz': {
    color: 'rojo',
    piece: () => {
      const c = icedCross(m, { h: 0.3, iced: false });
      c.rotation.z = Math.PI / 2; // lying along the cord, as on most woven bracelets
      return c;
    },
    spin: 0.08,
  },
  'manilla-inicial': { color: 'azul-noche', band: true, piece: () => letterS(m, { size: 0.3, iced: false, width: 0.07 }).group, spin: -0.06 },
};

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
  'pulso-esclava': () => {
    const g = new THREE.Group();
    g.add(cubanChain(ovalCurve(0.62, 0.5), { width: 0.11, materials: m }));
    const p = plate(0.6, 0.2);
    p.position.set(0, -0.5, 0.045);
    g.add(p);
    return layFlat(g, 0.15);
  },
  'pulso-rigido': () => {
    const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.06, 32, 160), m.gold);
    bangle.scale.set(1.12, 0.92, 0.75);
    return layFlat(bangle, 0.2);
  },
  'pulso-soga': () => layFlat(ropeChain(ovalCurve(0.62, 0.5), { width: 0.1, materials: m }), -0.2),
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
  // Single earrings for "Crea tu estilo" (one ear only).
  'topos-solitario--uno': () => {
    const st = stud(m, 0.13);
    st.rotation.x = -0.9;
    return st;
  },
  'argollas-cubanas--uno': () => {
    const hoop = cubanRing(m, { radius: 0.36, width: 0.15, iced: false });
    hoop.rotation.z = 0.4;
    return layFlat(hoop);
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

// Each manilla: the catalogue photo in its own colour, plus one photo per thread colour.
for (const [id, spec] of Object.entries(manillas)) {
  shots[id] = () => manilla(threadColors[spec.color], spec);
  for (const [slug, color] of Object.entries(threadColors)) shots[`${id}--${slug}`] = () => manilla(color, spec);
}

// Camera elevation per shot (radians above the table); flat pieces are seen from higher up.
const elevation = { 'anillo-sello': 0.42, 'anillo-cubano-iced': 0.5, 'topos-solitario': 0.45 , 'topos-solitario--uno': 0.45 };
const zoom = { 'detalle-iced': 0.62 , 'topos-solitario--uno': 2.3, 'argollas-cubanas--uno': 1.5 };

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
