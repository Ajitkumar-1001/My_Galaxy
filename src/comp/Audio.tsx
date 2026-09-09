import { useEffect, useRef, useState } from "react";

type Props = { src: string; loop?: boolean; className?: string };

export default function AutoPlayMusic({ src, loop = true, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); 

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    (async () => {
      try {
        el.muted = false;
        el.volume = 1;
        await el.play();
        setIsMuted(false);
        return;
      } catch {
        // Unmuted autoplay was blocked. Play muted (browsers always allow this)
        // and unmute on the very first user interaction anywhere on the page —
        // not just a click on the mute button, which the splash overlay covers
        // and makes unclickable for its whole duration.
        el.muted = true;
        el.volume = 0;
        el.play().catch(() => {});
        setIsMuted(true);

        const unlock = () => {
          el.muted = false;
          el.volume = 1;
          el.play().catch(() => {});
          setIsMuted(false);
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
        window.addEventListener("touchstart", unlock, { once: true });
      }
    })();
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;

    if (isMuted) {
      el.muted = false;
      fadeVolume(el, 1, 500);
      setIsMuted(false);
    } else {
      fadeVolume(el, 0, 250, () => { el.muted = true; });
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} autoPlay loop={loop} playsInline preload="auto" />
      <button
        onClick={toggle}
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        className={`fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border bg-black/100 backdrop-blur px-4 py-2 shadow hover:bg-white/50 active:scale-95 ${className ?? ""}`}
      >
        {isMuted ? "🔈 Unmute" : "🔇 Mute"}
      </button>
    </>
  );
}

function fadeVolume(
  el: HTMLMediaElement,
  target: number,
  ms: number,
  done?: () => void
) {
  const start = el.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    el.volume = start + (target - start) * k;
    if (k < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}
