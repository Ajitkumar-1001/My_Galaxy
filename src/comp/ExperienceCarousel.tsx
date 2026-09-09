import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Experience_data } from "../data/data";

// Ported from the "Experience - Orbit v5" Claude Design prototype: a 3D ring
// carousel of role cards. The prototype's own globe (loaded from esm.sh) is
// reference only, for the visual — it is NOT reproduced here. This section
// renders no globe of its own; the app already has exactly one, fixed full-
// screen behind the whole page (index.astro's <Globe client:idle .../>, in
// components/ui/globe.tsx). The ring's center is left empty so that globe
// shows through once Experience is centered in the viewport. `computeGeo`'s
// `G` still reserves that empty space at the right size/position — it just
// isn't filled with a second globe instance.

interface ExperienceCarouselProps {
  items: Experience_data[];
}

interface CarouselItem {
  id: number;
  logo: string;
  company: string;
  role: string;
  period: string;
  years: string;
  bullets: string[];
}

interface RingState {
  pos: number;
  target: number;
  dragging: boolean;
  spinning: boolean;
  entered: boolean;
  intro: boolean;
  hover: boolean;
}

interface Geo {
  cardW: number;
  cardH: number | undefined;
  pad: number;
  G: number;
  R: number;
  T: number;
  Z: number;
  stageH: number;
  sceneTop: number;
}

const PERSPECTIVE = 1400; // must match the `perspective` set on each card layer below
const ROTATE_SECONDS = 28; // ponytail: was a design-tool slider (12-60s); hardcoded, tune here if the drift feels off
const SPREAD = 1;
const GLOBE_SCALE = 0.7;
const GLOBE_REVEAL = 0.9;
const EASE = "cubic-bezier(0,0,.2,1)";
const COLOR_TRANSITION = "background 500ms ease-out,border-color 500ms ease-out,box-shadow 500ms ease-out";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const pad2 = (n: number) => String(n).padStart(2, "0");
const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
const yearOf = (period: string) => /\d{4}/.exec(period)?.[0] ?? period;

function toCarouselItems(items: Experience_data[]): CarouselItem[] {
  return items.map((e) => ({
    id: e.id,
    logo: e.logo,
    company: e.company_name,
    role: e.role,
    period: `${e.period_Start} — ${e.period_end}`,
    years: `${yearOf(e.period_Start)} — ${e.period_end === "Present" ? "Now" : yearOf(e.period_end)}`,
    bullets: e.role_description
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  }));
}

function computeGeo(stageW: number, innerH: number): Geo {
  const W = stageW || 960;
  const narrow = W < 720;
  const cardW = narrow ? W : Math.round(Math.min(520, Math.max(320, W * 0.54)));
  const pad = narrow ? 24 : 32;
  const measured = innerH > 0;
  const cardH = measured ? innerH + pad * 2 + 2 : Math.round(cardW * 0.9);
  const G = Math.round(cardW * GLOBE_SCALE * (narrow ? 0.8 : 1));
  const R = narrow ? cardW * 0.85 : cardW * 1.25 * SPREAD;
  const reveal = Math.min(1, Math.max(0.5, GLOBE_REVEAL));
  const T = cardH / 2 + (reveal - 0.5) * G; // how much of the globe peeks above the front card
  const sSide = PERSPECTIVE / (PERSPECTIVE + R);
  const top = Math.min(-G / 2, (-sSide * cardH) / 2);
  const bottom = T + cardH / 2;
  const margin = 24;
  // Max depth throw for the card furthest from the viewer (u=1). Anchored to
  // G (the globe's reserved diameter) on top of the orbit's own radius, so
  // the back of the ring is always well past the globe's own back — cards
  // revolve around it as the center, not just alongside it.
  const Z = G + 2 * R;
  return {
    cardW,
    cardH: measured ? cardH : undefined,
    pad,
    G,
    R,
    T,
    Z,
    stageH: Math.round(bottom - top + margin * 2),
    sceneTop: Math.round(margin - top),
  };
}

const ExperienceCarousel: React.FC<ExperienceCarouselProps> = ({ items }) => {
  const cards = useMemo(() => toCarouselItems(items), [items]);
  const count = cards.length;

  // Mirrors the ported prototype's single mutable `this.state` object: read
  // from `ring.current` (always fresh) and written via setRing, which forces
  // a re-render. Plain useState per field would go stale inside the
  // persistent rAF loop below, which mounts once and never re-subscribes.
  const ring = useRef<RingState>({
    pos: -1.2,
    target: 0,
    dragging: false,
    spinning: false,
    entered: false,
    intro: true,
    hover: false,
  });
  const [, bump] = useReducer((c: number) => c + 1, 0);
  const setRing = useCallback((patch: Partial<RingState>) => {
    Object.assign(ring.current, patch);
    bump();
  }, []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRefs = useRef(new Map<number, HTMLDivElement>());
  const dragRef = useRef<{ id: number; x0: number; pos0: number; moved: boolean; k: number | null } | null>(null);
  const resumeAtRef = useRef(0);
  const lastWheelRef = useRef(0);

  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current = !!reducedMotion;
  }, [reducedMotion]);

  const [size, setSize] = useState({ stageW: 0, innerH: 0 });
  const geo = useMemo(() => computeGeo(size.stageW, size.innerH), [size.stageW, size.innerH]);

  const inView = useInView(wrapRef, { once: true, amount: 0.3 });

  // Measure the wrap width and the tallest card so the ring's radius and
  // stage height always match real content, on first paint and on resize.
  useEffect(() => {
    const measure = () => {
      const stageW = wrapRef.current?.clientWidth ?? 0;
      let innerH = 0;
      innerRefs.current.forEach((el) => {
        innerH = Math.max(innerH, el.offsetHeight);
      });
      setSize((prev) => (prev.stageW === stageW && prev.innerH === innerH ? prev : { stageW, innerH }));
    };
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    innerRefs.current.forEach((el) => ro.observe(el));
    measure();
    return () => ro.disconnect();
  }, [count]);

  // First time the carousel scrolls into view: snap to role 0 and hold there
  // briefly before the ring starts drifting.
  useEffect(() => {
    if (!inView || ring.current.entered) return;
    resumeAtRef.current = performance.now() + 2600;
    setRing({ entered: true, pos: 0, target: 0 });
    const t = window.setTimeout(() => setRing({ intro: false }), 900);
    return () => window.clearTimeout(t);
  }, [inView, setRing]);

  const pause = useCallback((ms: number) => {
    resumeAtRef.current = Math.max(resumeAtRef.current, performance.now() + ms);
  }, []);

  const step = useCallback(
    (dir: number) => {
      pause(4000);
      const t = Math.round(ring.current.pos) + dir;
      setRing({ pos: t, target: t, dragging: false, spinning: false });
    },
    [pause, setRing]
  );

  const go = useCallback(
    (k: number) => {
      pause(4000);
      const cur = Math.round(ring.current.pos);
      let diff = mod(k - mod(cur, count), count);
      if (diff > count / 2) diff -= count;
      const t = cur + diff;
      setRing({ pos: t, target: t, dragging: false, spinning: false });
    },
    [pause, setRing, count]
  );

  // Continuous drift: nudges the ring forward each frame unless something
  // should hold it still (hover, drag, a hidden tab, reduced motion, or the
  // brief pause after any interaction). ponytail: per-frame setState is fine
  // at 4 cards; if it ever gets janky, swap `pos` for a framer-motion
  // useMotionValue + per-card useTransform instead of re-rendering React.
  useEffect(() => {
    let raf = 0;
    let lastTick = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, lastTick ? now - lastTick : 0);
      lastTick = now;
      const s = ring.current;
      const paused =
        reducedRef.current ||
        s.hover ||
        dragRef.current !== null ||
        document.hidden ||
        !s.entered ||
        s.intro ||
        now < resumeAtRef.current;
      if (paused) {
        if (s.spinning && dragRef.current === null) {
          const t = Math.round(s.pos);
          setRing({ spinning: false, pos: t, target: t });
        }
        return;
      }
      const pos = s.pos + (dt / 1000) * (count / ROTATE_SECONDS);
      setRing({ pos, target: Math.round(pos), spinning: true });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, setRing]);

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const hit = (e.target as HTMLElement).closest?.("[data-k]") as HTMLElement | null;
    dragRef.current = {
      id: e.pointerId,
      x0: e.clientX,
      pos0: ring.current.pos,
      moved: false,
      k: hit ? Number(hit.dataset.k) : null,
    };
    try {
      stageRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // ponytail: capture is best-effort, some pointer types reject it harmlessly
    }
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0;
      if (!d.moved) {
        if (Math.abs(dx) < 6) return;
        d.moved = true;
      }
      const pos = d.pos0 - dx / (geo.cardW * 0.9);
      setRing({ pos, target: Math.round(pos), dragging: true, spinning: false });
    },
    [geo.cardW, setRing]
  );

  const onUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.id) return;
      dragRef.current = null;
      pause(4000);
      if (!d.moved) {
        if (d.k != null && d.k !== mod(ring.current.target, count)) {
          go(d.k);
          return;
        }
        const t = Math.round(ring.current.pos);
        setRing({ pos: t, target: t, dragging: false, spinning: false });
        return;
      }
      const dx = e.clientX - d.x0;
      const start = Math.round(d.pos0);
      let t = Math.round(ring.current.pos);
      if (t === start && Math.abs(dx) > 40) t = start - Math.sign(dx);
      setRing({ pos: t, target: t, dragging: false, spinning: false });
    },
    [pause, go, count, setRing]
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    },
    [step]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 10) return;
      const now = performance.now();
      if (now - lastWheelRef.current < 700) return;
      lastWheelRef.current = now;
      step(e.deltaX > 0 ? 1 : -1);
    },
    [step]
  );

  const onEnter = useCallback(() => setRing({ hover: true }), [setRing]);
  const onLeave = useCallback(() => {
    setRing({ hover: false });
    pause(1200);
  }, [setRing, pause]);

  const s = ring.current;
  const active = mod(s.target, count);
  const duration = s.intro ? 800 : 500;
  const transition =
    s.dragging || s.spinning
      ? COLOR_TRANSITION
      : `transform ${duration}ms ${EASE},opacity ${duration}ms ${EASE},${COLOR_TRANSITION}`;

  return (
    <div ref={wrapRef} onKeyDown={onKey} className="relative w-full max-w-5xl mx-auto px-4 flex flex-col gap-10">
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Roles"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onWheel={onWheel}
        className="relative touch-pan-y select-none"
        style={{ height: geo.stageH, cursor: s.dragging ? "grabbing" : "grab" }}
      >
        <div className="absolute left-0 right-0 h-0" style={{ top: geo.sceneTop }}>
          {/* No globe rendered here on purpose: the page's one existing
              fixed background Globe (index.astro) sits behind everything and
              shows through this empty circle once the section is centered
              in the viewport. `geo.G` still reserves the space for it. */}

          {cards.map((item, k) => {
            let d = mod(k - s.pos, count);
            if (d > count / 2) d -= count;
            // Negated so the ring's on-screen sweep direction matches the site's
            // globe (Globe.tsx increments phi, which drifts its surface left-to-
            // right); z-depth/opacity below depend only on cos(theta), so they're
            // unaffected by this sign flip.
            const theta = -(d * 2 * Math.PI) / count;
            const sinT = Math.sin(theta);
            const cosT = Math.cos(theta);
            const u = (1 - cosT) / 2; // 0 = front, 1 = fully behind the globe
            const x = geo.R * sinT;
            const z = -geo.Z * u;
            const y = geo.T * cosT;
            const isActive = k === active;
            const fade = 1 - smoothstep((u - 0.7) / 0.3);
            const opacity = s.entered ? (1 - 0.7 * Math.pow(u, 0.9)) * fade : 0;

            return (
              <div
                key={item.id}
                className="absolute left-0 right-0 top-0 h-0 flex items-center justify-center pointer-events-none"
                style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%", zIndex: Math.round((1 - u) * 100) + 1 }}
              >
                <article
                  data-k={k}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${k + 1} of ${count}: ${item.company}`}
                  aria-hidden={!isActive}
                  className={`relative flex-none rounded-[2rem] border backdrop-blur-xl overflow-hidden pointer-events-auto ${
                    isActive
                      ? "bg-black/60 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                      : "bg-black/40 border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)]"
                  }`}
                  style={{
                    width: geo.cardW,
                    height: geo.cardH ?? "auto",
                    padding: geo.pad,
                    transform: `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(34 * sinT).toFixed(2)}deg)`,
                    opacity,
                    transition,
                    cursor: s.dragging ? "grabbing" : isActive ? "grab" : "pointer",
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    ref={(el) => {
                      if (el) innerRefs.current.set(k, el);
                      else innerRefs.current.delete(k);
                    }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-center overflow-hidden">
                        <img src={item.logo} alt={item.company} className="w-full h-full object-contain brightness-110" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <h3 className="m-0 text-lg font-bold leading-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                          {item.company}
                        </h3>
                        <p className="m-0 text-sm font-bold text-white">{item.role}</p>
                      </div>
                      <span className="rounded-full bg-white/10 border border-white/5 px-3.5 py-1.5 text-xs font-semibold text-white tabular-nums whitespace-nowrap shadow-inner">
                        {item.period}
                      </span>
                    </div>
                    <div className="h-px bg-white/10 my-5" />
                    <div className="flex flex-col gap-3">
                      {item.bullets.map((text, n) => (
                        <div key={n} className="grid grid-cols-[26px_1fr] gap-2.5 items-baseline">
                          <span className="text-[11px] font-extrabold text-blue-500 tabular-nums tracking-wider">{pad2(n + 1)}</span>
                          <p className="m-0 text-sm font-semibold leading-relaxed text-white/90">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          type="button"
          aria-label="Previous role"
          onClick={() => step(-1)}
          className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:scale-105 hover:shadow-[0_0_15px_#3b82f6,0_0_30px_#8b5cf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {cards.map((item, k) => {
            const on = k === active;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`${item.company}, ${item.role}`}
                aria-current={on}
                onClick={() => go(k)}
                className="cursor-pointer min-w-11 min-h-11 px-4 rounded-full flex items-center justify-center gap-2.5 transition-all duration-500 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
                style={{
                  background: on ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.4)",
                  borderColor: on ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.1)",
                  boxShadow: on ? "0 0 15px rgba(59,130,246,.35),0 0 30px rgba(99,102,241,.2)" : "none",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    background: on ? "#60a5fa" : "rgba(255,255,255,.25)",
                    boxShadow: on ? "0 0 8px #60a5fa,0 0 18px rgba(59,130,246,.7)" : "none",
                  }}
                />
                <span
                  className="hidden md:inline text-xs font-bold tracking-wider tabular-nums transition-colors duration-500"
                  style={{ color: on ? "#fff" : "rgba(255,255,255,.6)" }}
                >
                  {item.years}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next role"
          onClick={() => step(1)}
          className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:scale-105 hover:shadow-[0_0_15px_#3b82f6,0_0_30px_#8b5cf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExperienceCarousel;
