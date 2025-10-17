// // import { motion } from "framer-motion";
// // import { FaReact, FaPython ,FaAws  } from "react-icons/fa";
// // import { SiPytorch, SiTypescript, SiR, SiTailwindcss , SiFastapi, SiScikitlearn, SiGit , SiGithub, SiGithubactions, SiMlflow
// //   ,SiSqlalchemy,SiPostgresql,SiHuggingface,SiDocker,SiStreamlit,SiOllama,SiSnowflake
// //  } from "react-icons/si";

// // const skills = {
// //   "Languages": ["Python", "R", "TypeScript", "SQL", "PostgreSQL"],
// //   "ML / AI": ["PyTorch", "HuggingFace", "MLflow", "Hopsworks","Scikit-learn","ollama","SnowFlake"],
// //   "Tools & Frameworks": ["React", "Tailwind CSS", "FastAPI", "Streamlit", "Docker", "AWS", "Git","GitHub","Github Actions(CI/CD)"],
// // };

// // const SkillIcons : any = { 
// //   "Languages" : [FaPython,SiR,SiTypescript,SiSqlalchemy,SiPostgresql],
// //   "ML / AI"    : [SiPytorch,SiPytorch,SiMlflow,SiMlflow,SiScikitlearn,SiOllama,SiSnowflake],
// //   "Tools & Frameworks" :[FaReact,SiTailwindcss,SiFastapi,SiStreamlit,SiDocker,FaAws,SiGit,SiGithub,SiGithubactions]
// // };

// // const proficiency = { 
// //   "Advanced" : ["Python","SQL","Git & GitHub"],
// //   "Intermediate" : ["Typescript","R","PyTorch","React","FastAPI","Streamlit","Scikit-learn"]
// // };

// // const Proficiencycodes = { 
// //   "Advanced" : "green-950",
// //   "Intermediate" : "yellow-950"
// // };

// // const categoryColors = {
// //   "Languages": "from-blue-500 to-white-400",
// //   "ML / AI": "from-blue-400 to-gray-500",
// //   "Tools & Frameworks": "from-white-400 to-blue-500",
// // };

// // const Skills : React.FC=()=> {
// //   return (
// //     <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-white">
// //   <motion.h2
// //     initial={{ opacity: 0, y: 30 }}
// //     whileInView={{ opacity: 1, y: 0 }}
// //     transition={{ duration: 0.7 }}
// //     className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
// //   >
// //     Skills
// //   </motion.h2>

// //   <motion.div
// //     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full z-20"
// //     initial={{ opacity: 0, y: 30 }}
// //     whileInView={{ opacity: 1, y: 0 }}
// //     transition={{ duration: 1.3 }}
// //   >
// //     {Object.entries(skills).map(([category, items], i) => (
// //       <motion.div
// //         key={category}
// //         initial={{ opacity: 0, scale: 0.9 }}
// //         whileInView={{ opacity: 1, scale: 1 }}
// //         transition={{ delay: i * 0.2, duration: 1 }}
// //         viewport={{ once: true }}
// //         className={`rounded-2xl p-[2px] bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} shadow-xl`}
// //       >
// //         <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl h-full">
// //           <h3 key={category} className={`text-2xl brightness-120  font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent mb-4 text-center`}>
// //             {category}
// //           </h3>
// //           <div className="flex flex-wrap gap-3 justify-center">
// //             <div className="flex flex-col items-center gap-2">
// //               {Object.entries(SkillIcons).map(([cat,ite],i)=>(
// //                 <div key={cat} className="flex items-center">
// //                     {ite.map(item)=>(
// //                       <h1 className="w-6 h-6 text-white">
// //                         {item}
// //                       </h1>
// //                     )}
// //                   </div>
// //               ))}

// //             {items.map((skill) => (
// //               // <span key={skill} className="w-2 h-2 rounded-full bg-green text-start px-1 py-1 animate-pulse">

// //               // </span>
// //               <span
// //                 key={skill}
// //                 className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 text-blue-300 transition duration-200 shadow-sm hover:shadow-md hover:scale-105"
// //               >
// //                 {skill}
// //               </span>
// //             ))}
// //             </div>
// //           </div>
// //         </div>
// //       </motion.div>
// //     ))}
// //   </motion.div>
// // </section>

// //   );
// // }

// // export default Skills;







// import { motion } from "framer-motion";
// import { FaReact, FaPython, FaAws } from "react-icons/fa";
// import {
//   SiPytorch,
//   SiTypescript,
//   SiR,
//   SiTailwindcss,
//   SiFastapi,
//   SiScikitlearn,
//   SiGit,
//   SiGithub,
//   SiGithubactions,
//   SiMlflow,
//   SiSqlalchemy,
//   SiPostgresql,
//   SiHuggingface,
//   SiDocker,
//   SiStreamlit,
//   SiOllama,
//   SiSnowflake,
// } from "react-icons/si";
// import { OrbitingCircles } from "../components/ui/orbiting-circles";

// // Map each skill STRING to a react-icon component
// // const skillIconMap: Record<string, IconType> = {
// //   // Languages
// //   Python: FaPython,
// //   R: SiR,
// //   TypeScript: SiTypescript,
// //   SQL: SiSqlalchemy,        
// //   PostgreSQL: SiPostgresql,

// //   // ML / AI
// //   PyTorch: SiPytorch,
// //   HuggingFace: SiHuggingface,
// //   MLflow: SiMlflow,
// //   Hopsworks: SiMlflow,      
// //   "Scikit-learn": SiScikitlearn,
// //   ollama: SiOllama,
// //   SnowFlake: SiSnowflake,

// //   // Tools & Frameworks
// //   React: FaReact,
// //   "Tailwind CSS": SiTailwindcss,
// //   FastAPI: SiFastapi,
// //   Streamlit: SiStreamlit,
// //   Docker: SiDocker,
// //   AWS: FaAws,
// //   Git: SiGit,
// //   GitHub: SiGithub,
// //   "Github Actions": SiGithubactions,
// // };

// // Organize skills by category with icons
// const skillCategories = {
//   Languages: [
//     { name: "Python", icon: FaPython },
//     { name: "R", icon: SiR },
//     { name: "TypeScript", icon: SiTypescript },
//     { name: "SQL", icon: SiSqlalchemy },
//     { name: "PostgreSQL", icon: SiPostgresql },
//   ],
//   "ML / AI": [
//     { name: "PyTorch", icon: SiPytorch },
//     { name: "HuggingFace", icon: SiHuggingface },
//     { name: "MLflow", icon: SiMlflow },
//     { name: "Hopsworks", icon: SiMlflow },
//     { name: "Scikit-learn", icon: SiScikitlearn },
//     { name: "Ollama", icon: SiOllama },
//     { name: "SnowFlake", icon: SiSnowflake },
//   ],
//   "Tools & Frameworks": [
//     { name: "React", icon: FaReact },
//     { name: "Tailwind CSS", icon: SiTailwindcss },
//     { name: "FastAPI", icon: SiFastapi },
//     { name: "Streamlit", icon: SiStreamlit },
//     { name: "Docker", icon: SiDocker },
//     { name: "AWS", icon: FaAws },
//     { name: "Git", icon: SiGit },
//     { name: "GitHub", icon: SiGithub },
//     { name: "Github Actions", icon: SiGithubactions },
//   ],
// } as const;

// const categoryColors = {
//   Languages: "from-blue-500 to-transparent",
//   "ML / AI": "from-blue-900 to-blue-500",
//   "Tools & Frameworks": "from-transparent to-blue-500",
// } as const;

// const Skills: React.FC = () => {
//   return (
//     <section id="skills" className="min-h-screen flex flex-col items-center justify-center py-16 text-white">
//       <motion.h2
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         className="text-4xl font-bold mb-16 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
//       >
//         Skills
//       </motion.h2>

//       <motion.div
//         className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20 max-w-7xl w-full z-20 px-6"
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1.3 }}
//       >
//         {Object.entries(skillCategories).map(([category, skills], i) => (
//           <motion.div
//             key={category}
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ delay: i * 0.3, duration: 1 }}
//             viewport={{ once: true }}
//             className="flex flex-col items-center space-y-8"
//           >
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.3 + 0.2, duration: 0.8 }}
//               className={`text-2xl md:text-3xl font-bold bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent text-center`}
//             >
//               {category}
//             </motion.h3>
            
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ delay: i * 0.3 + 0.4, duration: 1.2, type: "spring", stiffness: 80 }}
//               className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center"
//             >
//               {/* Central icon or logo for the category */}
//               <div className={`absolute inset-0 flex items-center justify-center z-10`}>
//                 <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} opacity-20 blur-sm`} />
//                 <div className="absolute w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white/80">{category.charAt(0)}</span>
//                 </div>
//               </div>
              
//               {/* Orbiting skill icons */}
//               <OrbitingCircles
//                 className="border-none bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
//                 duration={20 + i * 5}
//                 radius={120 + i * 10}
//                 iconSize={48}
//                 reverse={i % 2 === 1}
//                 path={true}
//               >
//                 {skills.map((skill) => {
//                   const IconComponent = skill.icon;
//                   return (
//                     <div
//                       key={skill.name}
//                       className="group relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 hover:border-white/50 transition-all duration-300"
//                       title={skill.name}
//                     >
//                       <IconComponent className="text-white text-xl group-hover:text-blue-300 transition-colors duration-300" />
                      
//                       {/* Tooltip */}
//                       <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                         <span className="text-xs text-white bg-black/60 px-2 py-1 rounded whitespace-nowrap">
//                           {skill.name}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </OrbitingCircles>
              
//               {/* Second orbit for larger categories */}
//               {skills.length > 3 && (
//                 <OrbitingCircles
//                   className="border-none bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
//                   duration={25 + i * 5}
//                   radius={160 + i * 15}
//                   iconSize={40}
//                   reverse={i % 2 === 0}
//                   path={true}
//                 >
//                   {skills.slice(3).map((skill) => {
//                     const IconComponent = skill.icon;
//                     return (
//                       <div
//                         key={skill.name}
//                         className="group relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/20 hover:border-white/40 transition-all duration-300"
//                         title={skill.name}
//                       >
//                         <IconComponent className="text-white text-lg group-hover:text-blue-300 transition-colors duration-300" />
                        
//                         {/* Tooltip */}
//                         <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                           <span className="text-xs text-white bg-black/60 px-2 py-1 rounded whitespace-nowrap">
//                             {skill.name}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </OrbitingCircles>
//               )}
              
//               {/* Category backdrop glow */}
//               <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} opacity-5 blur-3xl -z-10`} />
//             </motion.div>
//           </motion.div>
//         ))}
//       </motion.div>
      
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-600/10 to-transparent rounded-full blur-3xl" />
//       </div>
//     </section>
//   );
// };

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
import { OrbitingCircles } from "../components/ui/orbiting-circles";
import useMobile from "../hooks/useMobile";

// Organize skills by category with icons
const skillCategories = {
  Languages: [
    { name: "Python", icon: FaPython },
    { name: "R", icon: SiR },
    { name: "TypeScript", icon: SiTypescript },
    { name: "SQL", icon: SiSqlalchemy },
    { name: "PostgreSQL", icon: SiPostgresql },
  ],
  "ML / AI": [
    { name: "PyTorch", icon: SiPytorch },
    { name: "HuggingFace", icon: SiHuggingface },
    { name: "MLflow", icon: SiMlflow },
    { name: "Hopsworks", icon: SiMlflow },
    { name: "Scikit-learn", icon: SiScikitlearn },
    { name: "Ollama", icon: SiOllama },
    { name: "SnowFlake", icon: SiSnowflake },
  ],
  "Tools & Frameworks": [
    { name: "React", icon: FaReact },
    { name: "Tailwind CSS", icon: SiTailwindcss },
    { name: "FastAPI", icon: SiFastapi },
    { name: "Streamlit", icon: SiStreamlit },
    { name: "Docker", icon: SiDocker },
    { name: "AWS", icon: FaAws },
    { name: "Git", icon: SiGit },
    { name: "GitHub", icon: SiGithub },
    { name: "Github Actions", icon: SiGithubactions },
  ],
} as const;

const categoryColors = {
  "Languages": "from-blue-500 to-white-400",
  "ML / AI": "from-blue-400 to-gray-500",
  "Tools & Frameworks": "from-white-400 to-blue-500",
};

const Skills: React.FC = () => {
  const isMobile = useMobile(1024); // Use 1024px as breakpoint for lg screens

  return (
    <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-16 mt-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold mt-12 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
      >
        Skills
      </motion.h2>

      {/* Desktop Version - Keep this exactly as is */}
      {!isMobile && (
        <motion.div
          className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-12 max-w-none w-full z-20 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
          {Object.entries(skillCategories).map(([category, skills], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-8 px-4 py-8"
            >
              <h3 className={`text-3xl font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent text-center`}>
                {category}
              </h3>
              
              <div className="relative flex h-[420px] w-[420px] items-center justify-center overflow-visible">
                {/* Center circle with category description */}
                <div className="absolute z-20 flex items-center justify-center ">
                  {i === 0 && <span className="text-sm font-bold bg-gradient-to-t from-gray-200 to-white bg-clip-text text-center text-transparent px-2">Programming Languages i use</span>}
                  {i === 1 && <span className="text-sm font-bold bg-gradient-to-t from-gray-400 to-white bg-clip-text text-transparent text-center px-2">ML/AI Libraries</span>}
                  {i === 2 && <span className="text-sm font-bold bg-gradient-to-t from-gray-400 to-white bg-clip-text text-transparent text-center px-2">Tools & Frameworks</span>}
                </div>
                
                {/* Orbiting skill icons - Inner ring */}
                <OrbitingCircles radius={110} duration={35} path={true}>
                  {skills.slice(0, skills.length > 4 ? 4 : skills.length).map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="relative flex  items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                        title={skill.name}
                      >
                        <IconComponent className="h-14 w-14 text-blue-200 group-hover:text-white transition-colors duration-200" />
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800/90 backdrop-blur text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-blue-400/20">
                          {skill.name}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    );
                  })}
                </OrbitingCircles>
                
                {/* Outer ring for remaining skills */}
                {skills.length > 4 && (
                  <OrbitingCircles radius={190} duration={45} reverse path={true}>
                    {skills.slice(4).map((skill) => {
                      const IconComponent = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className="relative flex items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                          title={skill.name}
                        >
                         <IconComponent className="h-14 w-14 text-blue-200 group-hover:text-white transition-colors duration-200" />
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800/90 backdrop-blur text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-blue-400/20">
                            {skill.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      );
                    })}
                  </OrbitingCircles>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mobile Version - Smaller, contained orbits */}
      {isMobile && (
        <motion.div
          className="grid grid-cols-1 gap-12 max-w-sm w-full z-20 py-15"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
          {Object.entries(skillCategories).map(([category, skills], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-10"
            >
              <h3 className={`text-2xl font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent text-center`}>
                {category}
              </h3>
              
              <div className="relative w-72 h-72 flex items-center justify-center ">
                {/* Center circle */}
                <div className="absolute z-40 flex  items-center justify-center">
                <div className="absolute z-20 flex items-center justify-center ">
                  {i === 0 && <span className="text-sm font-bold bg-gradient-to-t from-gray-200 to-white bg-clip-text text-center text-transparent px-2"> Languages I use</span>}
                  {i === 1 && <span className="text-sm font-bold bg-gradient-to-t from-gray-400 to-white bg-clip-text text-transparent text-center px-2">  Libraries I  use </span>}
                  {i === 2 && <span className="text-sm font-bold bg-gradient-to-t from-gray-400 to-white bg-clip-text text-transparent text-center px-2"> Tools I use</span>}
                </div>
                </div>
                
                {/* Inner orbit */}
                <OrbitingCircles radius={90} duration={30} path={true} iconSize={36}>
                  {skills.slice(0, Math.min(4, skills.length)).map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="relative flex h-full w-full items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                        title={skill.name}
                      >
                        <IconComponent className="h-12 w-12 text-blue-300 transition-colors duration-200" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-xs text-white/80 bg-black/60 px-2 py-1 rounded whitespace-nowrap">
                            {skill.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </OrbitingCircles>
                
                {/* Outer orbit */}
                {skills.length > 4 && (
                  <OrbitingCircles radius={150} duration={45} reverse path={true} iconSize={32}>
                    {skills.slice(4).map((skill) => {
                      const IconComponent = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className="relative flex h-full w-full items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                          title={skill.name}
                        >
                          <IconComponent className="h-10 w-10 text-blue-400/70 transition-colors duration-200" />
                          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-xs text-white/80 bg-black/60 px-2 py-1 rounded whitespace-nowrap">
                              {skill.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </OrbitingCircles>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Skills;