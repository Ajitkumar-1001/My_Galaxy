// The intro's travel audio (previz SPEC.md "Pass 6"): one pre-mixed track, scripts/bake-intro-audio.sh,
// whose t = 0 is the launch cue. It starts with the journey the way Audio.tsx starts the music: unmuted
// if the browser allows, else muted so it stays in step with the picture, then unmuted by the first
// pointerdown, keydown or touchstart anywhere. A first visit with no interaction stays silent, like the music.
import { gsap } from "gsap";

/** Clock seconds of the track's t = 0 (sfx-launch at pace K = 0.85); re-bake the track if the cues move. */
export const AUDIO_START = 4.18;
/** Resync only past this drift: a hidden tab stalls the timeline, not the track. */
const MAX_DRIFT = 0.25;
const UNLOCK = ["pointerdown", "keydown", "touchstart"] as const;

export interface TravelAudio {
  /** at AUDIO_START: play from the clock's offset */
  start(t: number): void;
  /** every frame while the timeline plays: keep the track on the clock */
  sync(t: number): void;
  /** normal end: let the eclipse tail (to ~11.77 s) ring out past splash:done */
  release(): void;
  /** early exit: fade out and stop */
  stop(): void;
}

export function createTravelAudio(src: string): TravelAudio {
  const el = new Audio(src);
  el.preload = "auto";
  let started = false;
  let at = 0; // the track position the clock last asked for

  const removeUnlock = (): void => {
    for (const type of UNLOCK) window.removeEventListener(type, unlock);
  };
  function unlock(): void {
    removeUnlock();
    el.muted = false;
    if (el.paused) {
      el.currentTime = at;
      el.play().catch(() => {});
    }
  }

  return {
    start(t) {
      if (started) return;
      started = true;
      at = Math.max(0, t - AUDIO_START);
      el.currentTime = at;
      el.muted = false;
      el.play().catch(() => {
        // Unmuted autoplay was blocked: play muted (always allowed) to stay in step, unmute on a gesture.
        el.muted = true;
        el.play().catch(() => {});
        for (const type of UNLOCK) window.addEventListener(type, unlock);
      });
    },
    sync(t) {
      if (!started) return;
      at = t - AUDIO_START;
      if (!el.paused && !el.ended && Math.abs(el.currentTime - at) > MAX_DRIFT) el.currentTime = at;
    },
    release() {
      removeUnlock();
    },
    stop() {
      removeUnlock();
      if (!started) {
        el.removeAttribute("src"); // abort the preload
        el.load();
        return;
      }
      const v = { v: el.volume };
      gsap.to(v, { v: 0, duration: 0.2, ease: "power1.out", onUpdate: () => void (el.volume = v.v), onComplete: () => el.pause() });
    },
  };
}
