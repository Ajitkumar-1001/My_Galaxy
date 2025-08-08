// data/controls.ts
import { useAnimation } from "framer-motion";
import { useEffect } from "react";

export const useAnimateElement = () => {
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();

  useEffect(() => {
    const run = async () => {
      await control1.start("visible");
      await new Promise(r => setTimeout(r, 1000));
      await control2.start("visible");
      await new Promise(r => setTimeout(r, 500));
      await control3.start("visible");
    };
    run();
  }, [control1, control2, control3]);

  return { control1, control2, control3 };
};
