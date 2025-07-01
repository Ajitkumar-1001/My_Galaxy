import React from "react";
import SpotlightCard from "./Spotlightcard";

const projects = [
  {
    title: "CitiBike Ride Duration Prediction",
    description:
      "Built an end-to-end ML pipeline using real-time Citi Bike data with preprocessing in Hopsworks, tracked via MLflow, and deployed on Streamlit.",
    tech: ["Python", "MLflow", "Hopsworks", "Streamlit"],
    link: "https://github.com/yourusername/citibike-ml"
  },
  {
    title: "Skin Cancer Detection with CNN",
    description:
      "Developed a CNN-based image classifier for identifying melanoma using the MIDAS dataset. Achieved 90%+ accuracy with SE blocks and LR scheduler.",
    tech: ["PyTorch", "CNN", "SE Blocks", "Data Augmentation"],
    link: "https://github.com/yourusername/skin-cancer-cnn"
  },
  {
    title: "Portfolio Website (This Site)",
    description:
      "Responsive and animated portfolio built with React, Tailwind CSS, and TypeScript. Features section-based routing and smooth transitions.",
    tech: ["React", "Tailwind", "TypeScript"],
    link: "https://github.com/yourusername/portfolio"
  }
];

const Projects: React.FC = () => {
  return (
    <section
      id="projects"
      className="min-h-screen py-20 bg-inherit flex flex-col items-center justify-center text-white"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-indigo-400 mb-12">Projects</h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <SpotlightCard
              key={index}
              className="h-full"
              maxTilt={50}
              spotlightColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="h-full bg-[#312E81] rounded-xl shadow-lg p-6 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-indigo-300 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-200 text-indigo-800 text-xs px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline text-sm"
                >
                  View on GitHub →
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
