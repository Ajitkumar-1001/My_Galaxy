// Solar system in WebGL (ogl, the site's own dependency), projected with the intro's one camera
// (focal length FL, vanishing point F, both in CSS px). Port of the previz assets/lib/solar.js
// (SPEC.md "Pass 3"). Real surfaces: Solar System Scope maps (CC BY 4.0, built from NASA data); the
// sky is ESO/S. Brunier's Milky Way panorama (eso0932a). draw(state) paints one frame from state
// alone. Units: Earth's orbit = 10; orbit radius 10·√a(AU), angular speed 0.09·a^−1.5 rad/s.
// Live additions: a `dpr` option (drawing buffer = CSS size × dpr; every screen-space quantity stays
// in CSS px), `dFar` (the distance at which the Sun reads as "seen from afar", previz 120 = the
// arrival distance at 1920x1080), and warmup() so textures upload before the seam, not during it.
import { Camera, Geometry, Mesh, Program, Renderer, Sphere, Texture } from "ogl";
import type { OGLRenderingContext, TextureOptions } from "ogl";

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

export const SUN_R = 0.6; // radius near Earth (the eclipse)
export const SUN_R_FAR = 2.4; // radius seen from afar (D ≥ dFar)
export const EARTH_R = 0.55;
export const OMEGA_EARTH = 0.09; // rad/s

export type Vec3 = [number, number, number];

type TexName =
  | "earth_day"
  | "earth_night"
  | "earth_clouds"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "ring"
  | "sky";

export type BodyName = "mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";

interface Body {
  name: BodyName;
  a: number; // AU
  R: number; // radius, scene units
  phase0: number; // deg
  tex: TexName;
  kind: 0 | 1 | 2 | 3; // 0 rocky · 1 gas giant · 2 Earth · 3 Venus (cloud deck)
  spin: number; // rad/s
  tilt: number; // deg
  ring?: boolean;
  r: number; // orbit radius
  w: number; // angular speed, rad/s
}

const BODY_DEFS: Omit<Body, "r" | "w">[] = [
  { name: "mercury", a: 0.387, R: 0.3, phase0: 40, tex: "mercury", kind: 0, spin: 0.04, tilt: 0 },
  { name: "venus", a: 0.723, R: 0.52, phase0: 160, tex: "venus", kind: 3, spin: 0.04, tilt: 177 },
  { name: "earth", a: 1.0, R: EARTH_R, phase0: 0, tex: "earth_day", kind: 2, spin: 0.1, tilt: 23.4 },
  { name: "mars", a: 1.524, R: 0.38, phase0: 230, tex: "mars", kind: 0, spin: 0.1, tilt: 25 },
  { name: "jupiter", a: 5.203, R: 1.8, phase0: 200, tex: "jupiter", kind: 1, spin: 0.3, tilt: 3 },
  { name: "saturn", a: 9.537, R: 1.5, phase0: 140, tex: "saturn", kind: 1, spin: 0.26, tilt: 26.7, ring: true },
  { name: "uranus", a: 19.19, R: 0.95, phase0: 20, tex: "uranus", kind: 1, spin: 0.04, tilt: 97.8 },
  { name: "neptune", a: 30.07, R: 0.93, phase0: 120, tex: "neptune", kind: 1, spin: 0.04, tilt: 28 },
];
const BODIES: Body[] = BODY_DEFS.map((b) => ({
  ...b,
  r: 10 * Math.sqrt(b.a),
  w: OMEGA_EARTH * Math.pow(b.a, -1.5),
}));

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function bodyPosition(name: BodyName, t: number, earthPhase0: number): Vec3 {
  const b = BODIES.find((x) => x.name === name) ?? BODIES[2];
  const ph = (name === "earth" ? earthPhase0 : b.phase0) * DEG + b.w * t;
  return [b.r * Math.cos(ph), b.r * Math.sin(ph), 0];
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** target [x,y,z], D distance, incl (deg from +z), azim (deg), roll (deg) */
export interface SolarCam {
  target: Vec3;
  D: number;
  incl: number;
  azim: number;
  roll: number;
}

interface CamBasis {
  eye: Vec3;
  fwd: Vec3;
  right: Vec3;
  up: Vec3;
}

export function makeCamera(cam: SolarCam): CamBasis {
  const i = cam.incl * DEG;
  const a = cam.azim * DEG;
  const dir: Vec3 = [Math.sin(i) * Math.cos(a), Math.sin(i) * Math.sin(a), Math.cos(i)];
  const eye: Vec3 = [cam.target[0] + dir[0] * cam.D, cam.target[1] + dir[1] * cam.D, cam.target[2] + dir[2] * cam.D];
  const fwd: Vec3 = [-dir[0], -dir[1], -dir[2]];
  const right0 = norm(cross(fwd, [0, 0, 1]));
  const up0 = cross(right0, fwd);
  const cr = Math.cos(cam.roll * DEG);
  const sr = Math.sin(cam.roll * DEG);
  const right: Vec3 = [right0[0] * cr + up0[0] * sr, right0[1] * cr + up0[1] * sr, right0[2] * cr + up0[2] * sr];
  const up: Vec3 = [up0[0] * cr - right0[0] * sr, up0[1] * cr - right0[1] * sr, up0[2] * cr - right0[2] * sr];
  return { eye, fwd, right, up };
}

// column-major 4x4: T(p) · Rx(tiltX) · [pole +y → +z] · Ry(spin) · S(s)
function bodyMatrix(out: number[], p: Vec3, s: number, tiltDeg: number, spin: number): number[] {
  const ct = Math.cos(tiltDeg * DEG);
  const st = Math.sin(tiltDeg * DEG);
  const cs = Math.cos(spin);
  const ss = Math.sin(spin);
  // A = Rx(90°)·Ry(spin): local +y (pole) → world +z, spun about the pole
  // Ry(spin) columns: (cs,0,-ss) (0,1,0) (ss,0,cs); Rx(90): (x,y,z) → (x,-z,y)
  const A = [cs, ss, 0, 0, 0, 1, ss, -cs, 0]; // columns of Rx90·Ry (right-handed: c0 × c1 = c2)
  // B = Rx(tilt) · A ; Rx(t): (x,y,z) → (x, y·ct − z·st, y·st + z·ct)
  const col = (k: number): Vec3 => {
    const x = A[k * 3];
    const y = A[k * 3 + 1];
    const z = A[k * 3 + 2];
    return [x, y * ct - z * st, y * st + z * ct];
  };
  const c0 = col(0);
  const c1 = col(1);
  const c2 = col(2);
  out[0] = c0[0] * s; out[1] = c0[1] * s; out[2] = c0[2] * s; out[3] = 0;
  out[4] = c1[0] * s; out[5] = c1[1] * s; out[6] = c1[2] * s; out[7] = 0;
  out[8] = c2[0] * s; out[9] = c2[1] * s; out[10] = c2[2] * s; out[11] = 0;
  out[12] = p[0]; out[13] = p[1]; out[14] = p[2]; out[15] = 1;
  return out;
}

const SKY_VERT = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
// uBuf: drawing-buffer size; fragment coordinates map back to CSS px before the ray is built.
const SKY_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tSky;
uniform vec3 uRight; uniform vec3 uUp; uniform vec3 uFwd;
uniform float uFL; uniform vec2 uFocal; uniform vec2 uRes; uniform vec2 uBuf;
uniform mat3 uRot; uniform float uAlpha; uniform float uGain; uniform float uGcU; uniform float uBandV; uniform float uLonSign; uniform float uLatSign;
void main() {
  vec2 p = vec2(gl_FragCoord.x, uBuf.y - gl_FragCoord.y) * (uRes / uBuf);
  vec3 d = normalize(uRight * ((p.x - uFocal.x) / uFL) - uUp * ((p.y - uFocal.y) / uFL) + uFwd);
  vec3 g = uRot * d;
  float lon = atan(g.y, g.x);
  float lat = asin(clamp(g.z, -1.0, 1.0));
  vec2 uv = vec2(fract(uGcU + uLonSign * lon / 6.2831853), clamp(uBandV + uLatSign * lat / 3.14159265, 0.001, 0.999));
  vec3 c = texture2D(tSky, uv).rgb * uGain;
  c = pow(c, vec3(1.15)); // a light toe: the sky between the stars stays black
  gl_FragColor = vec4(c * uAlpha, uAlpha);
}`;

const STAR_VERT = /* glsl */ `
attribute vec3 position; attribute float aMag; attribute vec3 aColor;
uniform vec3 uRight; uniform vec3 uUp; uniform vec3 uFwd;
uniform float uFL; uniform vec2 uFocal; uniform vec2 uRes; uniform float uDpr;
varying vec3 vColor; varying float vMag;
void main() {
  float z = dot(position, uFwd);
  vec2 s = vec2(uFocal.x + uFL * dot(position, uRight) / max(z, 1e-4), uFocal.y - uFL * dot(position, uUp) / max(z, 1e-4));
  vec2 ndc = vec2(s.x / uRes.x * 2.0 - 1.0, 1.0 - s.y / uRes.y * 2.0);
  gl_Position = z > 0.0 ? vec4(ndc, 0.9999, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = (1.8 + 2.6 * aMag) * uDpr;
  vColor = aColor; vMag = aMag;
}`;
const STAR_FRAG = /* glsl */ `
precision highp float;
uniform float uAlpha;
varying vec3 vColor; varying float vMag;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = exp(-d * d * 4.0) * (0.42 + 0.58 * vMag) * uAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;

const SPRITE_VERT = /* glsl */ `
attribute vec2 position;
uniform vec2 uCenter; uniform float uExtent; uniform float uDepth; uniform vec2 uRes;
varying vec2 vP;
void main() {
  vP = position;
  vec2 s = uCenter + position * uExtent;
  gl_Position = vec4(s.x / uRes.x * 2.0 - 1.0, 1.0 - s.y / uRes.y * 2.0, uDepth, 1.0);
}`;
// The Sun: limb-darkened white disc (warm limb) and a corona falling ~1% by 3 R. Extent = 3.2 R.
const SUN_FRAG = /* glsl */ `
precision highp float;
uniform float uK;
varying vec2 vP;
void main() {
  float rho = length(vP) * 3.2;
  vec3 c; float a;
  if (rho < 1.0) {
    float mu = sqrt(1.0 - rho * rho);
    c = mix(vec3(1.0, 0.95, 0.86), vec3(1.0), smoothstep(0.0, 0.45, mu)); // over-exposed, as a camera sees it
    a = 1.0;
  } else {
    a = 0.96 * exp(-2.2 * (rho - 1.0)) * (1.0 - smoothstep(2.6, 3.2, rho));
    c = mix(vec3(1.0, 0.84, 0.64), vec3(1.0, 0.97, 0.9), exp(-1.2 * (rho - 1.0)));
  }
  a *= uK;
  gl_FragColor = vec4(c * a, a);
}`;
const HALO_FRAG = /* glsl */ `
precision highp float;
uniform vec2 uSunDir; uniform float uK;
varying vec2 vP;
void main() {
  float r = length(vP) * 1.12; // units of Earth's radius; the sprite extent is 1.12 R
  float side = max(0.0, dot(normalize(vP + 1e-5), uSunDir));
  float peak = 0.1 + 0.9 * pow(side, 3.0); // refracted sunlight peaks toward the Sun ("diamond ring")
  float inner = smoothstep(0.975, 0.995, r) * (1.0 - smoothstep(0.995, 1.012, r)); // orange-red, ~3% of R
  float outer = smoothstep(1.0, 1.014, r) * (1.0 - smoothstep(1.014, 1.04, r)); // thin blue fringe outside
  vec3 col = vec3(1.0, 0.45, 0.2) * inner * 1.3 + vec3(0.45, 0.66, 1.0) * outer;
  float a = max(inner, outer) * peak * uK;
  gl_FragColor = vec4(col * peak * uK, a);
}`;
const ERASE_FRAG = /* glsl */ `
precision highp float;
varying vec2 vP;
void main() { float a = 1.0 - smoothstep(0.985, 1.0, length(vP)); gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`;

const BODY_VERT = /* glsl */ `
attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix;
varying vec3 vN; varying vec3 vW; varying vec2 vUv;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const BODY_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tDay; uniform sampler2D tNight; uniform sampler2D tClouds;
uniform int uKind; uniform float uAlpha; uniform vec3 uCam;
varying vec3 vN; varying vec3 vW; varying vec2 vUv;
void main() {
  vec3 N = normalize(vN);
  vec3 L = normalize(-vW);            // the Sun at the origin
  vec3 V = normalize(uCam - vW);
  float ndl = dot(N, L);
  float day = smoothstep(-0.05, 0.11, ndl); // ~6° soft terminator
  float lit = max(ndl, 0.0);
  float mu = max(dot(N, V), 0.0);
  vec3 base = texture2D(tDay, vUv).rgb;
  vec3 col;
  if (uKind == 2) {
    float cl = texture2D(tClouds, vUv).r;
    vec3 surf = mix(base, vec3(0.97), cl * 0.9);
    vec3 lights = texture2D(tNight, vUv).rgb * (1.0 - 0.7 * cl);
    col = surf * (0.015 + 1.08 * lit) * day + lights * vec3(1.0, 0.86, 0.62) * 1.6 * (1.0 - day);
    float rim = pow(1.0 - mu, 2.4);
    col += vec3(0.56, 0.77, 1.0) * rim * 0.95 * smoothstep(-0.1, 0.5, ndl); // dayside limb only
  } else if (uKind == 3) {
    col = base * (0.01 + 1.1 * lit) * day;
    col += vec3(1.0, 0.93, 0.78) * pow(1.0 - mu, 3.0) * 0.35 * smoothstep(-0.2, 0.6, ndl);
  } else if (uKind == 1) {
    col = base * (0.008 + 1.12 * lit) * day * mix(1.0, pow(mu, 0.35), 0.75);
  } else {
    col = base * (0.01 + 1.1 * lit) * day;
  }
  gl_FragColor = vec4(col * uAlpha, uAlpha);
}`;

const RING_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tRing; uniform float uAlpha; uniform vec3 uCam; uniform vec3 uRingN; uniform float uFlip;
varying vec3 vN; varying vec3 vW; varying vec2 vUv;
void main() {
  float u = mix(vUv.x, 1.0 - vUv.x, uFlip);
  vec4 t = texture2D(tRing, vec2(u, 0.5));
  vec3 L = normalize(-vW);
  vec3 V = normalize(uCam - vW);
  float sl = dot(uRingN, L);
  float sv = dot(uRingN, V);
  float b = 0.75 + 0.25 * abs(sl);
  if (sl * sv < 0.0) b *= 0.35; // we see the unlit face
  float a = t.a * uAlpha;
  gl_FragColor = vec4(t.rgb * b * a, a);
}`;

const LINE_VERT = /* glsl */ `
attribute vec3 position; attribute vec4 aColor;
uniform mat4 viewMatrix; uniform mat4 projectionMatrix;
varying vec4 vColor;
void main() { vColor = aColor; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`;
const LINE_FRAG = /* glsl */ `
precision highp float;
uniform float uAlpha;
varying vec4 vColor;
void main() { float a = vColor.a * uAlpha; gl_FragColor = vec4(vColor.rgb * a, a); }`;

const BELT_VERT = /* glsl */ `
attribute vec4 aBelt; // r, angle0, z, w
uniform mat4 viewMatrix; uniform mat4 projectionMatrix; uniform float uTime; uniform float uDpr;
void main() {
  float ang = aBelt.y + aBelt.w * uTime;
  gl_Position = projectionMatrix * viewMatrix * vec4(aBelt.x * cos(ang), aBelt.x * sin(ang), aBelt.z, 1.0);
  gl_PointSize = 1.3 * uDpr;
}`;
const BELT_FRAG = /* glsl */ `
precision highp float;
uniform float uAlpha;
void main() { float a = 0.16 * uAlpha; gl_FragColor = vec4(vec3(0.69, 0.65, 0.6) * a, a); }`;

export interface SkyOptions {
  gain?: number;
  gcU?: number;
  bandV?: number;
  lonSign?: number;
  latSign?: number;
  ringFlip?: number;
  /** the solar camera at the galaxy → solar seam; the panorama's band is laid along its horizon */
  seamCam?: SolarCam;
  bandElevation?: number; // deg above F at the seam
  gcOffset?: number; // deg
}

export interface SolarOptions {
  /** viewport, CSS px */
  W: number;
  H: number;
  /** focal length, CSS px */
  FL: number;
  /** default principal point (F), CSS px */
  focal: readonly [number, number];
  /** drawing-buffer pixels per CSS px */
  dpr?: number;
  texBase?: string;
  /** solar-camera distance beyond which the Sun is drawn at SUN_R_FAR (previz: 120) */
  dFar?: number;
  sky?: SkyOptions;
}

export interface SolarState {
  t: number;
  cam: SolarCam;
  earthPhase0: number;
  /** 0–1: orbits, planets, belt */
  sys: number;
  /** 0–1: Earth (fades as the live globe takes over) */
  earth: number;
  /** 0–1: every planet but Earth */
  others: number;
  /** 0–1: the galaxy target swing (floors the Sun's size and brightness in the dive) */
  guide: number;
  /** 0–1: the panorama and its point stars */
  sky: number;
  /** principal point for this frame (the Sun's place on the galaxy plane), CSS px */
  focal?: readonly [number, number];
}

export interface Solar {
  readonly gl: OGLRenderingContext;
  /** resolves when every texture has decoded; rejects if one fails */
  readonly ready: Promise<void>;
  draw(state: SolarState): void;
  /** draws every program once (uploading textures, priming shaders), then clears */
  warmup(): void;
}

type Uniform<T> = { value: T };

export function createSolar(canvas: HTMLCanvasElement, opts: SolarOptions): Solar {
  const { W, H, FL, focal } = opts;
  const dpr = opts.dpr ?? 1;
  const texBase = opts.texBase ?? "/intro/tex/";
  const dFar = opts.dFar ?? 120;
  const sky = opts.sky ?? {};

  // Throws when WebGL is unavailable (ogl dereferences the null context); the caller falls back.
  const renderer = new Renderer({
    canvas,
    width: W,
    height: H,
    dpr,
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
    preserveDrawingBuffer: false,
    depth: true,
    autoClear: false,
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const camera = new Camera(gl, { near: 0.02, far: 20000 });
  camera.matrixAutoUpdate = false;

  const loads: Promise<void>[] = [];
  const tex = (file: string, opt: Partial<TextureOptions> = {}): Texture => {
    const t = new Texture(gl, { wrapS: gl.REPEAT, wrapT: gl.CLAMP_TO_EDGE, minFilter: gl.LINEAR_MIPMAP_LINEAR, ...opt });
    const img = new Image();
    img.decoding = "async";
    img.src = texBase + file;
    loads.push(
      img.decode().then(() => {
        t.image = img;
      }),
    );
    return t;
  };
  const T: Record<TexName, Texture> = {
    earth_day: tex("earth_day.jpg"),
    earth_night: tex("earth_night.jpg"),
    earth_clouds: tex("earth_clouds.jpg"),
    mercury: tex("mercury.jpg"),
    venus: tex("venus.jpg"),
    mars: tex("mars.jpg"),
    jupiter: tex("jupiter.jpg"),
    saturn: tex("saturn.jpg"),
    uranus: tex("uranus.jpg"),
    neptune: tex("neptune.jpg"),
    ring: tex("saturn_ring.png", { wrapS: gl.CLAMP_TO_EDGE }),
    // the real Milky Way (true colour, the Great Rift intact); seeded point stars on top keep it crisp.
    // 3072x1536 is not a power of two: clamp (the shader wraps longitude itself) so WebGL1 samples it.
    sky: tex("milkyway_sky.jpg", { generateMipmaps: false, minFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE }),
  };

  const tri = new Geometry(gl, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) } });
  const quad = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]) },
  });
  const uScreen = {
    uFL: { value: FL } as Uniform<number>,
    uFocal: { value: [focal[0], focal[1]] } as Uniform<number[]>,
    uRes: { value: [W, H] } as Uniform<number[]>,
    uBuf: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] } as Uniform<number[]>,
    uDpr: { value: gl.drawingBufferHeight / H } as Uniform<number>,
  };
  const uBasis = {
    uRight: { value: [1, 0, 0] } as Uniform<Vec3>,
    uUp: { value: [0, 1, 0] } as Uniform<Vec3>,
    uFwd: { value: [0, 0, 1] } as Uniform<Vec3>,
  };

  // ---- sky: real Milky Way panorama, oriented so its band continues the galaxy plane's horizon at the seam
  const seam = makeCamera(sky.seamCam ?? { target: [0, 0, 0], D: 450, incl: 58, azim: -90, roll: -6 });
  const bandUp = (sky.bandElevation ?? 12) * DEG; // the band crosses the seam frame 12° above F
  const dCentre = norm([
    seam.fwd[0] * Math.cos(bandUp) + seam.up[0] * Math.sin(bandUp),
    seam.fwd[1] * Math.cos(bandUp) + seam.up[1] * Math.sin(bandUp),
    seam.fwd[2] * Math.cos(bandUp) + seam.up[2] * Math.sin(bandUp),
  ]);
  const gcOff = (sky.gcOffset ?? 10) * DEG;
  const Z = norm(cross(seam.right, dCentre)); // galactic north ≈ screen up
  const X = norm([
    dCentre[0] * Math.cos(gcOff) + seam.right[0] * Math.sin(gcOff),
    dCentre[1] * Math.cos(gcOff) + seam.right[1] * Math.sin(gcOff),
    dCentre[2] * Math.cos(gcOff) + seam.right[2] * Math.sin(gcOff),
  ]); // toward the galactic centre
  const Y = cross(Z, X); // longitude grows to the left
  const rot = [X[0], Y[0], Z[0], X[1], Y[1], Z[1], X[2], Y[2], Z[2]]; // GLSL mat3 (columns)
  const skyU = {
    tSky: { value: T.sky } as Uniform<Texture>,
    uRot: { value: rot } as Uniform<number[]>,
    uAlpha: { value: 0 } as Uniform<number>,
    uGain: { value: sky.gain ?? 0.55 } as Uniform<number>,
    uGcU: { value: sky.gcU ?? 0.5 } as Uniform<number>,
    uBandV: { value: sky.bandV ?? 0.5 } as Uniform<number>,
    uLonSign: { value: sky.lonSign ?? -1 } as Uniform<number>,
    uLatSign: { value: sky.latSign ?? 1 } as Uniform<number>,
  };
  const skyProg = new Program(gl, {
    vertex: SKY_VERT,
    fragment: SKY_FRAG,
    uniforms: { ...skyU, ...uScreen, ...uBasis },
    depthTest: false,
    depthWrite: false,
    cullFace: null,
  });
  skyProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const skyMesh = new Mesh(gl, { geometry: tri, program: skyProg, frustumCulled: false });

  // ---- crisp seeded stars (the panorama goes soft at a 30° FOV): 60% uniform, 40% in the galactic band
  const rnd = mulberry32(31012026);
  const NS = 5200;
  const sp = new Float32Array(NS * 3);
  const sm = new Float32Array(NS);
  const sc = new Float32Array(NS * 3);
  for (let i = 0; i < NS; i++) {
    const lon = rnd() * TAU;
    let lat: number;
    if (i % 5 < 3) lat = Math.asin(rnd() * 2 - 1);
    else lat = (rnd() + rnd() + rnd() - 1.5) * 0.16;
    const g: Vec3 = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
    // galactic → ecliptic: transpose of rot rows (X, Y, Z)
    const e = [
      X[0] * g[0] + Y[0] * g[1] + Z[0] * g[2],
      X[1] * g[0] + Y[1] * g[1] + Z[1] * g[2],
      X[2] * g[0] + Y[2] * g[1] + Z[2] * g[2],
    ];
    sp.set(e, i * 3);
    sm[i] = Math.pow(rnd(), 2.2); // most stars faint, a bright few
    const tcol = rnd();
    sc.set(
      tcol < 0.18 ? [0.75, 0.84, 1.0] : tcol < 0.7 ? [1.0, 0.98, 0.95] : tcol < 0.9 ? [1.0, 0.9, 0.76] : [1.0, 0.78, 0.6],
      i * 3,
    );
  }
  const starGeo = new Geometry(gl, {
    position: { size: 3, data: sp },
    aMag: { size: 1, data: sm },
    aColor: { size: 3, data: sc },
  });
  const starU = { uAlpha: { value: 0 } as Uniform<number> };
  const starProg = new Program(gl, {
    vertex: STAR_VERT,
    fragment: STAR_FRAG,
    uniforms: { ...starU, ...uScreen, ...uBasis },
    depthTest: true,
    depthWrite: false,
    cullFace: null,
  });
  starProg.setBlendFunc(gl.ONE, gl.ONE);
  const starMesh = new Mesh(gl, { geometry: starGeo, program: starProg, mode: gl.POINTS, frustumCulled: false });

  // ---- the Sun and the Earth eraser: screen-space sprites at a true depth
  const sunU = {
    uCenter: { value: [0, 0] } as Uniform<number[]>,
    uExtent: { value: 1 } as Uniform<number>,
    uDepth: { value: 0 } as Uniform<number>,
    uK: { value: 1 } as Uniform<number>,
  };
  const sunProg = new Program(gl, {
    vertex: SPRITE_VERT,
    fragment: SUN_FRAG,
    uniforms: { ...sunU, ...uScreen },
    depthTest: true,
    depthWrite: false,
    cullFace: null,
  });
  sunProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const sunMesh = new Mesh(gl, { geometry: quad, program: sunProg, frustumCulled: false });
  const eraseU = {
    uCenter: { value: [0, 0] } as Uniform<number[]>,
    uExtent: { value: 1 } as Uniform<number>,
    uDepth: { value: 0 } as Uniform<number>,
  };
  const eraseProg = new Program(gl, {
    vertex: SPRITE_VERT,
    fragment: ERASE_FRAG,
    uniforms: { ...eraseU, ...uScreen },
    depthTest: false,
    depthWrite: false,
    cullFace: null,
  });
  // dst × (1 − a) for colour and alpha. ogl enables blending only when the source factor is truthy, and
  // gl.ZERO is 0, so a (ZERO, ONE_MINUS_SRC_ALPHA) eraser would silently paint opaque black. The fragment
  // writes colour 0, so (ONE, ONE_MINUS_SRC_ALPHA) for colour plus a separate (ZERO, …) for alpha is the same.
  eraseProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
  const eraseMesh = new Mesh(gl, { geometry: quad, program: eraseProg, frustumCulled: false });
  const haloU = {
    uCenter: { value: [0, 0] } as Uniform<number[]>,
    uExtent: { value: 1 } as Uniform<number>,
    uDepth: { value: 0 } as Uniform<number>,
    uSunDir: { value: [0, -1] } as Uniform<number[]>,
    uK: { value: 1 } as Uniform<number>,
  };
  const haloProg = new Program(gl, {
    vertex: SPRITE_VERT,
    fragment: HALO_FRAG,
    uniforms: { ...haloU, ...uScreen },
    depthTest: false,
    depthWrite: false,
    cullFace: null,
  });
  haloProg.setBlendFunc(gl.ONE, gl.ONE);
  const haloMesh = new Mesh(gl, { geometry: quad, program: haloProg, frustumCulled: false });

  // ---- planets: real sphere meshes, textured and lit by the Sun
  const sphere = new Sphere(gl, { radius: 1, widthSegments: 64, heightSegments: 40 });
  const planets = BODIES.map((b) => {
    const u = {
      tDay: { value: T[b.tex] } as Uniform<Texture>,
      tNight: { value: T.earth_night } as Uniform<Texture>,
      tClouds: { value: T.earth_clouds } as Uniform<Texture>,
      uKind: { value: b.kind } as Uniform<number>,
      uAlpha: { value: 1 } as Uniform<number>,
      uCam: { value: [0, 0, 0] } as Uniform<Vec3>,
    };
    const program = new Program(gl, {
      vertex: BODY_VERT,
      fragment: BODY_FRAG,
      uniforms: u,
      depthTest: true,
      depthWrite: true,
    });
    program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const mesh = new Mesh(gl, { geometry: sphere, program, frustumCulled: false });
    mesh.matrixAutoUpdate = false;
    return { b, mesh, u };
  });

  // ---- Saturn's ring: an annulus in its equatorial plane; the texture's C-ring inner edge (u 0.06) lands
  // at 1.24 R and its A-ring outer edge (u 0.94) at 2.27 R
  const RS = 160;
  const rp: number[] = [];
  const ru: number[] = [];
  const rn: number[] = [];
  for (let k = 0; k <= RS; k++) {
    const th = (k / RS) * TAU;
    for (const [rad, u] of [
      [1.17, 0],
      [2.34, 1],
    ]) {
      rp.push(rad * Math.cos(th), 0, rad * Math.sin(th));
      ru.push(u, k / RS);
      rn.push(0, 1, 0);
    }
  }
  const ri: number[] = [];
  for (let k = 0; k < RS; k++) {
    const a0 = k * 2;
    ri.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2);
  }
  const ringGeo = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(rp) },
    uv: { size: 2, data: new Float32Array(ru) },
    normal: { size: 3, data: new Float32Array(rn) },
    index: { data: new Uint16Array(ri) },
  });
  const ringU = {
    tRing: { value: T.ring } as Uniform<Texture>,
    uAlpha: { value: 1 } as Uniform<number>,
    uCam: { value: [0, 0, 0] } as Uniform<Vec3>,
    uRingN: { value: [0, 0, 1] } as Uniform<Vec3>,
    uFlip: { value: sky.ringFlip ?? 0 } as Uniform<number>,
  };
  const ringProg = new Program(gl, {
    vertex: BODY_VERT,
    fragment: RING_FRAG,
    uniforms: ringU,
    depthTest: true,
    depthWrite: false,
    cullFace: null,
  });
  ringProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const ringMesh = new Mesh(gl, { geometry: ringGeo, program: ringProg, frustumCulled: false });
  ringMesh.matrixAutoUpdate = false;

  // ---- orbits (faint: the planets carry "solar system" now) and the belt
  const lp: number[] = [];
  const lc: number[] = [];
  for (const b of BODIES) {
    const steps = 192;
    const c = b.name === "earth" ? [0.557, 0.773, 1.0, 0.25] : [1, 1, 1, 0.06];
    for (let k = 0; k < steps; k++) {
      for (const kk of [k, k + 1]) {
        const th = (kk / steps) * TAU;
        lp.push(b.r * Math.cos(th), b.r * Math.sin(th), 0);
        lc.push(...c);
      }
    }
  }
  const lineGeo = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(lp) },
    aColor: { size: 4, data: new Float32Array(lc) },
  });
  const lineU = { uAlpha: { value: 1 } as Uniform<number> };
  const lineProg = new Program(gl, {
    vertex: LINE_VERT,
    fragment: LINE_FRAG,
    uniforms: lineU,
    depthTest: true,
    depthWrite: false,
    cullFace: null,
  });
  lineProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const lineMesh = new Mesh(gl, { geometry: lineGeo, program: lineProg, mode: gl.LINES, frustumCulled: false });

  const brnd = mulberry32(20261031);
  const NB = 1400;
  const bd = new Float32Array(NB * 4);
  for (let i = 0; i < NB; i++) {
    const r = 15.2 + 3.4 * (brnd() + brnd()) * 0.5;
    bd.set([r, brnd() * TAU, (brnd() + brnd() + brnd() - 1.5) * 0.25, OMEGA_EARTH * Math.pow(r / 10, -3)], i * 4);
  }
  const beltGeo = new Geometry(gl, { aBelt: { size: 4, data: bd } });
  const beltU = {
    uAlpha: { value: 1 } as Uniform<number>,
    uTime: { value: 0 } as Uniform<number>,
    uDpr: uScreen.uDpr,
  };
  const beltProg = new Program(gl, {
    vertex: BELT_VERT,
    fragment: BELT_FRAG,
    uniforms: beltU,
    depthTest: true,
    depthWrite: false,
    cullFace: null,
  });
  beltProg.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const beltMesh = new Mesh(gl, { geometry: beltGeo, program: beltProg, mode: gl.POINTS, frustumCulled: false });

  const ready = Promise.all(loads).then(() => undefined);

  const setCamera = (c: CamBasis, FX: number, FY: number): void => {
    const m = camera.matrix;
    m[0] = c.right[0]; m[1] = c.right[1]; m[2] = c.right[2]; m[3] = 0;
    m[4] = c.up[0]; m[5] = c.up[1]; m[6] = c.up[2]; m[7] = 0;
    m[8] = -c.fwd[0]; m[9] = -c.fwd[1]; m[10] = -c.fwd[2]; m[11] = 0;
    m[12] = c.eye[0]; m[13] = c.eye[1]; m[14] = c.eye[2]; m[15] = 1;
    camera.worldMatrixNeedsUpdate = true;
    const n = camera.near;
    const f = camera.far;
    const P = camera.projectionMatrix; // off-axis: the principal point is F, not the frame centre
    P[0] = (2 * FL) / W; P[1] = 0; P[2] = 0; P[3] = 0;
    P[4] = 0; P[5] = (2 * FL) / H; P[6] = 0; P[7] = 0;
    P[8] = 1 - (2 * FX) / W; P[9] = (2 * FY) / H - 1; P[10] = -(f + n) / (f - n); P[11] = -1;
    P[12] = 0; P[13] = 0; P[14] = (-2 * f * n) / (f - n); P[15] = 0;
    uScreen.uFocal.value = [FX, FY];
    uBasis.uRight.value = c.right;
    uBasis.uUp.value = c.up;
    uBasis.uFwd.value = c.fwd;
  };
  /** [x, y, z (camera depth), ndc depth], or null behind the near plane */
  const screenOf = (c: CamBasis, p: Vec3, FX: number, FY: number): [number, number, number, number] | null => {
    const v = sub(p, c.eye);
    const z = dot(v, c.fwd);
    if (z < camera.near) return null;
    const ndcZ =
      ((-(camera.far + camera.near) / (camera.far - camera.near)) * -z +
        (-2 * camera.far * camera.near) / (camera.far - camera.near)) /
      z;
    return [FX + (FL * dot(v, c.right)) / z, FY - (FL * dot(v, c.up)) / z, z, ndcZ];
  };
  const draw1 = (mesh: Mesh): void =>
    renderer.render({ scene: mesh, camera, update: false, sort: false, frustumCull: false, clear: false });

  const draw = (state: SolarState): void => {
    const FX = state.focal ? state.focal[0] : focal[0];
    const FY = state.focal ? state.focal[1] : focal[1];
    const c = makeCamera(state.cam);
    setCamera(c, FX, FY);
    renderer.setViewport(W * dpr, H * dpr);
    gl.depthMask(true);
    renderer.state.depthMask = true;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const t = state.t;
    const sys = state.sys;
    const skyA = state.sky || 0;

    if (skyA > 0.002) {
      skyU.uAlpha.value = skyA;
      draw1(skyMesh);
      starU.uAlpha.value = skyA;
      draw1(starMesh);
    }

    // the Sun: large from afar, easing to 0.6 near Earth (steady on screen, eclipsable); floored in the dive.
    // Drawn after the far planets (its disc covers anything behind it) and before Earth (which eclipses it).
    const drawSun = (): void => {
      const sunS = screenOf(c, [0, 0, 0], FX, FY);
      if (!sunS) return;
      const Rs = Math.min(SUN_R_FAR, Math.max(SUN_R, SUN_R_FAR * Math.pow(state.cam.D / dFar, 0.85)));
      const r = (FL * Rs) / sunS[2];
      const g = state.guide;
      const rr = Math.max(r, 1.2 + 1.3 * g);
      sunU.uCenter.value = [sunS[0], sunS[1]];
      sunU.uExtent.value = rr * 3.2;
      sunU.uDepth.value = Math.min(0.99999, sunS[3]);
      sunU.uK.value = Math.min(1, Math.max((r / 1.2) ** 2, 0.9 * g));
      draw1(sunMesh);
    };

    if (sys <= 0.001) drawSun();
    if (sys > 0.001) {
      const others = state.others;
      let earth: { P: (typeof planets)[number]; p: Vec3 } | null = null;
      for (const P of planets) {
        const b = P.b;
        const p = bodyPosition(b.name, t, state.earthPhase0);
        bodyMatrix(P.mesh.worldMatrix, p, b.R, b.tilt, b.spin * t + (b.name === "earth" ? 3.6 : 0));
        P.u.uCam.value = c.eye;
        if (b.name === "earth") {
          earth = { P, p };
          continue;
        }
        const a = sys * others;
        if (a <= 0.002) continue;
        P.u.uAlpha.value = a;
        draw1(P.mesh);
        if (b.ring) {
          bodyMatrix(ringMesh.worldMatrix, p, b.R, b.tilt, 0);
          const n: Vec3 = [ringMesh.worldMatrix[4] / b.R, ringMesh.worldMatrix[5] / b.R, ringMesh.worldMatrix[6] / b.R];
          ringU.uRingN.value = norm(n);
          ringU.uCam.value = c.eye;
          ringU.uAlpha.value = a;
          draw1(ringMesh);
        }
      }
      drawSun();
      if (earth) {
        const s = screenOf(c, earth.p, FX, FY);
        // exact silhouette radius of a sphere seen in perspective
        const rSil = s ? (FL * EARTH_R) / Math.sqrt(Math.max(s[2] * s[2] - EARTH_R * EARTH_R, 1e-6)) : 0;
        if (s && state.earth < 1) {
          // The globe beneath (page layer) takes over: erase what lies behind Earth, then fade it.
          eraseU.uCenter.value = [s[0], s[1]];
          eraseU.uExtent.value = rSil + 0.5;
          draw1(eraseMesh);
        }
        const ea = sys * state.earth;
        earth.P.u.uAlpha.value = ea;
        if (ea > 0.002) draw1(earth.P.mesh);
        if (s && ea > 0.002 && rSil > 3) {
          const sun = screenOf(c, [0, 0, 0], FX, FY);
          const dir = sun ? norm([sun[0] - s[0], sun[1] - s[1], 0]) : [0, -1, 0];
          haloU.uCenter.value = [s[0], s[1]];
          haloU.uExtent.value = rSil * 1.12;
          haloU.uSunDir.value = [dir[0], dir[1]];
          haloU.uK.value = ea * 0.85;
          draw1(haloMesh);
        }
      }
      // orbits and belt: information from above; they fade as the camera sinks into the ecliptic
      const u = Math.min(1, Math.max(0, (state.cam.incl - 76) / 9));
      const guides = sys * (1 - u * u * (3 - 2 * u));
      if (guides > 0.002) {
        lineU.uAlpha.value = guides;
        draw1(lineMesh);
        beltU.uAlpha.value = guides;
        beltU.uTime.value = t;
        draw1(beltMesh);
      }
    }
  };

  const warmup = (): void => {
    // A frame that uses every program (sky, stars, planets, ring, Sun, eraser, halo, orbits, belt).
    const e = bodyPosition("earth", 0, -108.47);
    draw({
      t: 0,
      cam: { target: e, D: 20, incl: 70, azim: -60, roll: -6 },
      earthPhase0: -108.47,
      sys: 1,
      earth: 0.5,
      others: 1,
      guide: 1,
      sky: 1,
    });
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  return { gl, ready, draw, warmup };
}
