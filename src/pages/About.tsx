import React, { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const About: React.FC = () => {
  const secRef = useRef(null);
  const controls = useAnimation();
  const threshold: any = 0.3;
  const inView = useInView(secRef, threshold);

  const parentVariant: any = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    
  
  }), []);

  const childVariant: any = useMemo(() => ({
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    hover : {
      scale: 0.95,
      boxShadow: "0 0 15px #3b82f6, 0 0 30px #8b5cf6, 0 0 45px #a855f7",
      transition: { duration: 0.4, ease: 'easeOut' },
    },


  }), []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }

    
  }, [inView]);

  return (
    <section
      id="about"
      ref={secRef}
      className="min-h-screen flex flex-col justify-center bg-transparent py-10"
    >
      <h1 className="text-4xl font-extrabold font-sans mx-auto my-20 text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer">
        About
      </h1>

      <motion.div
        className="grid grid-cols-1 grid-flow-rows md:grid-cols-2 gap-10 px-10 md:px-20"
        variants={parentVariant}
        initial="hidden"
        animate={controls}
        
        
      >
       
        <motion.div
          className="relative w-full max-w-2xl mx-auto  bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] rounded-2xl shadow-5xl hover:shadow-3xl group"
          variants={childVariant}
          whileHover="hover"
        >
        <div className=" absolute inset-0 z-0 bg-gradient-to-tl from-white via-gray-500 to-indigo-900 rounded-[18px] brightness-200 opacity-100 "></div>
          <div className="relative z-10 bg-black/100 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">A Brief</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
              A passionate engineer driven by curiosity and a love for innovation. I explore the evolving world of AI, always seeking breakthroughs that shape the future. With a focus on emerging trends and tech's societal impact, I thrive on turning complex ideas into exciting possibilities.
            </p>
          </div>
         
        </motion.div>

        <motion.div
          className="relative w-full max-w-2xl mx-auto  bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] rounded-2xl shadow-5xl hover:shadow-3xl group"
          variants={childVariant}
          whileHover="hover"
          
        >
        <div className=" absolute inset-0 z-0 bg-gradient-to-tl from-white-200 via-blue-500 to-gray-900 rounded-[18px] brightness-200 opacity-100 "></div>
          <div className="relative z-10 bg-black/100 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">Passion</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
            Passion towards innovation and improvement, interested in exploring the world of agents in AI, ardent on building applications with seamless integrations of the latest technologies.
            </p>
          </div>
         
        </motion.div>

       
  
        <motion.div
          className="relative w-full max-w-2xl mx-auto  bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] brightness-150 rounded-2xl shadow-5xl"
          variants={childVariant}
          whileHover="hover"
        
        >
          <div className="absolute z-0 inset-0 bg-gradient-to-tl from-white-200 via-gray-700 to-blue-800 rounded-[18px] brightness-200 opacity-100 "></div>
          <div className="relative z-10 bg-black/100 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">Career Aspirations</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
              I'm deeply thrilled by the possibilities of Machine Learning and aspire to build models that solve real-world problems at scale to deployment—driving impact across industries. Eager to collaborate in teams where I can contribute to both experimentation and production-ready solutions.
            </p>
          </div>
        </motion.div>


        <motion.div
          className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] brightness-150  rounded-2xl shadow-5xl"
          variants={childVariant}
          whileHover="hover"
          
        >
          <div className="absolute z-0 inset-0 bg-gradient-to-tl from-white-200 via-gray-600 to-blue-800 rounded-[18px] brightness-200 opacity-100 "></div>
          <div className="bg-black/100 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">Education</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
              Pursuing a Master of Science in Data Science at the University at Buffalo, with a strong focus on machine learning, deep learning, and statistical modeling. Also holds a Bachelor's in Mechanical Engineering from Anna University (Sri Sai Ram Engineering College).
            </p>
          </div>
        </motion.div>

  
        <motion.div
          className="w-full max-w-2xl mx-auto  bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] brightness-150 rounded-2xl shadow-5xl"
          variants={childVariant}
          whileHover="hover"
        >
          <div className="bg-black/100 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">Coursework</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
              Through hands-on projects and advanced coursework, I’ve gained expertise in building scalable ML systems, analyzing large datasets, and applying AI techniques to real-world challenges.
            </p>
          </div>
        </motion.div>

  
        <motion.div
          className="w-full max-w-2xl mx-auto  bg-gradient-to-br from-gray-600 to-gray-300 p-[2px] brightness-150  rounded-2xl shadow-5xl"
          variants={childVariant}
          whileHover="hover"
        >
          <div className="bg-black/100 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">Current Work</h2>
            <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
              I'm currently exploring and working in reinforcement learning to further expand my knowledge in deep learning through reward-based learning—enabling machines to learn efficiently and adaptively.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
