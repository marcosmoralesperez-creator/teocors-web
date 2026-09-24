import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { drawGarment, DESIGN_SIZE } from './garmentTexture.js';

// 1024 design px span 3.2 world units.
const UNITS = 3.2;
const PX = UNITS / DESIGN_SIZE;

/** Converts a point in the 1024 design space to garment-local world units. */
export function designToLocal(x, y) {
  return new THREE.Vector3((x - DESIGN_SIZE / 2) * PX, (DESIGN_SIZE / 2 - y) * PX, 0);
}

// Height of the cloth at a local point. Fabric is pinned along the shoulder
// line (where the hanger holds it) and moves more the further it hangs.
const clothGLSL = /* glsl */ `
uniform float uTime;
uniform float uWind;
float clothWeight(vec2 p) {
  float shoulder = 1.38 - 0.35 * min(abs(p.x), 0.9);
  return smoothstep(0.0, 1.9, shoulder - p.y);
}
float clothHeight(vec2 p) {
  float w = clothWeight(p);
  float t = uTime;
  float h = 0.075 * sin(1.6 * p.x + 1.05 * t + 0.9 * p.y);
  h += 0.045 * sin(2.7 * p.y - 1.45 * t + 0.6 * p.x);
  h += 0.020 * sin(4.6 * p.x + 3.3 * p.y + 2.1 * t);
  float folds = 0.028 * sin(6.5 * p.x + 0.8 * sin(0.6 * t));
  return w * (uWind * h + folds);
}
`;

function clothMaterial(texture, g, uniforms) {
  const mat = new THREE.MeshPhysicalMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    alphaToCoverage: true,
    roughness: 0.9,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(g.sheen ?? '#6f6454'),
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWind = uniforms.uWind;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${clothGLSL}`)
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `
        float e = 0.01;
        float dx = clothHeight(position.xy + vec2(e, 0.0)) - clothHeight(position.xy - vec2(e, 0.0));
        float dy = clothHeight(position.xy + vec2(0.0, e)) - clothHeight(position.xy - vec2(0.0, e));
        vec3 objectNormal = normalize(vec3(-dx / (2.0 * e), -dy / (2.0 * e), 1.0));
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`,
      )
      .replace(
        '#include <begin_vertex>',
        'vec3 transformed = vec3(position.xy, position.z + clothHeight(position.xy));',
      );
  };
  return mat;
}

let envTexture = null;
function hookEnvironment(renderer) {
  if (!envTexture) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }
  return envTexture;
}

function createHook(renderer) {
  const pts = [
    [0, 1.3],
    [0, 1.42],
    [0.002, 1.52],
    [0.006, 1.58],
  ];
  const cx = 0.12;
  const cy = 1.6;
  const r = 0.12;
  for (let a = 170; a >= -60; a -= 15) {
    const rad = (a * Math.PI) / 180;
    pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
  }
  const path = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, -0.03)));
  const material = new THREE.MeshStandardMaterial({
    color: '#d6b36c',
    metalness: 1,
    roughness: 0.26,
    envMap: hookEnvironment(renderer),
    envMapIntensity: 1.1,
  });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 160, 0.022, 14, false), material));
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.026, 20, 16), material);
  tip.position.copy(path.getPoint(1));
  group.add(tip);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.08, 20), material);
  collar.position.set(0, 1.34, -0.03);
  group.add(collar);
  return group;
}

/**
 * Builds a hanging garment. The returned group pivots on the hanger hook,
 * so rotating it swings the garment naturally.
 */
export function createGarment(renderer, g, { textureSize = 2048, segments = 140 } = {}) {
  const uniforms = { uTime: { value: 0 }, uWind: { value: 1 } };
  const texture = new THREE.CanvasTexture(drawGarment(g, textureSize));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(UNITS, UNITS, segments, segments),
    clothMaterial(texture, g, uniforms),
  );
  const hook = createHook(renderer);

  const pivotY = 1.72;
  const inner = new THREE.Group();
  inner.position.y = -pivotY;
  inner.add(cloth, hook);
  const pivot = new THREE.Group();
  pivot.position.y = pivotY;
  pivot.add(inner);

  return {
    object: pivot,
    uniforms,
    /** Local point (design px) → world position, including the cloth offset. */
    anchor(x, y) {
      return inner.localToWorld(designToLocal(x, y));
    },
    dispose() {
      texture.dispose();
      cloth.geometry.dispose();
      cloth.material.dispose();
    },
  };
}

/** Warm key, cool grazing rim and a low fill — a small product studio. */
export function addStudioLights(scene) {
  const hemi = new THREE.HemisphereLight('#8d8883', '#15120f', 1.15);
  const key = new THREE.DirectionalLight('#fff1dc', 3.1);
  key.position.set(3.2, 3.5, 5);
  const rim = new THREE.DirectionalLight('#b9c8ff', 1.3);
  rim.position.set(-5, 1.2, 1.2);
  const fill = new THREE.PointLight('#c9a45c', 5, 12, 1.6);
  fill.position.set(0.5, -2.2, 3);
  scene.add(hemi, key, rim, fill);
  return { hemi, key, rim, fill };
}
