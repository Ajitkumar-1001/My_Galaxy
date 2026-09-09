import { Component, useEffect, useState, type ReactNode } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import Galaxy from "./Galaxy";

// If WebGL is unavailable, Galaxy throws inside its effect. Without this boundary
// the whole Splash island would unmount and `splash:done` would never fire.
class GalaxyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 1 } },
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

// One-time welcome overlay. The head script in Layout.astro adds `html.splash`
// on a first visit (before first paint); CSS shows the overlay only then.
// Galaxy (WebGL) mounts only for first-time visitors.
export default function Splash() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const control2 = useAnimation();
  const control3 = useAnimation();

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash")) {
      setDone(true);
      return;
    }
    setActive(true);
    let cancelled = false;
    (async () => {
      await wait(250);
      await control2.start("visible");
      await wait(250);
      await control3.start("visible");
      await wait(700);
      if (cancelled) return;
      sessionStorage.setItem("hasVisited", "true");
      html.classList.remove("splash");
      window.dispatchEvent(new Event("splash:done"));
      setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [control2, control3]);

  if (done) return null;

  return (
    <div id="splash" className="fixed inset-0 z-[100] overflow-hidden bg-black">
      {active && (
        <div className="absolute inset-0 w-full h-full z-1">
          <GalaxyBoundary>
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={false}
            density={2.5}
            glowIntensity={0.2}
            twinkleIntensity={1}
            autoCenterRepulsion={0.2}
            starSpeed={2}
            saturation={0.1}
            hueShift={50}
            speed={2}
          />
          </GalaxyBoundary>
        </div>
      )}

      <motion.div
        className="flex flex-col items-center justify-center min-h-screen relative z-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h1
          className="text-4xl subpixel-antialiased md:text-6xl text-border-2 font-sans text-white font-extrabold text-center"
          variants={item}
        >
          <span className="text-blue-400">Welcome</span> to{" "}
          <span className="text-blue-400">My Galaxy</span>
        </motion.h1>

        <motion.h5
          className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
          variants={item}
          initial="hidden"
          animate={control2}
        >
          A space to host my{" "}
          <span className="text-blue-300">Personal</span>{" "}
          <span className="text-white">/</span>{" "}
          <span className="text-blue-300">Professional</span> works.
        </motion.h5>

        <motion.h5
          className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
          variants={item}
          initial="hidden"
          animate={control3}
        >
          Let's Explore !!....
        </motion.h5>
      </motion.div>
    </div>
  );
}
