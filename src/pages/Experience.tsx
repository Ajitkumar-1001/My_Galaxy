import React ,{useMemo, useEffect,useRef} from "react";
import { experience_content } from "../data/data";
import { containerprops_fade, Containerhide, contentprops_fade, motionVariant,contentMotionVariant } from "../data/animate";
import { useAnimateElement } from "../data/controls"; 
import { motion , useInView} from "framer-motion";

const Experience: React.FC = () => {
  const { control1,control2 } = useAnimateElement();
  const containerVariant = useMemo(()=>(containerprops_fade),[]);
  const contentVariant = useMemo(()=>(contentprops_fade),[]);
  const motionContainr = useMemo(()=>(motionVariant),[]);
  const motionContent = useMemo(()=>(contentMotionVariant),[]); 
  const hideContainer = useMemo(()=> (Containerhide),[]);
  const sectionref = useRef(null); 
  const threshold:any = 0.3; 
  const inView = useInView(sectionref,threshold); 


  useEffect(()=> { 

    if(inView){ 
        control1.start("visible");
        control2.start("visible");
    }
    else{
        control1.start("hidden");
        control2.start("hidden");
    };

  },[inView]);

  return (
    <section
      ref = { sectionref}
      id="experience"
      className="min-h-screen flex flex-col justify-center items-center bg-transparent p-15 mt-10"
    >
      <motion.div className="w-full max-w-6xl mx-auto px-4 mt-10 sm:px-6 lg:px-8" variants={hideContainer} initial="hidden" animate={control1}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-sans bg-gradient-to-tr from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Experience
          </h1>
        </div>

        <motion.div className="flex flex-col gap-6 space-y-5" variants ={containerVariant}>
          {experience_content.map((exp) => (
            <motion.div
              key={exp.id}
              variants={motionContainr}
              initial="hidden"
              animate={control1}
              className="w-full flex flex-col rounded-2xl border-2 border-gray-500 shadow-3xl bg-transparent p-5"
            >
              <div className="flex flex-col md:flex-row sm:items-center sm:justify-center md:items-start gap-4">
                <motion.div className="shrink-0" variants={containerVariant}>
                  <motion.img variants={contentVariant}
                    src={exp.logo}
                    alt={`${exp.company_name} logo`}
                    className="w-30 h-30 rounded-3xl object-contain shadow-3xl"
                  />
                </motion.div>

                <motion.div className="flex-1 " variants={motionContainr}>
                  <motion.h2 className="text-2xl font-sans text-center font-bold bg-gradient-to-br from-blue-950 to-sky-900 brightness-200 bg-clip-text text-transparent" variants={motionContent}>
                    {exp.company_name}
                  </motion.h2>

                  <motion.div className="mt-1 font-sans text-center font-bold text-sm text-gray-300" variants={motionContainr}>
                    {exp.period_Start} — {exp.period_end}
                  </motion.div>

                  <motion.div className="mt-3" variants={motionContainr}>
                    <ul className="list-none space-y-1">
                      <motion.li className="text-xl brightness-190 text-center font-sans font-bold bg-gradient-to-tr from-blue-500 via-white-500 to-blue-900 bg-clip-text text-transparent" variants={motionContent}>
                        {exp.role}
                      </motion.li>
                    </ul>
                    <motion.p className="mt-2 text-center text-base font-sans font-semibold bg-gradient-to-br from-gray-500 to-white bg-clip-text text-transparent brightness-150" variants={motionContent}>
                      {exp.role_description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;
