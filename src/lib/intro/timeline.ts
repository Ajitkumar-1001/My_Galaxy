// The intro's motion, ported 1:1 from the approved previz (compositions/intro.html, SPEC.md):
// one state object S that the GSAP timeline tweens and every layer reads, the journey variable J
// (nats of zoom) in six velocity-matched segments, and render(), a pure function of S.
// The previz is 1920x1080 only; computeView() adapts the camera to the live viewport and globe.
import { gsap } from "gsap";
import { GLOBE_MAX_SIZE } from "../../data/globe";
import { bodyPosition, EARTH_R } from "./solar";
import type { Solar, SolarCam } from "./solar";
import type { Starfield } from "./starfield";

const DEG = Math.PI / 180;

// Milky Way plane, in 4096 "image px" (the <img> is 4096 CSS px square whatever its file size).
const GC = [2048, 2048] as const;
const SUN_PX = [2043, 2835] as const;
const M0_1080 = 0.00285; // magnification at J = 0 at 1920x1080 (11 px disc; ~1160 px on arrival)
const SPIN = 2; // deg/s, clockwise about GC
const BAR_ANGLE = -35 * DEG; // the bar runs lower-left → upper-right in the image
const BAR_HALF = 430; // half its length, image px

export const J_SEAM = 7.45; // galaxy → solar system
export const J_ARR = 8.772; // solar arrival: the star field's zoom boost ends here
export const J_END = 12.434; // Earth's radius = the landed globe's

const EARTH_PHASE0 = -108.47; // deg: Earth 30° right of the camera–Sun line at 9.4 s
const AZ_START = -90;
const AZ_END = -53.0; // Earth's direction from the Sun at 10.75 s: the camera ends on Earth's night side
const INCL_END = 86; // 4° above the ecliptic: the Sun rises just over Earth's upper limb, then is eclipsed
const SOLAR_ROLL = -6;

// Pace (previz SPEC.md "PACE", pass 5): after the launch the journey plays at 1/K speed. Times in this
// file are design seconds (the previz SHOTS); film() places one on the clock, design() maps a clock
// instant back, so the intro's own motion (galaxy spin, stars, planets) shows the approved frames, sooner.
const K = 0.85;
const T0 = 3.9; // the launch: the welcome text before it keeps its pace
export const film = (d: number): number => (d <= T0 ? d : T0 + (d - T0) * K);
const design = (f: number): number => (f <= T0 ? f : T0 + (f - T0) / K);

/** the timeline holds here until every texture has decoded (the camera starts at 3.9) */
export const T_GATE = 3.85;
/** the live globe starts taking over from Earth (design 10.35) */
export const T_HANDOFF = film(10.35);
/** splash:done (design 11.3) */
export const T_DONE = film(11.3);
/** the globe lands, S6 ends (design 11.6) */
export const T_LANDED = film(11.6);

/** Every value the timeline tweens; render() reads only this (plus time). */
export interface IntroState {
  time: number;
  J: number;
  tilt: number;
  roll: number;
  gTarget: number;
  sys: number;
  sTarget: number;
  incl: number;
  azim: number;
  earth: number;
  others: number;
  sweep: number;
  sky: number;
}

export function createState(): IntroState {
  return {
    time: 0,
    J: 0,
    tilt: 48,
    roll: -16,
    gTarget: 0,
    sys: 0,
    sTarget: 0,
    incl: 58,
    azim: AZ_START,
    earth: 1,
    others: 1,
    sweep: 0,
    sky: 0,
  };
}

/** The one camera, fitted to this viewport. All lengths in CSS px. */
export interface View {
  W: number;
  H: number;
  /** vanishing point = the live globe's sphere centre */
  F: readonly [number, number];
  /** the landed globe's sphere radius */
  Rg: number;
  /** focal length: vertical FOV 30° */
  FL: number;
  /** on-screen scale vs 1920x1080 */
  k: number;
  M0: number;
  /** solar-camera distance at the arrival (J_ARR) and at the landing (J_END) */
  Da: number;
  Dend: number;
  sigma: number;
}

/**
 * globeRect: the live cobe canvas. cobe draws a bottom-anchored square of side w whose sphere
 * radius is 0.8·w/2, so F = (x + w/2, y + h − w/2) and Rg = 0.4·w.
 */
export function computeView(W: number, H: number, globeRect: DOMRect | null): View {
  let F: [number, number];
  let Rg: number;
  if (globeRect && globeRect.width > 0 && globeRect.height > 0) {
    F = [globeRect.x + globeRect.width / 2, globeRect.y + globeRect.height - globeRect.width / 2];
    Rg = 0.4 * globeRect.width;
  } else {
    const g = Math.min(W, GLOBE_MAX_SIZE);
    F = [W / 2, H - g / 2];
    Rg = 0.4 * g;
  }
  const FL = H / 2 / Math.tan(15 * DEG);
  const k = Math.min(W / 1920, H / 1080);
  // Neptune's orbit (54.84) spans 921·k px at the arrival, as 921 px does at 1920x1080.
  const Da = (FL * 54.84) / (921 * k);
  // Earth's exact perspective silhouette, FL·R/√(D² − R²), equals Rg at the landing, so the globe
  // wrapper's scale ends at exactly 1 and clearing it at 11.6 cannot jump.
  const Dend = Math.sqrt(((EARTH_R * FL) / Rg) ** 2 + EARTH_R * EARTH_R);
  const sigma = Math.log(Da / Dend) / (J_END - J_ARR);
  return { W, H, F, Rg, FL, k, M0: M0_1080 * k, Da, Dend, sigma };
}

/** Solar-camera distance to its target for journey J (replaces the previz's constant D_SEAM). */
export function solarDistance(view: View, J: number): number {
  return J <= J_ARR ? view.Da * Math.exp(-(J - J_ARR)) : view.Da * Math.exp(-(J - J_ARR) * view.sigma);
}

/** Earth's projected radius from the solar camera, CSS px. */
export function earthRadiusPx(view: View, D: number): number {
  return (EARTH_R * view.FL) / Math.sqrt(Math.max(D * D - EARTH_R * EARTH_R, 1e-6));
}

interface JSegment {
  from: number;
  to: number;
  dur: number;
  ease: string;
  at: number;
}

/** The journey J: six velocity-matched segments (SPEC.md MOTION), design seconds. */
const J_SEGMENTS: readonly JSegment[] = [
  { from: 0, to: 1.882, dur: 1.05, ease: "power2.in", at: 3.9 }, // S1 launch
  { from: 1.882, to: 4.66, dur: 1.55, ease: "power2.out", at: 4.95 }, // S2 arrive at the Milky Way
  { from: 4.66, to: 7.45, dur: 1.9, ease: "power3.in", at: 6.6 }, // S3 dive to the Sun
  { from: 7.45, to: 8.772, dur: 0.9, ease: "power3.out", at: 8.5 }, // S4 land in the solar system
  { from: 8.772, to: 10.69, dur: 1.1, ease: "power2.in", at: 9.5 }, // S5 approach Earth
  { from: 10.69, to: 12.434, dur: 1.0, ease: "power2.out", at: 10.6 }, // S6 land on the globe
];

/** J at clock time t, evaluated from the same segments the timeline tweens (used after the timeline ends). */
export function journeyJ(t: number): number {
  const td = design(t);
  let J = 0;
  for (const s of J_SEGMENTS) {
    if (td <= s.at) break;
    const u = Math.min(1, (td - s.at) / s.dur);
    J = s.from + (s.to - s.from) * gsap.parseEase(s.ease)(u);
  }
  return J;
}

export interface IntroElements {
  overlay: HTMLElement;
  ground: HTMLElement;
  stage: HTMLElement;
  plane: HTMLElement;
  galaxy: HTMLImageElement;
  bulge: HTMLElement;
  starsCanvas: HTMLCanvasElement;
  solarCanvas: HTMLCanvasElement;
  /** the text block (all three lines) */
  copy: HTMLElement;
  l1: HTMLElement;
  l2Words: HTMLElement[];
  l3: HTMLElement;
}

/** B1 entrances (pass 1 timings); also the whole show when WebGL is unavailable. */
export function addWelcome(tl: gsap.core.Timeline, els: IntroElements): void {
  tl.fromTo(els.l1, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }, 0);
  tl.fromTo(els.l2Words, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "expo.out", stagger: 0.06 }, 0.9);
  tl.fromTo(
    els.l3,
    { opacity: 0, filter: "blur(8px)" },
    { opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "expo.out" },
    1.8,
  );
}

/**
 * Every tween of compositions/intro.html, same design times, eases and values: after the launch each
 * is placed with film() and its length multiplied by K, as the previz does. Tweens after t = 0 on an
 * already-tweened property take immediateRender: false, so the built state at t = 0 is S's start
 * values and each DOM tween's first "from" value. Two previz tweens live elsewhere: the particles
 * fade (CSS, on html.splash removal) and the globe layer (render(), with its scale).
 */
export function buildIntroTimeline(tl: gsap.core.Timeline, S: IntroState, els: IntroElements): void {
  // B1 Welcome 0.0–4.6
  tl.fromTo(els.starsCanvas, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0);
  addWelcome(tl, els);

  // The journey J.
  for (const s of J_SEGMENTS) {
    tl.fromTo(S, { J: s.from }, { J: s.to, duration: s.dur * K, ease: s.ease, immediateRender: false }, film(s.at));
  }

  // B2 Milky Way: the camera flies through the text (scaled about F, see textOrigin), then the galaxy
  // grows out of the vanishing point behind it.
  tl.fromTo(els.copy, { scale: 1, filter: "blur(0px)" }, { scale: 6, filter: "blur(8px)", duration: 0.32 * K, ease: "power2.in" }, film(4.6));
  tl.fromTo(els.copy, { opacity: 1 }, { opacity: 0, duration: 0.26 * K, ease: "power1.in" }, film(4.66));
  tl.fromTo(els.stage, { opacity: 0 }, { opacity: 1, duration: 0.4 * K, ease: "power1.out" }, film(4.4));
  // Seen from outside, the Milky Way hangs in near-black; the stars return as the camera enters the disc.
  tl.fromTo(els.starsCanvas, { opacity: 1 }, { opacity: 0.15, duration: 1.2 * K, ease: "power1.inOut", immediateRender: false }, film(5.0));
  tl.fromTo(els.starsCanvas, { opacity: 0.15 }, { opacity: 1, duration: 0.8 * K, ease: "power1.in", immediateRender: false }, film(7.5));

  // B3 Dive: swing to the Sun, lower the camera toward the disc.
  tl.fromTo(S, { gTarget: 0 }, { gTarget: 1, duration: 1.6 * K, ease: "power2.inOut", immediateRender: false }, film(6.4));
  tl.fromTo(S, { tilt: 48, roll: -16 }, { tilt: 66, roll: -6, duration: 2.0 * K, ease: "power2.inOut", immediateRender: false }, film(6.4));
  tl.fromTo(S, { sweep: 0 }, { sweep: 1, duration: 0.42 * K, ease: "power2.in", immediateRender: false }, film(8.2));
  // the far band at the horizon fades as the solar system lands
  tl.fromTo(els.stage, { opacity: 1 }, { opacity: 0, duration: 0.3 * K, ease: "power1.in", immediateRender: false }, film(8.45));

  // B4 Solar system: orbits, planets and belt resolve around the Sun as the zoom lands.
  tl.fromTo(S, { sys: 0 }, { sys: 1, duration: 0.4 * K, ease: "power1.out", immediateRender: false }, film(8.35));

  // B5 Earth → globe
  tl.fromTo(S, { sTarget: 0 }, { sTarget: 1, duration: 0.9 * K, ease: "power2.inOut", immediateRender: false }, film(9.2));
  tl.fromTo(
    S,
    { incl: 58, azim: AZ_START },
    { incl: INCL_END, azim: AZ_END, duration: 1.4 * K, ease: "power2.inOut", immediateRender: false },
    film(9.2),
  );
  tl.fromTo(S, { others: 1 }, { others: 0, duration: 0.4 * K, ease: "power2.in", immediateRender: false }, film(10.05)); // the globe is the only hero
  tl.fromTo(els.ground, { opacity: 1 }, { opacity: 0, duration: 0.4 * K, ease: "power2.inOut" }, film(10.05));
  tl.fromTo(S, { earth: 1 }, { earth: 0, duration: 0.3 * K, ease: "power1.inOut", immediateRender: false }, T_HANDOFF);
  // From the seam the real Milky Way is the sky; the site's flare stars (welcome sky, dive streaks) leave.
  tl.fromTo(S, { sky: 0 }, { sky: 1, duration: 0.5 * K, ease: "power1.inOut", immediateRender: false }, film(8.4));
  tl.fromTo(els.starsCanvas, { opacity: 1 }, { opacity: 0, duration: 0.7 * K, ease: "power1.inOut", immediateRender: false }, film(8.6));
  tl.fromTo(els.solarCanvas, { opacity: 1 }, { opacity: 0, duration: 0.45 * K, ease: "power1.in" }, film(10.65));
  // Overlay gone by T_DONE, when the intro removes html.splash and fires splash:done.
  tl.fromTo(els.overlay, { opacity: 1 }, { opacity: 0, duration: 0.3 * K, ease: "power1.inOut" }, film(11.0));
}

/** The text block scales about F (block-local px). Measure while it is untransformed. */
export function textOrigin(copy: HTMLElement, view: View): string {
  const r = copy.getBoundingClientRect();
  return `${view.F[0] - r.left}px ${view.F[1] - r.top}px`;
}

const fadeEase = gsap.parseEase("power1.inOut");

/**
 * The live globe takes over from Earth: from T_HANDOFF it is scaled about F to Earth's projected
 * radius (so the two coincide) and its wrapper fades in over design 10.35–10.65.
 */
export function applyGlobe(globeWrap: HTMLElement, view: View, t: number, J: number): void {
  const r = earthRadiusPx(view, solarDistance(view, J));
  globeWrap.style.transformOrigin = `${view.F[0]}px ${view.F[1]}px`;
  globeWrap.style.transform = `scale(${r / view.Rg})`;
  globeWrap.style.opacity = String(fadeEase(Math.min(1, Math.max(0, (t - T_HANDOFF) / (0.3 * K)))));
}

export function clearGlobe(globeWrap: HTMLElement): void {
  globeWrap.style.removeProperty("transform");
  globeWrap.style.removeProperty("transform-origin");
  globeWrap.style.removeProperty("opacity");
}

export interface Layers {
  stars: Starfield;
  solar: Solar;
}

const setMask = (el: HTMLElement, value: string | null): void => {
  if (value === null) {
    el.style.removeProperty("mask-image");
    el.style.removeProperty("-webkit-mask-image");
  } else {
    el.style.setProperty("mask-image", value);
    el.style.setProperty("-webkit-mask-image", value);
  }
};

// Layer windows (from the opacity tweens, on the clock): drawing outside them changes nothing on screen.
const STAGE_FROM = film(4.4);
const STAGE_TO = film(8.75);
const STARS_TO = film(9.3);
const SOLAR_FROM = T0;
const SOLAR_TO = film(11.1);

/** Returns render(): paints every layer from S (port of the previz renderAt). */
export function createRenderer(
  S: IntroState,
  view: View,
  els: IntroElements,
  layers: Layers,
  globeWrap: HTMLElement | null,
): () => void {
  const { F, FL, M0 } = view;
  // The bottom-up clearing of the near disc is screen-space: scale its 1080 px schedule to H.
  const SWEEP = (1150 * view.H) / 1080;
  const SWEEP_EDGE = (260 * view.H) / 1080;
  els.stage.style.perspective = `${FL}px`;
  els.stage.style.perspectiveOrigin = `${F[0]}px ${F[1]}px`;
  const solarGl = layers.solar.gl;
  let solarDrawn = false;
  let globeStyled = false;
  let stageMasked = false;
  let starsMasked = false;

  return function render(): void {
    const t = S.time;
    // The intro's own motion (galaxy spin, stars, planets) runs on design time: each frame is the approved one.
    const td = design(t);
    const J = S.J;

    // Milky Way: m = magnification at the target. m ≤ 1 scales the plane in place, m > 1 moves it
    // toward the camera; by similar triangles both give the same picture, so the switch is seamless.
    const m = M0 * Math.exp(Math.min(J, 10));
    const s = Math.min(m, 1);
    const tz = FL * (1 - s / m);
    const spin = SPIN * td;
    const a = spin * DEG;
    const dx = SUN_PX[0] - GC[0];
    const dy = SUN_PX[1] - GC[1];
    const sunX = GC[0] + dx * Math.cos(a) - dy * Math.sin(a);
    const sunY = GC[1] + dx * Math.sin(a) + dy * Math.cos(a);
    const tx = GC[0] + (sunX - GC[0]) * S.gTarget;
    const ty = GC[1] + (sunY - GC[1]) * S.gTarget;

    // A point on the plane, projected exactly as CSS does (scale, rotateX, rotateZ, perspective about F).
    const toScreen = (px: number, py: number): [number, number] => {
      const ux = (px - tx) * s;
      const uy = (py - ty) * s;
      const y1 = uy * Math.cos(S.tilt * DEG);
      const z1 = uy * Math.sin(S.tilt * DEG); // CSS: +y down, +z toward the viewer
      const x2 = ux * Math.cos(S.roll * DEG) - y1 * Math.sin(S.roll * DEG);
      const y2 = ux * Math.sin(S.roll * DEG) + y1 * Math.cos(S.roll * DEG);
      const kk = FL / (FL - (tz + z1));
      return [F[0] + x2 * kk, F[1] + y2 * kk];
    };
    // The guiding star sits on its true place in the Orion Spur until the swing brings it to F.
    const sunFocal: readonly [number, number] = S.gTarget < 1 ? toScreen(sunX, sunY) : F;

    if (t >= STAGE_FROM && t <= STAGE_TO) {
      els.plane.style.transformOrigin = `${tx}px ${ty}px`;
      els.plane.style.transform =
        `translate3d(${F[0] - tx}px,${F[1] - ty}px,${tz}px) rotateZ(${S.roll}deg) rotateX(${S.tilt}deg) scale(${s})`;
      els.galaxy.style.transform = `rotate(${spin}deg)`;

      // Bulge: the bar's two ends (spun with the disc) projected like the Sun; a glow 1.05x the projected
      // bar long and 0.36x as tall, so it keeps its height as the disc tilts toward edge-on.
      const ba = a + BAR_ANGLE;
      const e1 = toScreen(GC[0] + BAR_HALF * Math.cos(ba), GC[1] + BAR_HALF * Math.sin(ba));
      const e2 = toScreen(GC[0] - BAR_HALF * Math.cos(ba), GC[1] - BAR_HALF * Math.sin(ba));
      const bl = Math.hypot(e1[0] - e2[0], e1[1] - e2[1]) * 1.05;
      const bang = Math.atan2(e1[1] - e2[1], e1[0] - e2[0]);
      const tiltK = Math.min(1, Math.max(0, (S.tilt - 46) / 20));
      // raised along the disc's projected normal so the bulge rises above the plane, not a decal on it
      const lift = 0.22 * bl * 0.36 * tiltK;
      const nx = Math.sin(S.roll * DEG);
      const ny = -Math.cos(S.roll * DEG);
      els.bulge.style.transform =
        `translate(${(e1[0] + e2[0]) / 2 - 50 + nx * lift}px,${(e1[1] + e2[1]) / 2 - 50 + ny * lift}px) ` +
        `rotate(${bang}rad) scale(${bl / 100},${(bl * 0.36) / 100})`;
      els.bulge.style.opacity = String(0.3 + 0.45 * tiltK * tiltK * (3 - 2 * tiltK));

      // The near disc passes beneath the camera: the arm clears from the bottom edge upward, while the
      // far disc and the bar hold at the horizon until the last fade.
      const sweep = S.sweep * SWEEP;
      if (sweep > 1) {
        setMask(els.stage, `linear-gradient(to top, transparent ${sweep}px, #000 ${sweep + SWEEP_EDGE}px)`);
        stageMasked = true;
      } else if (stageMasked) {
        setMask(els.stage, null);
        stageMasked = false;
      }
    }

    // Near star field: base drift at the site's rate + a boost that follows the camera's zoom.
    const Js = Math.min(J, J_ARR);
    if (t < STARS_TO) {
      layers.stars.draw({ time: td, starSpeed: td * 0.2 + 0.16 * Js, density: 2.5 * Math.exp(-0.04 * Js), glow: 0.2 });
    }

    // Solar system: same J, so the Sun brightens through the dive and the zoom never jumps.
    const D = solarDistance(view, J);

    // Once Earth starts handing over to the globe, keep the far stars off Earth's face.
    if (S.earth < 1) {
      const earthR = (EARTH_R * FL) / D;
      setMask(
        els.starsCanvas,
        `radial-gradient(circle at ${F[0]}px ${F[1]}px, transparent ${earthR}px, #000 ${earthR + 2}px)`,
      );
      starsMasked = true;
    } else if (starsMasked) {
      setMask(els.starsCanvas, null);
      starsMasked = false;
    }

    if (t >= SOLAR_FROM && t <= SOLAR_TO) {
      const e = bodyPosition("earth", td, EARTH_PHASE0);
      const q = S.sTarget;
      const cam: SolarCam = { target: [e[0] * q, e[1] * q, e[2] * q], D, incl: S.incl, azim: S.azim, roll: SOLAR_ROLL };
      layers.solar.draw({
        t: td,
        focal: sunFocal,
        sys: S.sys,
        earth: S.earth,
        others: S.others,
        guide: S.gTarget,
        sky: S.sky,
        earthPhase0: EARTH_PHASE0,
        cam,
      });
      solarDrawn = true;
    } else if (solarDrawn && t < SOLAR_FROM) {
      solarGl.clear(solarGl.COLOR_BUFFER_BIT | solarGl.DEPTH_BUFFER_BIT); // seeking back before the camera starts
      solarDrawn = false;
    }

    // The live globe (page layer) takes over from Earth.
    if (globeWrap) {
      if (t >= T_HANDOFF) {
        applyGlobe(globeWrap, view, t, J);
        globeStyled = true;
      } else if (globeStyled) {
        clearGlobe(globeWrap);
        globeStyled = false;
      }
    }
  };
}

/** The sky panorama's band continues the galaxy plane's horizon at the seam camera. */
export function seamCamera(view: View): SolarCam {
  return { target: [0, 0, 0], D: solarDistance(view, J_SEAM), incl: 58, azim: AZ_START, roll: SOLAR_ROLL };
}
