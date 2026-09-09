import React from "react";
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
  SiNextdotjs,
} from "react-icons/si";
import { OrbitingCircles } from "../components/ui/orbiting-circles";

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
    { name: "Next.js", icon: SiNextdotjs },
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

// Rendered to static HTML at build time (no client directive). Both the desktop
// and mobile layouts are emitted and switched with Tailwind's `lg:` breakpoint;
// orbit motion is pure CSS (--animate-orbit in global.css) and tooltips are group-hover.
const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-16 mt-10">
      <h2 className="reveal text-4xl font-bold mt-12 text-blue-400">
        Skills
      </h2>

      {/* Desktop Version (>= lg) */}
      <div className="reveal hidden lg:flex lg:flex-row justify-center items-center gap-12 lg:gap-12 max-w-none w-full z-20 py-16">
        {Object.entries(skillCategories).map(([category, skills], i) => (
          <div
            key={category}
            className="reveal flex flex-col items-center space-y-8 px-4 py-8"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="relative flex h-[420px] w-[420px] items-center justify-center overflow-visible">
              {/* Center circle with category description */}
              <div className="absolute z-20 flex items-center justify-center ">
                {i === 0 && <span className="text-sm font-bold text-gray-200 text-center px-2">Programming Languages i use</span>}
                {i === 1 && <span className="text-sm font-bold text-gray-200 text-center px-2">ML/AI Libraries</span>}
                {i === 2 && <span className="text-sm font-bold text-gray-200 text-center px-2">Tools & Frameworks</span>}
              </div>

              {/* Orbiting skill icons - Inner ring */}
              <OrbitingCircles radius={140} duration={35} path={true}>
                {skills.slice(0, skills.length > 3 ? 4 : skills.length).map((skill) => {
                  const IconComponent = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="relative flex  items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                      title={skill.name}
                    >
                      <IconComponent className="h-10 w-10 text-blue-200 group-hover:text-white transition-colors duration-200" />
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
                <OrbitingCircles radius={220} duration={100} reverse path={true}>
                  {skills.slice(4).map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="relative flex items-center justify-center  hover:scale-110 transition-all duration-200 group shadow-md"
                        title={skill.name}
                      >
                       <IconComponent className="h-12 w-12 text-blue-200 group-hover:text-white transition-colors duration-200" />
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
          </div>
        ))}
      </div>

      {/* Mobile Version (< lg) - Smaller, contained orbits */}
      <div className="reveal grid grid-cols-1 gap-12 max-w-sm w-full z-20 py-15 lg:hidden">
        {Object.entries(skillCategories).map(([category, skills], i) => (
          <div
            key={category}
            className="reveal flex flex-col items-center space-y-10"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="relative w-72 h-72 flex items-center justify-center ">
              {/* Center circle */}
              <div className="absolute z-40 flex  items-center justify-center">
              <div className="absolute z-20 flex items-center justify-center ">
                {i === 0 && <span className="text-sm font-bold text-gray-200 text-center px-2"> Languages I use</span>}
                {i === 1 && <span className="text-sm font-bold text-gray-200 text-center px-2">  Libraries I  use </span>}
                {i === 2 && <span className="text-sm font-bold text-gray-200 text-center px-2"> Tools I use</span>}
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
