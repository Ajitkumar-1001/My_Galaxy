// The Milky Way plane on WebGL: a port of the approved previz's assets/lib/galaxy.js (pass 4), with the
// old CSS-3D plane's exact camera (perspective FL about F). Why not CSS 3D: Chrome re-rasterised the
// photo whenever the zoom changed its scale (33–217 ms stalls, measured) and sampled it without mipmaps
// (shimmer). Here the photo is uploaded once, during the text hold, mipmapped, and sampled
// anisotropically one mip level finer than its footprint (LOD bias −1, measured against the old plane).
// Pure: draw(state) paints one frame from state alone.

type GL = WebGLRenderingContext | WebGL2RenderingContext;

const W_NEAR = 0.001; // the plane is clipped where it passes the camera: w = (FL − z) / FL < W_NEAR
const DEG = Math.PI / 180;
/** The plane is 4096 "image px" square whatever the file's size: timeline.ts measures it so. */
const PLANE_PX = 4096;

const PRECISION = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const PLANE_VERT = `
attribute vec4 aClip; // clip-space corner, from the CSS-3D maths in float64 on the CPU
attribute vec2 aUv;
varying vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = aClip;
}
`;
const PLANE_FRAG = `${PRECISION}
uniform sampler2D uTex;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(texture2D(uTex, vUv, -1.0).rgb, 1.0);
}
`;
// The bulge, as the old #intro-bulge div drew it: a circle filled with radial-gradient(closest-side,
// rgb(255 240 214 / .9), rgb(255 228 188 / .45) 40%, rgb(255 216 172 / .12) 72%, transparent), scaled to
// an ellipse, mix-blend-mode: screen. The stops interpolate premultiplied, as CSS gradients do.
const BULGE_VERT = `
attribute vec2 aCorner;
uniform vec2 uCenter; // CSS px
uniform vec2 uAxes; // semi-axes, CSS px
uniform float uAngle; // CSS rotate(): clockwise, y down
uniform vec2 uView; // CSS px
varying vec2 vLocal;
void main() {
  vLocal = aCorner;
  vec2 d = aCorner * uAxes;
  float c = cos(uAngle);
  float s = sin(uAngle);
  vec2 p = uCenter + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  gl_Position = vec4(2.0 * p.x / uView.x - 1.0, 1.0 - 2.0 * p.y / uView.y, 0.0, 1.0);
}
`;
const BULGE_FRAG = `${PRECISION}
uniform float uOpacity;
varying vec2 vLocal;
vec4 pm(vec3 rgb, float a) {
  return vec4(rgb / 255.0 * a, a);
}
void main() {
  float r = length(vLocal);
  vec4 c0 = pm(vec3(255.0, 240.0, 214.0), 0.9);
  vec4 c1 = pm(vec3(255.0, 228.0, 188.0), 0.45);
  vec4 c2 = pm(vec3(255.0, 216.0, 172.0), 0.12);
  vec4 col = r < 0.4 ? mix(c0, c1, r / 0.4)
    : r < 0.72 ? mix(c1, c2, (r - 0.4) / 0.32)
    : mix(c2, vec4(0.0), clamp((r - 0.72) / 0.28, 0.0, 1.0));
  gl_FragColor = col * uOpacity;
}
`;
// The near arm clearing from the bottom edge, as the old stage mask drew it over the whole layer:
// linear-gradient(to top, transparent sweep, #000 sweep + edge), in drawing-buffer px.
const MASK_VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
const MASK_FRAG = `${PRECISION}
uniform float uSweep;
uniform float uEdge;
void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp((gl_FragCoord.y - uSweep) / uEdge, 0.0, 1.0));
}
`;

export interface GalaxyBulge {
  /** centre, CSS px */
  x: number;
  y: number;
  /** projected bar length, CSS px; the glow is 0.36x as tall */
  len: number;
  /** radians, CSS rotate() */
  ang: number;
  opacity: number;
}

/** One frame: the plane's place as timeline.ts computes it, and the near-arm clearing. */
export interface GalaxyState {
  /** the camera target on the plane, image px */
  tx: number;
  ty: number;
  /** depth of the target toward the camera, CSS px */
  tz: number;
  /** plane scale */
  s: number;
  /** the disc's turn about the galactic centre, radians */
  spin: number;
  /** degrees */
  tilt: number;
  roll: number;
  /** CSS px cleared from the bottom edge, and the width of its soft edge */
  sweep: number;
  edge: number;
  bulge: GalaxyBulge;
}

export interface Galaxy {
  gl: GL;
  /** the photo is fetched and decoded; no GPU work yet */
  ready: Promise<void>;
  /** uploads the photo with its mipmaps and builds every pipeline: call in the text hold, after ready */
  upload(): void;
  draw(st: GalaxyState): void;
  /** stops a download still in flight */
  dispose(): void;
}

export interface GalaxyOptions {
  /** viewport, CSS px */
  W: number;
  H: number;
  FL: number;
  focal: readonly [number, number];
  /** the galactic centre, image px */
  gc: readonly [number, number];
  src: string;
  dpr: number;
}

interface Prog {
  p: WebGLProgram;
  a: Record<string, number>;
  u: Record<string, WebGLUniformLocation | null>;
}

/** Returns null without WebGL; throws if a shader fails (the caller's no-WebGL path handles both). */
export function createGalaxy(canvas: HTMLCanvasElement, o: GalaxyOptions): Galaxy | null {
  const { W, H, FL, focal, gc, dpr } = o;
  canvas.width = Math.max(1, Math.round(W * dpr));
  canvas.height = Math.max(1, Math.round(H * dpr));
  // No MSAA: the quad's edges are black on black and the bulge is a soft gradient.
  const attrs: WebGLContextAttributes = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
  const context: GL | null = canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs);
  if (!context) return null;
  const gl: GL = context;
  const webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

  const program = (vs: string, fs: string, attribs: string[], uniforms: string[]): Prog => {
    const p = gl.createProgram();
    for (const [type, text] of [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fs],
    ] as const) {
      const sh = gl.createShader(type);
      if (!sh) throw new Error("[intro] galaxy: createShader failed");
      gl.shaderSource(sh, text);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(`[intro] galaxy shader: ${gl.getShaderInfoLog(sh)}`);
      gl.attachShader(p, sh);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`[intro] galaxy program: ${gl.getProgramInfoLog(p)}`);
    const a: Record<string, number> = {};
    const u: Record<string, WebGLUniformLocation | null> = {};
    for (const n of attribs) a[n] = gl.getAttribLocation(p, n);
    for (const n of uniforms) u[n] = gl.getUniformLocation(p, n);
    return { p, a, u };
  };
  const plane = program(PLANE_VERT, PLANE_FRAG, ["aClip", "aUv"], ["uTex"]);
  const bulge = program(BULGE_VERT, BULGE_FRAG, ["aCorner"], ["uCenter", "uAxes", "uAngle", "uView", "uOpacity"]);
  const mask = program(MASK_VERT, MASK_FRAG, ["aPos"], ["uSweep", "uEdge"]);

  const buffer = (data: Float32Array, usage: number): WebGLBuffer => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return b;
  };
  const clip = new Float32Array(16); // 4 corners × (x, y, z, w), triangle strip
  const clipBuf = buffer(clip, gl.DYNAMIC_DRAW);
  const uvBuf = buffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const cornerBuf = buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const fullBuf = buffer(new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const drawWith = (prog: Prog, bufs: [string, WebGLBuffer, number][], mode: number, count: number): void => {
    const locs: number[] = [];
    for (const [name, buf, size] of bufs) {
      const loc = prog.a[name];
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      locs.push(loc);
    }
    gl.drawArrays(mode, 0, count);
    for (const loc of locs) gl.disableVertexAttribArray(loc);
  };

  const tex = gl.createTexture();
  let loaded = false;

  function draw(st: GalaxyState): void {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Fully swept, the mask would zero every pixel: the cleared canvas is the same frame.
    if (!loaded || st.sweep >= H) return;

    // Plane corners through the CSS-3D chain the old plane carried: the photo turns about the galactic
    // centre, then scale(s) · rotateX(tilt) · rotateZ(roll) about the target, the target translated to
    // F at depth tz, all seen through perspective FL about F.
    const ca = Math.cos(st.spin);
    const sa = Math.sin(st.spin);
    const ct = Math.cos(st.tilt * DEG);
    const stl = Math.sin(st.tilt * DEG);
    const cr = Math.cos(st.roll * DEG);
    const sr = Math.sin(st.roll * DEG);
    for (let i = 0; i < 4; i++) {
      const u = (i & 1) * PLANE_PX;
      const v = (i >> 1) * PLANE_PX;
      const px = gc[0] + (u - gc[0]) * ca - (v - gc[1]) * sa;
      const py = gc[1] + (u - gc[0]) * sa + (v - gc[1]) * ca;
      const ux = (px - st.tx) * st.s;
      const uy = (py - st.ty) * st.s;
      const y1 = uy * ct;
      const z1 = uy * stl; // CSS: +y down, +z toward the viewer
      const x2 = ux * cr - y1 * sr;
      const y2 = ux * sr + y1 * cr;
      const w = (FL - (st.tz + z1)) / FL; // screen = F + (x2, y2) / w
      clip[i * 4] = (2 * (focal[0] * w + x2)) / W - w;
      clip[i * 4 + 1] = w - (2 * (focal[1] * w + y2)) / H;
      clip[i * 4 + 2] = 2 * W_NEAR - w;
      clip[i * 4 + 3] = w;
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(plane.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(plane.u.uTex, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, clipBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, clip);
    drawWith(plane, [["aClip", clipBuf, 4], ["aUv", uvBuf, 2]], gl.TRIANGLE_STRIP, 4);

    // the bulge, screen-blended over the plane: out = src + dst · (1 − src)
    const b = st.bulge;
    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(bulge.p);
    gl.uniform2f(bulge.u.uCenter, b.x, b.y);
    gl.uniform2f(bulge.u.uAxes, b.len / 2, b.len * 0.18);
    gl.uniform1f(bulge.u.uAngle, b.ang);
    gl.uniform2f(bulge.u.uView, W, H);
    gl.uniform1f(bulge.u.uOpacity, b.opacity);
    drawWith(bulge, [["aCorner", cornerBuf, 2]], gl.TRIANGLE_STRIP, 4);

    // the sweep mask over the composited layer: dst *= mask
    if (st.sweep > 1) {
      gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
      gl.useProgram(mask.p);
      gl.uniform1f(mask.u.uSweep, st.sweep * dpr);
      gl.uniform1f(mask.u.uEdge, Math.max(1, st.edge * dpr));
      drawWith(mask, [["aPos", fullBuf, 2]], gl.TRIANGLES, 3);
    }
  }

  let img: HTMLImageElement | null = new Image();
  img.decoding = "async";
  img.src = o.src;
  let decoded = false;
  const ready = img.decode().then(() => {
    decoded = true;
  });

  function upload(): void {
    if (loaded || !decoded || !img) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    const pot = (n: number): boolean => (n & (n - 1)) === 0;
    // WebGL 1 cannot mipmap a non-power-of-two image (the live photo is 3072 px): plain linear there.
    if (webgl2 || (pot(img.naturalWidth) && pot(img.naturalHeight))) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const aniso =
      gl.getExtension("EXT_texture_filter_anisotropic") ??
      (gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") as EXT_texture_filter_anisotropic | null);
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, max));
    }
    loaded = true;
    img = null; // the GPU holds it now
    // Build every pipeline and finish the upload now, not on the first visible frame.
    draw({
      tx: gc[0],
      ty: gc[1],
      tz: 0,
      s: 0.5,
      spin: 0,
      tilt: 48,
      roll: -16,
      sweep: 100,
      edge: 100,
      bulge: { x: focal[0], y: focal[1], len: 200, ang: 0, opacity: 1 },
    });
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.finish();
  }

  function dispose(): void {
    if (img && !decoded) img.src = ""; // abort the download
    img = null;
  }

  return { gl, ready, upload, draw, dispose };
}
