import React from "react";
// import ScrambledText from "./Scrambletext";
import DecryptedText from "./Decryptedtext";

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-transparent"
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-4xl w-full shadow-2xl text-white space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-500 mb-6">
          About Me
        </h2>

        <div className="text-2xl font-bold text-center text-indigo-500 text-white mb-6">
        <DecryptedText
        text=" I am a diverse engineering graduate with a Bachelor's degree in Mechanical Engineering and currently pursuing a Master of Science in New York, I bring a unique combination of mechanical foundation and analytical expertise in the realm of modern AI and data systems."
        speed={100}
        className = " revealed"
        maxIterations={20}
        characters="ABCD1234!?"
        animateOn="hover"
        revealDirection="center"
        parentClassName="all-letters"
        encryptedClassName="encrypted" ></DecryptedText>
          
        <DecryptedText
        text=" My journey has equipped me with the ability to bridge engineering logic with advanced machine learning applications. I have hands-on experience building end-to-end ML pipelines, developing deep learning models using PyTorch, and deploying them using modern MLOps tools like MLflow, Hopsworks, and GitHub Actions."
        speed={100}
        className = " revealed"
        maxIterations={20}
        characters="ABCD1234!?"
        animateOn="hover"
        revealDirection="center"
        parentClassName="all-letters"
        encryptedClassName="encrypted" ></DecryptedText>
          
        <DecryptedText
        text="Beyond academic work, I actively explore interdisciplinary projects, including fuzzy clustering in single-cell genomics and attention-based CNNs for image classification. I’m passionate about solving real-world problems by combining data-driven insights with scalable, production-grade engineering solutions."
        speed={100}
        className = " revealed"
        maxIterations={20}
        characters="ABCD1234!?"
        animateOn="view"

        revealDirection="center"
        parentClassName="all-letters"
        encryptedClassName="encrypted" ></DecryptedText>
          
       </div>
      </div>
    </section>
  );
};

export default About;
