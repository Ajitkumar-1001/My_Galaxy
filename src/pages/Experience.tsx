import React ,{useMemo} from "react";
import { experience_content } from "../data/data";
import { containerprops_fade, contentprops_fade } from "../data/animate";
import { useAnimateElement } from "../data/controls"; // make sure this name matches the actual export
import { motion } from "framer-motion";

const Experience: React.FC = () => {
  const { control1 } = useAnimateElement();
  const containerVariant = useMemo(()=>(containerprops_fade),[]);
  const contentVariant = useMemo(()=>(containerprops_fade),[]);

  return (
    <section
      id="experience"
      className="min-h-screen flex flex-col justify-center items-center bg-transparent p-15 mt-10"
    >
      <div className="w-full max-w-6xl mx-auto px-4 mt-10 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-xl md:text-4xl font-bold font-sans bg-gradient-to-tr from-blue-900 to-blue-300 bg-clip-text text-transparent">
            Experience
          </h1>
        </div>

        <div className="flex flex-col gap-6 space-y-5">
          {experience_content.map((exp) => (
            <motion.div
              key={exp.id}
              variants={containerVariant}
              initial="hidden"
              animate={control1}
              className="w-full rounded-2xl border-2 border-gray-500 shadow-3xl bg-transparent p-5"
            >
              <div className="flex flex-row items-start gap-4">
                <motion.div className="shrink-0" variants={contentVariant}>
                  <img
                    src={exp.logo}
                    alt={`${exp.company_name} logo`}
                    className="w-30 h-30 rounded-3xl object-contain shadow-3xl"
                  />
                </motion.div>

                <motion.div className="flex-1" variants={contentVariant}>
                  <h2 className="text-2xl font-sans text-center font-bold bg-gradient-to-br from-blue-950 to-sky-900 brightness-200 bg-clip-text text-transparent">
                    {exp.company_name}
                  </h2>

                  <div className="mt-1 font-sans text-center font-bold text-sm text-gray-300">
                    {exp.period_Start} — {exp.period_end}
                  </div>

                  <div className="mt-3">
                    <ul className="list-none space-y-1">
                      <li className="text-xl brightness-190 text-center font-sans font-bold bg-gradient-to-tr from-gray-500 to-white-500 bg-clip-text text-transparent">
                        {exp.role}
                      </li>
                    </ul>
                    <p className="mt-2 text-center text-base font-sans font-semibold bg-gradient-to-br from-gray-500 to-white bg-clip-text text-transparent brightness-150">
                      {exp.role_description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
