import React, {  useEffect, useMemo, useRef } from "react";
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
    hidden: { opacity: 0, y: 40, scale: 0.8},
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,  
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 0 15px #3b82f6, 0 0 30px #8b5cf6, 0 0 45px #a855f7",
      transition: { duration: 0.4, ease: "easeOut" }
    },
    rest : { 
      scale : 1,
      boxshadow : "0 0 0 #ffffff",
      transition : {duration : 0.4 , ease: "easeInOut"}

    },

    
  }), []);

  // const handleHover = useCallback(()=>{
  //   controls.start("hover");
  // },[controls])

  // const handleMover = useCallback(()=>{
  //   controls.start("rest");
  // },[controls])


  useEffect(() => {
    if (inView) {controls.start("visible");
      controls.start("hover");
      // controls.stop("rest"); 
    }
    else {controls.start("hidden");
      controls.start("rest");
      // controls.stop("hover");

    }
  }, [inView]);

  const cards = [
    {
      title: "A Brief",
      text: `A passionate engineer driven by curiosity and a love for innovation. I explore the evolving world of AI, always seeking breakthroughs that shape the future. With a focus on emerging trends and tech's societal impact, I thrive on turning complex ideas into exciting possibilities.`,
      gradient: "from-white via-gray-500 to-indigo-900",
    },
    {
      title: "Passion",
      text: `Passion towards innovation and improvement, interested in exploring the world of agents in AI, ardent on building applications with seamless integrations of the latest technologies.`,
      gradient: "from-white-200 via-blue-500 to-gray-900",
    },
    {
      title: "Career Aspirations",
      text: `I'm deeply thrilled by the possibilities of Machine Learning and aspire to build models that solve real-world problems at scale to deployment—driving impact across industries. Eager to collaborate in teams where I can contribute to both experimentation and production-ready solutions.`,
      gradient: "from-white via-gray-700 to-blue-800",
    },
    {
      title: "Education",
      text: `Pursuing a Master of Science  at the University at Buffalo, with a strong focus on machine learning, deep learning, and statistical modeling. Also holds a Bachelor's in Mechanical Engineering from Anna University (Sri Sai Ram Engineering College).`,
      gradient: "from-white-200 via-gray-600 to-blue-800",
    },
    {
      title: "Coursework",
      text: `Through hands-on projects and advanced coursework, I have gained expertise in building scalable ML systems, analyzing large datasets, and applying AI techniques to real-world challenges.`,
      gradient: "from-white via-gray-500 to-indigo-900",
    },
    {
      title: "Current Work",
      text: `I'm currently exploring and working in reinforcement learning to further expand my knowledge in deep learning through reward-based learning—enabling machines to learn efficiently and adaptively.`,
      gradient: "from-white via-gray-500 to-indigo-900",
    },
  ];

  return (
    <section id="about" ref={secRef} className="min-h-screen flex flex-col justify-center bg-transparent py-10">
      <h1 className="text-4xl font-extrabold font-sans mx-auto my-20 text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer">
        About
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 md:px-20"
        variants={parentVariant as any}
        initial="hidden"
        animate={controls}
      
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="relative w-full max-w-2xl mx-auto p-[2px] rounded-2xl"
            variants={childVariant}
            initial= "hidden"
            animate = "visible"
            whileHover="hover"
            
          >
            {/* BACKGROUND GRADIENT LAYER */}
            <div className={`absolute inset-0 z-0 bg-gradient-to-tl ${card.gradient} rounded-[18px] brightness-120 opacity-50`} />

            {/* FOREGROUND CONTENT */}
            <div className="relative z-10 bg-black/100 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between transition-shadow duration-300 ">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">
                {card.title}
              </h2>
              <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
                {card.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default About;
