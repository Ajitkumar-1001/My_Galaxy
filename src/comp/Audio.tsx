import { useEffect, useRef, useState } from "react";

type Props = { src: string; loop?: boolean; className?: string };

export default function AutoPlayMusic({ src, loop = true, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); 

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    (async () => {

    //  await new Promise((r)=> setTimeout(r,1200)); 
      try {
   
        el.muted = false;
        el.volume = 1;
        
        await el.play();          
        setIsMuted(false);
      } catch {
      
        el.muted = true;
        el.volume = 0;
        try {
        //   await new Promise((r)=> setTimeout(r,1200)); 
          await el.play();
          setIsMuted(true);
        } catch {
         
          const unlock = () => {
            el.muted = false;
            el.volume = 1;
            new Promise((r)=> setTimeout(r,1200)); 
            el.play().catch(() => {});
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
            window.removeEventListener("touchstart", unlock);
          };
          window.addEventListener("pointerdown", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
          window.addEventListener("touchstart", unlock, { once: true });
        }
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
