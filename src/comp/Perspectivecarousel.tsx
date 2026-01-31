import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, type LegacyAnimationControls } from "framer-motion";

type CarouselItem = {
  id: string;
  node: React.ReactNode;
};

type Props = {
  items: CarouselItem[];
  className?: string;
  height?: number;
  rotateSpeed?: number; // degrees per second
  play?: boolean; // start / stop rotation (inView)
  animateControls?: LegacyAnimationControls;
  initialState?: string;
  variants?: any;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PerspectiveCarousel({
  items,
  className = "",
  height = 520,
  rotateSpeed = 10,
  play = true,
  animateControls,
  initialState,
  variants,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [rotY, setRotY] = useState(0);
  const count = items.length;

  const geom = useMemo(() => {
    const w = containerRef.current?.clientWidth ?? 900;
    return {
      radius: clamp(w * 0.42, 200, 540),
      perspective: clamp(w * 1.35, 800, 1500),
      step: 360 / Math.max(1, count),
    };
  }, [count]);

  const [, forceRerender] = useState(0);
  useEffect(() => {
    const onResize = () => forceRerender((x) => x + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🔁 Auto rotation loop
  useEffect(() => {
    if (!play) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      setRotY((r) => r + rotateSpeed * dt);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = 0;
    };
  }, [play, rotateSpeed]);

  const ringStyle: React.CSSProperties = {
    height,
    perspective: `${geom.perspective}px`,
  };

  const sceneStyle: React.CSSProperties = {
    transformStyle: "preserve-3d",
    transform: `translateZ(${-geom.radius}px) rotateY(${rotY}deg)`,
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={ringStyle}
      variants={variants}
      initial={initialState as any}
      animate={animateControls as any}
    >
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-full h-full" style={sceneStyle}>
          {items.map((it, i) => {
            const angle = i * geom.step;

            const cardStyle: React.CSSProperties = {
              position: "absolute",
              left: "50%",
              top: "50%",
              transformStyle: "preserve-3d",
              transform: `rotateY(${angle}deg) translateZ(${geom.radius}px) translate(-50%, -50%)`,
            };

            return (
              <div key={it.id} style={cardStyle} className="will-change-transform">
                <div className="w-[300px] sm:w-[420px] md:w-[560px] rounded-2xl">
                  {it.node}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
