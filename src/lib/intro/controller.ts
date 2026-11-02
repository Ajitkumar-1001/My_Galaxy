// Runs the first-visit intro (src/components/Intro.astro). Contract with the rest of the page:
// the head script in Layout.astro sets html.splash on a first visit; finish() — the one exit for
// every path — sets sessionStorage.hasVisited, removes html.splash, dispatches `splash:done` once
// (Hero, ProfileCard and Audio wait for it) and un-inerts #page-content, then tears the intro down.
import { gsap } from "gsap";
import { AUDIO_START, createTravelAudio } from "./audio";
import type { TravelAudio } from "./audio";
import { createGalaxy } from "./galaxy";
import type { Galaxy } from "./galaxy";
import { createSolar } from "./solar";
import type { Solar } from "./solar";
import { createStarfield } from "./starfield";
import type { Starfield } from "./starfield";
import {
  addWelcome,
  applyGlobe,
  buildIntroTimeline,
  clearGlobe,
  computeView,
  createRenderer,
  createState,
  film,
  GC,
  journeyJ,
  seamCamera,
  textOrigin,
  T_DONE,
  T_GATE,
  T_LANDED,
} from "./timeline";
import type { IntroElements, View } from "./timeline";

declare global {
  interface Window {
    /** DEV only: pause the intro at t seconds and render that frame. Returns the asset state. */
    __introSeek?: (t: number) => string;
  }
}

type FinishReason = "end" | "escape" | "reduced" | "webgl" | "assets" | "resize" | "watchdog";
type AssetState = "pending" | "ready" | "failed";

const WATCHDOG_MS = 15000;
const ASSET_GRACE_MS = 4000;
/** The welcome lines are in (L3 lands at 2.2 s): GPU uploads from here cannot stall an entrance. */
const T_WARM = 2.3;

function collect(overlay: HTMLElement): IntroElements | null {
  const one = <T extends Element>(sel: string): T | null => overlay.querySelector<T>(sel);
  const ground = one<HTMLElement>("#intro-ground");
  const stage = one<HTMLElement>("#intro-stage");
  const galaxyCanvas = one<HTMLCanvasElement>("#intro-galaxy");
  const starsCanvas = one<HTMLCanvasElement>("#intro-stars");
  const solarCanvas = one<HTMLCanvasElement>("#intro-solar");
  const copy = one<HTMLElement>("#intro-copy");
  const l1 = one<HTMLElement>("#intro-l1");
  const l3 = one<HTMLElement>("#intro-l3");
  const l2Words = Array.from(overlay.querySelectorAll<HTMLElement>("#intro-l2 .intro-w"));
  if (!ground || !stage || !galaxyCanvas || !starsCanvas || !solarCanvas || !copy || !l1 || !l3) {
    return null;
  }
  return { overlay, ground, stage, galaxyCanvas, starsCanvas, solarCanvas, copy, l1, l2Words, l3 };
}

export function startIntro(): void {
  // Tells the head script's safety net (Layout.astro) that the intro is running; from here on the
  // controller's own watchdog guarantees splash:done.
  (window as Window & { __introAlive?: boolean }).__introAlive = true;
  const html = document.documentElement;
  const overlay = document.getElementById("splash");
  const page = document.getElementById("page-content");
  const globeWrap = document.getElementById("intro-globe-wrap");

  if (!html.classList.contains("splash")) {
    overlay?.remove(); // returning visit: the overlay never shows and fetched nothing
    return;
  }

  let finished = false;
  let tl: gsap.core.Timeline | null = null;
  let tick: (() => void) | null = null;
  let fade: gsap.core.Tween | null = null;
  let watchdog = 0;
  let graceTimer = 0;
  const contexts: WebGLRenderingContextBase[] = [];
  const W0 = window.innerWidth;
  const H0 = window.innerHeight;
  let view: View | null = null;
  let galaxy: Galaxy | null = null;
  let travel: TravelAudio | null = null;

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === "Escape") finish("escape");
  };
  const onResize = (): void => {
    // iOS Safari resizes when its toolbar shows or hides: ignore height-only changes under 15%.
    if (window.innerWidth !== W0 || Math.abs(window.innerHeight - H0) > H0 * 0.15) finish("resize");
  };
  const onContextLost = (): void => finish("webgl");
  let onVisible: (() => void) | null = null;

  /** Lands the globe after splash:done exactly as the timeline would have (S6 runs to T_LANDED). */
  const landGlobe = (wrap: HTMLElement, v: View): void => {
    wrap.style.removeProperty("opacity"); // html.splash is gone, so the wrapper is visible
    const p = { t: T_DONE };
    const tail: gsap.core.Tween = gsap.to(p, {
      t: T_LANDED,
      duration: T_LANDED - T_DONE,
      ease: "none",
      onUpdate: () => {
        if (window.innerWidth !== W0 || window.innerHeight !== H0) {
          tail.kill();
          clearGlobe(wrap);
          return;
        }
        applyGlobe(wrap, v, T_LANDED, journeyJ(p.t));
      },
      onComplete: () => clearGlobe(wrap),
    });
  };

  function finish(reason: FinishReason): void {
    if (finished) return;
    finished = true;
    if (import.meta.env.DEV) console.info(`[intro] finish: ${reason}`);
    // The contract, in this order.
    try {
      sessionStorage.setItem("hasVisited", "true");
    } catch {
      // storage blocked: the intro simply plays again next visit
    }
    html.classList.remove("splash");
    window.dispatchEvent(new Event("splash:done"));
    if (page) page.inert = false;

    // Teardown.
    tl?.kill();
    tl = null;
    if (tick) gsap.ticker.remove(tick);
    fade?.kill();
    window.clearTimeout(watchdog);
    window.clearTimeout(graceTimer);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    if (onVisible) document.removeEventListener("visibilitychange", onVisible);
    if (els) {
      els.galaxyCanvas.removeEventListener("webglcontextlost", onContextLost);
      els.starsCanvas.removeEventListener("webglcontextlost", onContextLost);
      els.solarCanvas.removeEventListener("webglcontextlost", onContextLost);
    }
    for (const gl of contexts) gl.getExtension("WEBGL_lose_context")?.loseContext();
    galaxy?.dispose();
    if (reason === "end") travel?.release(); // the eclipse tail rings out past splash:done
    else travel?.stop();
    overlay?.remove();
    if (globeWrap) {
      if (reason === "end" && view) landGlobe(globeWrap, view);
      else clearGlobe(globeWrap); // Esc & co. land the globe at scale 1
    }
    if (import.meta.env.DEV) delete window.__introSeek;
  }

  const els = overlay ? collect(overlay) : null;
  if (!overlay || !els) {
    finish("webgl"); // markup missing: never hold the page hostage
    return;
  }
  if (page) page.inert = true;

  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);

  /** Plays the timeline once the tab is visible; the watchdog starts with it. */
  const begin = (timeline: gsap.core.Timeline): void => {
    const go = (): void => {
      if (finished) return;
      timeline.play();
      watchdog = window.setTimeout(() => finish("watchdog"), WATCHDOG_MS);
    };
    if (document.visibilityState === "visible") {
      go();
      return;
    }
    onVisible = () => {
      if (document.visibilityState !== "visible" || !onVisible) return;
      document.removeEventListener("visibilitychange", onVisible);
      onVisible = null;
      go();
    };
    document.addEventListener("visibilitychange", onVisible);
  };

  // Reduced motion (decided once): no WebGL, no fetch. Lines in, hold, overlay out onto the landed globe.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const r = gsap.timeline({ paused: true });
    r.fromTo([els.l1, ...els.l2Words, els.l3], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    if (globeWrap) r.set(globeWrap, { opacity: 1 }, 3.2); // under the still-opaque overlay
    r.fromTo(overlay, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, 3.2);
    r.call(() => finish("reduced"), undefined, 3.6);
    tl = r;
    begin(r);
    return;
  }

  // The one camera for this viewport, read from the live globe canvas (server-rendered, so present
  // before the Globe island hydrates).
  const box = overlay.getBoundingClientRect();
  const W = Math.round(box.width);
  const H = Math.round(box.height);
  const globeCanvas = globeWrap?.querySelector("canvas") ?? null;
  const v = computeView(W, H, globeCanvas ? globeCanvas.getBoundingClientRect() : null);
  view = v;

  // WebGL: the Milky Way (dpr ≤ 2; its photo starts downloading now), the star field (drawing buffer
  // capped at ~1 MP) and the solar system (dpr ≤ 1.5).
  const starScale = Math.min(1, Math.sqrt(1e6 / (W * H)));
  let stars: Starfield | null = null;
  let solar: Solar | null = null;
  try {
    galaxy = createGalaxy(els.galaxyCanvas, {
      W,
      H,
      FL: v.FL,
      focal: v.F,
      gc: GC,
      src: "/intro/milkyway.webp",
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    if (galaxy) {
      contexts.push(galaxy.gl);
      stars = createStarfield(els.starsCanvas, {
        width: Math.max(1, Math.round(W * starScale)),
        height: Math.max(1, Math.round(H * starScale)),
        focal: [v.F[0] / W, 1 - v.F[1] / H],
      });
    }
    if (stars) {
      contexts.push(stars.gl);
      solar = createSolar(els.solarCanvas, {
        W,
        H,
        FL: v.FL,
        focal: v.F,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        texBase: "/intro/tex/",
        dFar: v.Da,
        sky: { gain: 0.8, gcU: 0.5, bandV: 0.5, lonSign: -1, latSign: 1, ringFlip: 0, seamCam: seamCamera(v) },
      });
      contexts.push(solar.gl);
    }
  } catch (err) {
    console.warn("[intro] WebGL unavailable:", err);
    solar = null;
  }

  // No WebGL: show the text, hold, then finish — never block splash:done.
  if (!galaxy || !stars || !solar) {
    for (const gl of contexts) gl.getExtension("WEBGL_lose_context")?.loseContext();
    contexts.length = 0;
    galaxy?.dispose();
    galaxy = null;
    const w = gsap.timeline({ paused: true });
    addWelcome(w, els);
    w.fromTo(overlay, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, T_GATE);
    w.call(() => finish("webgl"), undefined, T_GATE + 0.4);
    tl = w;
    begin(w);
    return;
  }
  els.galaxyCanvas.addEventListener("webglcontextlost", onContextLost);
  els.starsCanvas.addEventListener("webglcontextlost", onContextLost);
  els.solarCanvas.addEventListener("webglcontextlost", onContextLost);
  const layers = { galaxy, stars, solar };

  // The ground div is black from here; the overlay's own background would hide the globe handoff.
  overlay.classList.remove("bg-black");

  const S = createState();
  const t = gsap.timeline({ paused: true });
  tl = t;
  buildIntroTimeline(t, S, els);

  // Fetch and decode the galaxy and every solar texture now; the timeline waits at 3.85 s if needed.
  // The GPU work (uploads, mipmaps, shader warm-up) waits for T_WARM so it cannot stall an entrance.
  let assets: AssetState = "pending";
  let decoded = false;
  let waiting = false;
  const fadeOutAndFinish = (): void => {
    if (finished || fade) return;
    tl?.pause();
    fade = gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power1.inOut", onComplete: () => finish("assets") });
  };
  const warm = (): void => {
    if (finished || !decoded || assets !== "pending") return;
    layers.galaxy.upload(); // the photo to the GPU, mipmapped, and every pipeline built: not at 4.4 s
    layers.solar.warmup(); // and the planets, sky and shaders: not at the seam
    assets = "ready";
    if (waiting) {
      waiting = false;
      window.clearTimeout(graceTimer);
      t.play();
    }
  };
  Promise.all([layers.galaxy.ready, layers.solar.ready])
    .then(() => {
      if (finished) return;
      decoded = true;
      if (t.time() >= T_WARM) warm();
    })
    .catch((err: unknown) => {
      if (finished) return;
      console.warn("[intro] assets failed:", err);
      assets = "failed";
      if (waiting) fadeOutAndFinish();
    });
  t.call(warm, undefined, T_WARM);
  t.call(
    () => {
      if (assets === "ready") return;
      t.pause(T_GATE); // the welcome text keeps holding
      if (assets === "failed") {
        fadeOutAndFinish();
        return;
      }
      waiting = true;
      graceTimer = window.setTimeout(() => {
        if (waiting) fadeOutAndFinish();
      }, ASSET_GRACE_MS);
    },
    undefined,
    T_GATE,
  );
  t.call(() => finish("end"), undefined, T_DONE);

  // Travel audio: preloads now, starts with the launch cue and follows the clock (audio.ts).
  const sound = createTravelAudio("/intro/travel.mp3");
  travel = sound;
  t.call(() => sound.start(t.time()), undefined, AUDIO_START);

  // The text block flies past the camera about F: measure it untransformed (again once fonts settle).
  els.copy.style.transformOrigin = textOrigin(els.copy, v);
  document.fonts?.ready.then(() => {
    if (!finished && S.time < film(4.6)) els.copy.style.transformOrigin = textOrigin(els.copy, v);
  });

  const render = createRenderer(S, v, els, layers, globeWrap);
  tick = () => {
    S.time = t.time();
    render();
    if (!t.paused()) sound.sync(S.time);
  };
  gsap.ticker.add(tick);
  render();

  if (import.meta.env.DEV) {
    window.__introSeek = (time: number): string => {
      if (finished) return "finished";
      window.clearTimeout(watchdog); // QA holds frames longer than the watchdog allows
      window.clearTimeout(graceTimer);
      waiting = false;
      t.pause(time);
      S.time = time;
      render();
      return `${assets} t=${t.time().toFixed(3)} paused=${t.paused()}`;
    };
  }

  begin(t);
}
