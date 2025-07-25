import { motion } from "framer-motion";

const skills = {
  "Languages": ["Python", "R", "TypeScript", "SQL", "PostgreSQL"],
  "ML / AI": ["PyTorch", "HuggingFace", "MLflow", "Hopsworks","Scikit-learn","ollama","SnowFlake"],
  "Tools & Frameworks": ["React", "Tailwind CSS", "FastAPI", "Streamlit", "Docker", "AWS", "Git & GitHub","Github Actions(CI/CD)"],
};

const proficiency = { 
  "Advanced" : ["Python","SQL","Git & GitHub"],
  "Intermediate" : ["Typescript","R","PyTorch","React","FastAPI","Streamlit","Scikit-learn"]
};

const Proficiencycodes = { 
  "Advanced" : "green-950",
  "Intermediate" : "yellow-950"
};

const categoryColors = {
  "Languages": "from-blue-500 to-white-400",
  "ML / AI": "from-blue-400 to-gray-500",
  "Tools & Frameworks": "from-white-400 to-blue-500",
};

const Skills : React.FC=()=> {
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
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full z-20"
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
          <h3 key={category} className={`text-2xl font-bold bg-gradient-to-t ${categoryColors[category as keyof typeof categoryColors]} bg-clip-text text-transparent mb-4 text-center`}>
            {category}
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.map((skill) => (
              // <span key={skill} className="w-2 h-2 rounded-full bg-green text-start px-1 py-1 animate-pulse">

              // </span>
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 text-blue-300 transition duration-200 shadow-sm hover:shadow-md hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
</section>

  );
}

export default Skills;