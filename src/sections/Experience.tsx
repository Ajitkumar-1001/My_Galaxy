import React from "react";
import { experience_content } from "../data/data";
import ExperienceCarousel from "../comp/ExperienceCarousel";

// Client island (see index.astro) — ExperienceCarousel needs pointer/resize/
// intersection APIs. The heading keeps the site's plain `reveal` entrance;
// the carousel handles its own entrance once it scrolls into view.
const Experience: React.FC = () => {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center items-center bg-transparent py-24 w-full relative z-10 overflow-hidden">

      {/* Ambient background glow to fit the Galaxy theme */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[800px] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>

      <div className="text-center mb-24 relative z-20">
        <h1 className="reveal text-2xl md:text-3xl font-extrabold font-sans text-blue-400 drop-shadow-lg">
          Experience
        </h1>
      </div>

      <ExperienceCarousel items={experience_content} />
    </section>
  );
};

export default Experience;
