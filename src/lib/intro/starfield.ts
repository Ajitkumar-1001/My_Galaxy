// The site's Galaxy star field (formerly src/comp/Galaxy.tsx), shaders verbatim, on raw WebGL.
// Port of the previz assets/lib/starfield.js. draw(state) paints one frame from state alone, so the
// intro can render any time (including the DEV seek hook). Props as the old Splash passed them:
// density 2.5, glow 0.2, twinkle 1, autoCenterRepulsion 0.2, saturation 0.1, hueShift 50, speed 2.

const VERT = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0); // Center in UV space
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha); // Enhance contrast
    alpha = min(alpha, 1.0); // Clamp to maximum 1.0
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

const UNIFORMS = [
  "uTime", "uResolution", "uFocal", "uRotation", "uStarSpeed", "uDensity", "uHueShift", "uSpeed",
  "uMouse", "uGlowIntensity", "uSaturation", "uMouseRepulsion", "uTwinkleIntensity", "uRotationSpeed",
  "uRepulsionStrength", "uMouseActiveFactor", "uAutoCenterRepulsion", "uTransparent",
] as const;
type UniformName = (typeof UNIFORMS)[number];

export interface StarfieldState {
  /** seconds */
  time: number;
  /** uStarSpeed: base drift plus the zoom boost */
  starSpeed: number;
  density: number;
  glow: number;
}

export interface StarfieldOptions {
  /** drawing-buffer size in px (the caller caps it; the canvas is CSS-sized to the viewport) */
  width: number;
  height: number;
  /** vanishing point in shader UV (origin bottom-left) */
  focal: readonly [number, number];
}

export interface Starfield {
  readonly gl: WebGLRenderingContext;
  draw(state: StarfieldState): void;
}

/** Returns null when WebGL is unavailable or the shaders fail, so the caller can fall back. */
export function createStarfield(canvas: HTMLCanvasElement, opts: StarfieldOptions): Starfield | null {
  const { width: W, height: H, focal } = opts;
  canvas.width = W;
  canvas.height = H;
  const attrs: WebGLContextAttributes = {
    alpha: true,
    premultipliedAlpha: false,
    depth: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };
  // WebGL1 signatures are valid on both contexts (method calls on the union do not type-check).
  const gl = (canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
  if (!gl) return null;

  const compile = (type: number, src: string): WebGLShader | null => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("[intro] star shader:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[intro] star program:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const attrib = (name: string, data: number[]): void => {
    const loc = gl.getAttribLocation(prog, name);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };
  attrib("position", [-1, -1, 3, -1, -1, 3]); // ogl Triangle
  attrib("uv", [0, 0, 2, 0, 0, 2]);

  const U = {} as Record<UniformName, WebGLUniformLocation | null>;
  for (const n of UNIFORMS) U[n] = gl.getUniformLocation(prog, n);

  const draw = (state: StarfieldState): void => {
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND); // ogl Program (transparent: false) writes (col, alpha) as-is
    gl.useProgram(prog);
    gl.uniform1f(U.uTime, state.time);
    gl.uniform3f(U.uResolution, W, H, W / H);
    gl.uniform2f(U.uFocal, focal[0], focal[1]);
    gl.uniform2f(U.uRotation, 1, 0);
    gl.uniform1f(U.uStarSpeed, state.starSpeed);
    gl.uniform1f(U.uDensity, state.density);
    gl.uniform1f(U.uHueShift, 50);
    gl.uniform1f(U.uSpeed, 2);
    gl.uniform2f(U.uMouse, 0.5, 0.5);
    gl.uniform1f(U.uGlowIntensity, state.glow);
    gl.uniform1f(U.uSaturation, 0.1);
    gl.uniform1i(U.uMouseRepulsion, 1);
    gl.uniform1f(U.uTwinkleIntensity, 1);
    gl.uniform1f(U.uRotationSpeed, 0.1);
    gl.uniform1f(U.uRepulsionStrength, 2);
    gl.uniform1f(U.uMouseActiveFactor, 0);
    gl.uniform1f(U.uAutoCenterRepulsion, 0.2);
    gl.uniform1i(U.uTransparent, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return { gl, draw };
}
