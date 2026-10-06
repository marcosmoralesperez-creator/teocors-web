import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Every piece is modelled lying in the XY plane with Z pointing up out of the
// table; `layFlat` turns it onto the ground for the camera.

const Z = new THREE.Vector3(0, 0, 1);
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpS = new THREE.Vector3(1, 1, 1);

/* ---------------------------------------------------------------- materials */

export function createMaterials() {
  const gold = new THREE.MeshPhysicalMaterial({
    color: '#ffbf4d',
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.25,
  });
  const goldSatin = gold.clone();
  goldSatin.roughness = 0.32;
  const diamond = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.8,
    roughness: 0.0,
    envMapIntensity: 2.2,
    iridescence: 0.9,
    iridescenceIOR: 2.1,
    iridescenceThicknessRange: [180, 620],
    flatShading: true,
    side: THREE.DoubleSide,
  });
  return { gold, goldSatin, diamond };
}

/**
 * Dark studio with a few bright softboxes: polished gold needs dark areas to
 * reflect, and stones only sparkle when facets alternate light and dark.
 */
function studioEnvironment() {
  const env = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshBasicMaterial({ color: '#8c7b62', side: THREE.BackSide }),
  );
  env.add(room);
  const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: '#6b5a40' }));
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.y = -6;
  env.add(floorGlow);
  const panel = (w, h, pos, intensity, color = '#ffffff') => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };
  panel(26, 16, [0, 12, -2], 2.2); // big overhead softbox
  panel(8, 5, [0, 9, 9], 3); // front-top, what flat pieces reflect toward the camera
  panel(4, 10, [-11, 3, 5], 2.4, '#fff1d6'); // key strip
  panel(4, 10, [11, 2, -3], 1.8, '#ffe4b8'); // rim strip
  panel(6, 3, [2, 4, 12], 1.6); // front fill
  panel(1.5, 1.5, [-5, 9, -8], 6); // small hard kicker
  panel(1.2, 1.2, [7, 7, 7], 6);
  return env;
}

/** Studio environment and lights shared by the hero and the product renders. */
export function setupStudio(renderer, scene, { shadow = true } = {}) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = studioEnvironment();
  scene.environment = pmrem.fromScene(env, 0.02).texture;
  scene.environmentIntensity = 1;
  pmrem.dispose();
  env.traverse((o) => o.geometry?.dispose());

  const key = new THREE.DirectionalLight('#fff3dc', 2.4);
  key.position.set(-2.5, 6, 3.5);
  if (shadow) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 20 });
  }
  scene.add(key);
  const rim = new THREE.DirectionalLight('#ffe2b0', 1.4);
  rim.position.set(4, 2.5, -4);
  scene.add(rim);
  // Small hard points give the stones their glints.
  const glints = [
    [-3, 4, 4],
    [3, 5, 2],
    [0, 3, -3],
  ].map(([x, y, z]) => {
    const l = new THREE.PointLight('#ffffff', 22, 0, 2);
    l.position.set(x, y, z);
    scene.add(l);
    return l;
  });
  return { key, rim, glints };
}

/** Ground that only shows the soft contact shadow (transparent elsewhere). */
export function createShadowCatcher(opacity = 0.22) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity }));
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  return plane;
}

/* ---------------------------------------------------------------- primitives */

/** Round brilliant cut, girdle radius 1, table up (+Z). Flat-shaded, so winding is irrelevant. */
function brilliantGeometry() {
  const pos = [];
  const n = 8;
  const crownH = 0.32;
  const pavilion = 0.86;
  const at = (r, a, z) => [r * Math.cos(a), r * Math.sin(a), z];
  const tri = (a, b, c) => pos.push(...a, ...b, ...c);
  const top = [0, 0, crownH];
  const tip = [0, 0, -pavilion];
  const step = Math.PI / n;
  const t = (k) => at(0.56, k * 2 * step, crownH);
  const g = (k) => at(1, k * step, 0);
  for (let k = 0; k < n; k++) {
    tri(top, t(k), t(k + 1));
    tri(t(k), g(2 * k), g(2 * k + 1));
    tri(t(k), g(2 * k + 1), t(k + 1));
    tri(t(k + 1), g(2 * k + 1), g(2 * k + 2));
  }
  for (let i = 0; i < n * 2; i++) {
    const mid = at(0.42, (i + 0.5) * step, -pavilion * 0.55);
    tri(g(i + 1), g(i), mid);
    tri(mid, g(i), tip);
    tri(g(i + 1), mid, tip);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

let brilliant;
const stoneGeometry = () => (brilliant ??= brilliantGeometry());

/**
 * Oval link with a rounded-square section. `tilt` twists the two long sides in
 * opposite directions and `rise` lifts one end and drops the other, which is
 * what lets cuban links lie flat while interlocking.
 */
function linkGeometry({ a, b, w, h, tilt = 0, rise = 0, segU = 64, segV = 24, squareness = 3.2 }) {
  const positions = [];
  const index = [];
  const p = 2 / squareness;
  const sgnPow = (x) => Math.sign(x) * Math.abs(x) ** p;
  const N = new THREE.Vector3();
  const T = new THREE.Vector3();
  const up = new THREE.Vector3();
  const v3 = new THREE.Vector3();
  for (let i = 0; i < segU; i++) {
    const u = (i / segU) * Math.PI * 2;
    const cx = a * Math.cos(u);
    const cy = b * Math.sin(u);
    const cz = rise * Math.cos(u);
    T.set(-a * Math.sin(u), b * Math.cos(u), -rise * Math.sin(u)).normalize();
    N.set(b * Math.cos(u), a * Math.sin(u), 0).normalize();
    up.copy(Z);
    // Twist the section about the tangent: opposite sign on each long side.
    const theta = tilt * Math.sin(u);
    N.applyAxisAngle(T, theta);
    up.applyAxisAngle(T, theta);
    for (let j = 0; j < segV; j++) {
      const v = (j / segV) * Math.PI * 2;
      v3.set(cx, cy, cz)
        .addScaledVector(N, w * sgnPow(Math.cos(v)))
        .addScaledVector(up, h * sgnPow(Math.sin(v)));
      positions.push(v3.x, v3.y, v3.z);
      const i1 = (i + 1) % segU;
      const j1 = (j + 1) % segV;
      const A = i * segV + j;
      const B = i1 * segV + j;
      const C = i1 * segV + j1;
      const D = i * segV + j1;
      index.push(A, B, D, B, C, D);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Points on the top face of a link's long sides, for pavé stones. */
function linkPaveSpots({ a, b, h, tilt = 0, rise = 0 }, perSide) {
  const spots = [];
  const T = new THREE.Vector3();
  for (const side of [1, -1]) {
    for (let k = 0; k < perSide; k++) {
      const f = (k + 0.5) / perSide;
      const u = side > 0 ? 0.22 * Math.PI + f * 0.56 * Math.PI : 1.22 * Math.PI + f * 0.56 * Math.PI;
      T.set(-a * Math.sin(u), b * Math.cos(u), -rise * Math.sin(u)).normalize();
      const n = Z.clone().applyAxisAngle(T, tilt * Math.sin(u));
      const p = new THREE.Vector3(a * Math.cos(u), b * Math.sin(u), rise * Math.cos(u)).addScaledVector(n, h * 0.96);
      spots.push({ p, n });
    }
  }
  return spots;
}

/** Frame (tangent, side, normal) along a curve lying on a surface with normal `up`. */
function frameAt(curve, t, up = Z) {
  const pos = curve.getPointAt(t);
  const T = curve.getTangentAt(t).normalize();
  const n = typeof up === 'function' ? up(pos) : up;
  const B = new THREE.Vector3().crossVectors(n, T).normalize();
  const U = new THREE.Vector3().crossVectors(T, B).normalize();
  return { pos, T, B, U };
}

function basisMatrix({ pos, T, B, U }, roll = 0, lift = 0) {
  const m = new THREE.Matrix4().makeBasis(T, B, U);
  if (roll) m.multiply(new THREE.Matrix4().makeRotationX(roll));
  m.setPosition(pos.clone().addScaledVector(U, lift));
  return m;
}

function instanced(geometry, material, matrices) {
  const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
  matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  mesh.computeBoundingBox();
  mesh.computeBoundingSphere();
  return mesh;
}

/** Instance matrices for stones of radius r sitting at spots, seen through `parent`. */
function stoneMatrices(spots, r, parent = new THREE.Matrix4()) {
  return spots.map(({ p, n }) => {
    tmpQ.setFromUnitVectors(Z, n);
    tmpS.setScalar(r);
    tmpM.compose(p.clone().addScaledVector(n, r * 0.05), tmpQ, tmpS);
    return parent.clone().multiply(tmpM);
  });
}

/* ---------------------------------------------------------------- chains */

/**
 * Cuban (Miami) link chain along a curve. `width` is the link width; `iced`
 * sets pavé stones on every link.
 */
export function cubanChain(curve, { width = 0.14, iced = false, up = Z, materials }) {
  const spec = {
    a: width * 0.6,
    b: width * 0.42,
    w: width * 0.2,
    h: width * 0.11,
    tilt: 0.7,
    rise: width * 0.06,
  };
  const pitch = spec.a * 0.98;
  const count = Math.max(2, Math.round(curve.getLength() / pitch));
  const closed = curve.closed ?? curve.autoClose ?? false;
  const links = [];
  for (let i = 0; i < count; i++) {
    const t = closed ? i / count : i / (count - 1);
    links.push(basisMatrix(frameAt(curve, Math.min(t, 1), up), i % 2 ? Math.PI : 0));
  }
  const group = new THREE.Group();
  group.add(instanced(linkGeometry(spec), materials.gold, links));
  if (iced) {
    const spots = linkPaveSpots(spec, 5);
    const r = spec.w * 0.66;
    group.add(instanced(stoneGeometry(), materials.diamond, links.flatMap((m) => stoneMatrices(spots, r, m))));
  }
  return group;
}

/** Rope chain: twisted strands around the curve. Fewer, tighter strands read as a franco. */
export function ropeChain(curve, { width = 0.08, strands = 3, turns = 1.8, up = Z, materials, material }) {
  const group = new THREE.Group();
  const length = curve.getLength();
  const pitch = width * turns;
  const samples = Math.ceil((length / pitch) * 24);
  const r = width * 0.3;
  const tube = width * 0.24;
  for (let s = 0; s < strands; s++) {
    const pts = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const { pos, B, U } = frameAt(curve, t, up);
      const ang = ((t * length) / pitch) * Math.PI * 2 + (s / strands) * Math.PI * 2;
      pts.push(pos.addScaledVector(B, Math.cos(ang) * r).addScaledVector(U, Math.sin(ang) * r));
    }
    const path = new THREE.CatmullRomCurve3(pts);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, samples, tube, 10, false), material ?? materials.gold);
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}

/** Four-prong setting for one stone, girdle radius 1, sitting on z = 0. */
function prongSettingGeometry({ square = true } = {}) {
  const parts = [];
  const cup = new THREE.CylinderGeometry(1.02, 0.7, 0.55, 24, 1, true);
  cup.rotateX(Math.PI / 2);
  cup.translate(0, 0, -0.32);
  parts.push(cup);
  if (square) {
    const base = new RoundedBoxGeometry(2.1, 2.1, 0.5, 3, 0.18);
    base.translate(0, 0, -0.62);
    parts.push(base);
  } else {
    const base = new THREE.CylinderGeometry(0.62, 0.4, 0.5, 24);
    base.rotateX(Math.PI / 2);
    base.translate(0, 0, -0.78);
    parts.push(base);
  }
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const prong = new THREE.CapsuleGeometry(0.13, 0.62, 4, 10);
    prong.rotateX(Math.PI / 2);
    prong.translate(Math.cos(a) * 1.0, Math.sin(a) * 1.0, -0.12);
    parts.push(prong);
  }
  const merged = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)));
  merged.computeVertexNormals();
  return merged;
}

/** Tennis chain or bracelet: a single row of prong-set stones. */
export function tennisChain(curve, { stone = 0.05, up = Z, materials }) {
  const pitch = stone * 2.2;
  const closed = curve.closed ?? curve.autoClose ?? false;
  const count = Math.max(2, Math.round(curve.getLength() / pitch));
  const settings = [];
  for (let i = 0; i < count; i++) {
    const t = closed ? i / count : i / (count - 1);
    const m = basisMatrix(frameAt(curve, Math.min(t, 1), up), 0, stone * 0.7);
    settings.push(m.multiply(new THREE.Matrix4().makeScale(stone, stone, stone)));
  }
  const group = new THREE.Group();
  group.add(instanced(prongSettingGeometry(), materials.gold, settings));
  group.add(instanced(stoneGeometry(), materials.diamond, settings.map((m) => m.clone().multiply(new THREE.Matrix4().makeScale(0.97, 0.97, 0.97)))));
  return group;
}

/* ---------------------------------------------------------------- pendants */

function gridSpots(width, height, z, step, keep = () => true) {
  const spots = [];
  const nx = Math.floor(width / step);
  const ny = Math.floor(height / step);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const x = (i - (nx - 1) / 2) * step;
      const y = (j - (ny - 1) / 2) * step;
      if (keep(x, y)) spots.push({ p: new THREE.Vector3(x, y, z), n: Z.clone() });
    }
  }
  return spots;
}

function bail(materials, size) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(size, size * 0.28, 16, 40), materials.gold);
  ring.rotation.y = Math.PI / 2;
  ring.castShadow = true;
  return ring;
}

/** Rectangular plaque fully set with stones (the "dog tag" in the hero photo). */
export function icedPlaque(materials, { w = 0.62, h = 0.86 } = {}) {
  const group = new THREE.Group();
  const depth = 0.1;
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, depth, 4, 0.045), materials.gold);
  body.castShadow = true;
  group.add(body);
  const step = 0.052;
  const spots = gridSpots(w - 0.07, h - 0.07, depth / 2 - 0.004, step);
  group.add(instanced(stoneGeometry(), materials.diamond, stoneMatrices(spots, step * 0.47)));
  const b = bail(materials, 0.06);
  b.position.set(0, h / 2 + 0.07, 0);
  group.add(b);
  return group;
}

/** Latin cross set with stones. */
export function icedCross(materials, { h = 0.95 } = {}) {
  const group = new THREE.Group();
  const arm = h * 0.2;
  const depth = 0.09;
  const v = new RoundedBoxGeometry(arm, h, depth, 4, 0.03);
  const hz = new RoundedBoxGeometry(h * 0.66, arm, depth, 4, 0.03);
  hz.translate(0, h * 0.16, 0);
  const body = new THREE.Mesh(mergeGeometries([v, hz]), materials.gold);
  body.castShadow = true;
  group.add(body);
  const step = arm / 3.2;
  const z = depth / 2 - 0.003;
  const inside = (x, y) => (Math.abs(x) < arm / 2 - 0.02) || (Math.abs(y - h * 0.16) < arm / 2 - 0.02 && Math.abs(x) < h * 0.33 - 0.02);
  const spots = gridSpots(h * 0.66, h, z, step, inside).filter(({ p }) => Math.abs(p.y) < h / 2 - 0.02);
  group.add(instanced(stoneGeometry(), materials.diamond, stoneMatrices(spots, step * 0.46)));
  const b = bail(materials, 0.055);
  b.position.set(0, h / 2 + 0.06, 0);
  group.add(b);
  return group;
}

/** The house "S": a flat ribbon that can carry pavé. */
export function letterS(materials, { size = 0.9, iced = true, width } = {}) {
  const s = size;
  const curve = new THREE.CurvePath();
  curve.add(new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.34 * s, 0.32 * s, 0),
    new THREE.Vector3(0.22 * s, 0.56 * s, 0),
    new THREE.Vector3(-0.38 * s, 0.52 * s, 0),
    new THREE.Vector3(-0.3 * s, 0.2 * s, 0),
  ));
  curve.add(new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.3 * s, 0.2 * s, 0),
    new THREE.Vector3(-0.22 * s, -0.04 * s, 0),
    new THREE.Vector3(0.32 * s, -0.02 * s, 0),
    new THREE.Vector3(0.3 * s, -0.24 * s, 0),
  ));
  curve.add(new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.3 * s, -0.24 * s, 0),
    new THREE.Vector3(0.28 * s, -0.56 * s, 0),
    new THREE.Vector3(-0.26 * s, -0.54 * s, 0),
    new THREE.Vector3(-0.36 * s, -0.3 * s, 0),
  ));
  const ribbon = width ?? s * 0.16;
  const group = new THREE.Group();
  const shapeW = ribbon / 2;
  const shapeH = ribbon * 0.28;
  // Ribbon: a rounded-rectangle tube with the flat face up.
  const samples = 160;
  const segV = 20;
  const positions = [];
  const index = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const { pos, B, U } = frameAt(curve, t);
    for (let j = 0; j < segV; j++) {
      const v = (j / segV) * Math.PI * 2;
      const c = Math.cos(v);
      const si = Math.sin(v);
      const p = pos.clone()
        .addScaledVector(B, shapeW * Math.sign(c) * Math.abs(c) ** 0.5)
        .addScaledVector(U, shapeH * Math.sign(si) * Math.abs(si) ** 0.5);
      positions.push(p.x, p.y, p.z);
      if (i < samples) {
        const j1 = (j + 1) % segV;
        const A = i * segV + j;
        index.push(A, (i + 1) * segV + j, i * segV + j1, (i + 1) * segV + j, (i + 1) * segV + j1, i * segV + j1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  const body = new THREE.Mesh(g, materials.gold);
  body.castShadow = true;
  group.add(body);
  // Rounded ends on the pendant; the low relief on the signet stays clean.
  for (const t of iced ? [0, 1] : []) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), materials.gold);
    cap.scale.set(shapeW, shapeW, shapeH);
    cap.position.copy(curve.getPointAt(t));
    group.add(cap);
  }
  if (iced) {
    const r = ribbon * 0.3;
    const n = Math.floor(curve.getLength() / (r * 2.15));
    const spots = [];
    for (let i = 0; i < n; i++) {
      const { pos, U } = frameAt(curve, (i + 0.5) / n);
      spots.push({ p: pos.addScaledVector(U, shapeH * 0.95), n: U });
    }
    group.add(instanced(stoneGeometry(), materials.diamond, stoneMatrices(spots, r)));
  }
  return { group, top: new THREE.Vector3(0.28 * s, 0.47 * s, 0) };
}

/* ---------------------------------------------------------------- rings & studs */

/** Signet ring with the house S raised on its face. Band axis along Y. */
export function signetRing(materials) {
  const group = new THREE.Group();
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.075, 28, 96), materials.gold);
  band.scale.set(1, 1, 1.9);
  band.castShadow = true;
  group.add(band);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.16, 64), materials.goldSatin);
  face.scale.set(1, 1, 0.82);
  face.position.y = 0.46;
  face.castShadow = true;
  group.add(face);
  const { group: s } = letterS(materials, { size: 0.42, iced: false, width: 0.06 });
  s.rotation.x = -Math.PI / 2;
  s.position.y = 0.545;
  group.add(s);
  return group;
}

/** Ring of cuban links facing outwards. Ring axis along Z. */
export function cubanRing(materials, { radius = 0.42, width = 0.2, iced = true } = {}) {
  const radial = (p) => new THREE.Vector3(p.x, p.y, 0).normalize();
  return cubanChain(ovalCurve(radius, radius), { width, iced, up: radial, materials });
}

/** Solitaire stud: stone in a four-prong basket. */
export function stud(materials, r = 0.13) {
  const group = new THREE.Group();
  const setting = new THREE.Mesh(prongSettingGeometry({ square: false }), materials.gold);
  setting.scale.setScalar(r);
  setting.castShadow = true;
  group.add(setting);
  const stone = new THREE.Mesh(stoneGeometry(), materials.diamond);
  stone.scale.setScalar(r * 0.97);
  group.add(stone);
  return group;
}

/* ---------------------------------------------------------------- curves */

/** Closed necklace lying on the table: a soft teardrop that ends in a point. */
export function necklaceCurve({ w = 1.5, h = 2.2, drop = 0 } = {}) {
  const pts = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.sin(a) * w * (0.55 + 0.45 * Math.cos(a) ** 2) * 0.5;
    let y = Math.cos(a) * h * 0.5;
    if (Math.cos(a) < 0) y -= drop * Math.cos(a) ** 8;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
}

export function ovalCurve(rx, ry) {
  const pts = [];
  const n = 64;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

export function disposeTree(object) {
  object.traverse((o) => {
    if (o.geometry && o.geometry !== brilliant) o.geometry.dispose();
  });
}
