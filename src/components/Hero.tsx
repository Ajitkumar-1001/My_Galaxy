// src/components/Summa.tsx
import React from 'react';
import ProfileCard from './Profilecard.tsx';
import FuzzyText from './fuzzytext.tsx';  

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-16 md:px-20 bg-inherit"
    >
      {/* Left: Intro Text */}
      <div className="w-full md:w-1/2 animate-fade-in-up">
        <h1 className="text-4xl text-white sm:text-5xl font-extrabold leading-tight text-gray-900">
          Hi, I am 
          <h2><FuzzyText baseIntensity={0.2} hoverIntensity={0.6} enableHover={true}> Ajitkumar Senthil Kumarr </FuzzyText></h2>
        </h1>

        <p className="mt-6 text-lg text-white leading-relaxed tracking-wide">
          I'm a passionate <strong className="text-indigo-600">Engineering</strong> graduate student with a strong foundation in
          <strong className="text-indigo-600"> machine learning</strong>,
          <strong className="text-indigo-600"> deep learning</strong>, and
          <strong className="text-indigo-600"> data engineering</strong>.
          I’ve built end-to-end ML pipelines using modern MLOps tools like
          <strong className="text-indigo-600"> MLflow</strong>,
          <strong className="text-indigo-600"> Hopsworks</strong>, and
          <strong className="text-indigo-600"> GitHub Actions</strong>.
          I’ve explored fuzzy clustering in single-cell genomics and CNN-based attention architectures for image classification.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500 transition shadow-md"
          >
            View Projects
          </a>
          <a
            href="/Ajitkumar_Resume.pdf"
            target="_blank"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-100 transition"
          >
            Download Resume
          </a>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center animate-fade-in-up">
        <ProfileCard
          avatarUrl="src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG"
          miniAvatarUrl="src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG"
          name="Ajitkumar"
          title="Data Scientist / ML Engineer"
          handle="ajitkumar"
          status="Available"
          contactText="Hire Me"
          iconUrl="/icons/code-icon.svg"
          grainUrl="/grain-texture.png"
        />
      </div>
    </section>
  );
};

export default Hero;
