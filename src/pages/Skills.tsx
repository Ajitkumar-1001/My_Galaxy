// import { motion } from "framer-motion";
// import { FaReact, FaPython ,FaAws  } from "react-icons/fa";
// import { SiPytorch, SiTypescript, SiR, SiTailwindcss , SiFastapi, SiScikitlearn, SiGit , SiGithub, SiGithubactions, SiMlflow
//   ,SiSqlalchemy,SiPostgresql,SiHuggingface,SiDocker,SiStreamlit,SiOllama,SiSnowflake
//  } from "react-icons/si";

// const skills = {
//   "Languages": ["Python", "R", "TypeScript", "SQL", "PostgreSQL"],
//   "ML / AI": ["PyTorch", "HuggingFace", "MLflow", "Hopsworks","Scikit-learn","ollama","SnowFlake"],
//   "Tools & Frameworks": ["React", "Tailwind CSS", "FastAPI", "Streamlit", "Docker", "AWS", "Git","GitHub","Github Actions(CI/CD)"],
// };

// const SkillIcons : any = { 
//   "Languages" : [FaPython,SiR,SiTypescript,SiSqlalchemy,SiPostgresql],
//   "ML / AI"    : [SiPytorch,SiPytorch,SiMlflow,SiMlflow,SiScikitlearn,SiOllama,SiSnowflake],
//   "Tools & Frameworks" :[FaReact,SiTailwindcss,SiFastapi,SiStreamlit,SiDocker,FaAws,SiGit,SiGithub,SiGithubactions]
// };

// const proficiency = { 
//   "Advanced" : ["Python","SQL","Git & GitHub"],
//   "Intermediate" : ["Typescript","R","PyTorch","React","FastAPI","Streamlit","Scikit-learn"]
// };

// const Proficiencycodes = { 
//   "Advanced" : "green-950",
//   "Intermediate" : "yellow-950"
// };

// const categoryColors = {
//   "Languages": "from-blue-500 to-white-400",
//   "ML / AI": "from-blue-400 to-gray-500",
//   "Tools & Frameworks": "from-white-400 to-blue-500",
// };

// const Skills : React.FC=()=> {
//   return (
//     <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-white">
//   <motion.h2
//     initial={{ opacity: 0, y: 30 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.7 }}
//     className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
//   >
//     Skills
//   </motion.h2>

//   <motion.div
//     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full z-20"
//     initial={{ opacity: 0, y: 30 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 1.3 }}
//   >
//     {Object.entries(skills).map(([category, items], i) => (
//       <motion.div
//         key={category}
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         transition={{ delay: i * 0.2, duration: 1 }}
//         viewport={{ once: true }}
//         className={`rounded-2xl p-[2px] bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} shadow-xl`}
//       >
//         <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl h-full">
//           <h3 key={category} className={`text-2xl brightness-120  font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent mb-4 text-center`}>
//             {category}
//           </h3>
//           <div className="flex flex-wrap gap-3 justify-center">
//             <div className="flex flex-col items-center gap-2">
//               {Object.entries(SkillIcons).map(([cat,ite],i)=>(
//                 <div key={cat} className="flex items-center">
//                     {ite.map(item)=>(
//                       <h1 className="w-6 h-6 text-white">
//                         {item}
//                       </h1>
//                     )}
//                   </div>
//               ))}

//             {items.map((skill) => (
//               // <span key={skill} className="w-2 h-2 rounded-full bg-green text-start px-1 py-1 animate-pulse">

//               // </span>
//               <span
//                 key={skill}
//                 className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 text-blue-300 transition duration-200 shadow-sm hover:shadow-md hover:scale-105"
//               >
//                 {skill}
//               </span>
//             ))}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     ))}
//   </motion.div>
// </section>

//   );
// }

// export default Skills;







import { motion } from "framer-motion";
import { FaReact, FaPython, FaAws } from "react-icons/fa";
import {
  SiPytorch,
  SiTypescript,
  SiR,
  SiTailwindcss,
  SiFastapi,
  SiScikitlearn,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiMlflow,
  SiSqlalchemy,
  SiPostgresql,
  SiHuggingface,
  SiDocker,
  SiStreamlit,
  SiOllama,
  SiSnowflake,
} from "react-icons/si";
import type { IconType } from "react-icons";

const skills = {
  Languages: ["Python", "R", "TypeScript", "SQL", "PostgreSQL"],
  "ML / AI": ["PyTorch", "HuggingFace", "MLflow", "Hopsworks", "Scikit-learn", "ollama", "SnowFlake"],
  "Tools & Frameworks": ["React", "Tailwind CSS", "FastAPI", "Streamlit", "Docker", "AWS", "Git", "GitHub", "Github Actions"],
} as const;

// Map each skill STRING to a react-icon component
const skillIconMap: Record<string, IconType> = {
  // Languages
  Python: FaPython,
  R: SiR,
  TypeScript: SiTypescript,
  SQL: SiSqlalchemy,        
  PostgreSQL: SiPostgresql,

  // ML / AI
  PyTorch: SiPytorch,
  HuggingFace: SiHuggingface,
  MLflow: SiMlflow,
  Hopsworks: SiMlflow,      
  "Scikit-learn": SiScikitlearn,
  ollama: SiOllama,
  SnowFlake: SiSnowflake,

  // Tools & Frameworks
  React: FaReact,
  "Tailwind CSS": SiTailwindcss,
  FastAPI: SiFastapi,
  Streamlit: SiStreamlit,
  Docker: SiDocker,
  AWS: FaAws,
  Git: SiGit,
  GitHub: SiGithub,
  "Github Actions": SiGithubactions,
};

const categoryColors = {
  Languages: "from-blue-500 to-transparent",
  "ML / AI": "from-blue-900 to-blue-500",
  "Tools & Frameworks": "from-transparent to-blue-500",
} as const;

const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-white">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
      >
        Skills
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl w-full z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
      >
        {Object.entries(skills).map(([category, items], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 1 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-[2px] bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} shadow-xl`}
          >
            <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl h-full">
              <h3
                className={`text-3xl brightness-120 font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent mb-4 text-center`}
              >
                {category}
              </h3>

            
              <div className="flex flex-wrap gap-3 justify-center">
              <div className="grid grid-cols-3 md:grid-cols-3 items-center p-2 space-y-3">
                {items.map((skill) => {
                  const Icon = skillIconMap[skill]; 
                  return (
                    <div className="flex flex-col items-center mx-auto p-2 max-w-xl h-16 w-full">
                    <span
                      key={skill}
                      className="max-w-xl w-full inline-flex flex-col leading-relaxed  mx-auto items-center  px-3 py-1 rounded-2xl text-md  bg-transparent hover:bg-sky-900/90 text-blue-300 transition duration-200 shadow-sm hover:shadow-md hover:scale-120"
                    >
                      <Icon className="w-9 h-6 gap-3 " />
                      {skill}
                    </span>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;

