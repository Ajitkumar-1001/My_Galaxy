import React from "react";

const skills = [
  "Python", "R", "JavaScript", "React", "Tailwind CSS",
  "Node.js", "Git & GitHub", "TensorFlow", "PyTorch",
  "MLflow", "Hopsworks", "SQL", "PostgreSQL", "Spark", "Docker", "AWS"
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen px-6 py-20 bg-inherit flex items-center justify-center text-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10 text-indigo-400">Skills</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full shadow-md hover:bg-indigo-200 transition duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
