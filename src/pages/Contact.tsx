import React, {useMemo, useState, useRef, useCallback, useEffect} from "react";
import { GitHubLogoIcon , LinkedInLogoIcon,  EnvelopeOpenIcon} from "@radix-ui/react-icons";
import {motion, useAnimation , useInView} from "framer-motion";
import { GiDuration } from "react-icons/gi";


const Contact: React.FC = () => {

  const controls = useMemo(()=>Array.from({length:3},() =>useAnimation()),[]);

  const parentControl = useMemo(()=>(useAnimation()),[]);

  const parentprop : any = useMemo(() =>({
    hidden : {scale: 0},
    visible : {scale : 1, transition:{duration:1, ease: "easeOut", staggerChildren: 0.5}}
  }),[])


  const glowColors = [
    ["#f5f5f5", "#3b82f6", "#331FC5"],  
    ["#ffffff", "#3b56f6", "#341FC5"],  
    ["#e0e0ff", "#3a55f5", "#321FC5"]  
  ];

  const hoverVariant = useMemo(
  () =>
    glowColors.map(([a, b, c], _i) => ({
      hidden: { scale: 1 },
      visible: {
        scale: 1.2,
        boxShadow: `0 0 15px ${a}, 0 0 25px ${b}, 0 0 35px ${c}`,
        transition: { duration: 0.8, ease: "easeIn" },
      },
    })),
  []
);


  const handleHover = useCallback(()=>{
   controls.forEach((con)=>{
    con.start("visible");
   });
  },[controls]);

  const handleLeave = useCallback(()=>{
    controls.forEach((con)=>{
      con.start("hidden");
    });
  },[controls]);

  useEffect(() => {
    const sequence = async()=>{
      await parentControl.start("visible");

      for ( const con of controls){ 
        await con.start("visible");
      }};

      sequence();
      
      
  },[parentControl]);
 
   
   
  return (
    <section
      id="contact"
      className="min-h-screen m-10 py-20 px-6 bg-inherit text-white flex flex-col md:flex-col items-center justify-center" >
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold bg-gradient-to-br from-gray-300 to-blue-600 bg-clip-text text-transparent">Contact Me</h2>

        <p className="text-xl font-sans font-bold leading-relaxed bg-gradient-to-t from-white to-gray-600 bg-clip-text text-transparent">
          Whether you're interested in collaborating, hiring, or just want to connect —
          feel free to reach out. I'm always open to new opportunities and meaningful discussions in the world of AI, machine learning, and full-stack development.
        </p>

        <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6" variants={parentprop as any} initial="hidden" animate={parentControl} >
          <motion.a   variants={hoverVariant[0] as any} onMouseEnter={handleHover} onMouseLeave={handleLeave}
            href="mailto:senthil5@buffalo.edu"
            className="rounded-2xl hover:bg-indigo-500  border rounded-2xl border-blue-600 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            <EnvelopeOpenIcon className="w-8 h-8 rounded-2xl shadow-3xl bg-gradient-to-t from-blue-400 to-indigo-600 bg-clip"></EnvelopeOpenIcon>
          </motion.a>
          <motion.a
            variants={hoverVariant[1] as any}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            href="https://www.linkedin.com/in/ajit-kumar-558693114/"
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-2xl border-blue-600 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-md transition"
          >
            <LinkedInLogoIcon className="w-8 h-8 rounded-2xl shadow-3xl "></LinkedInLogoIcon>
          </motion.a>
          <motion.a variants={hoverVariant[2] as any} onMouseEnter={handleHover} onMouseLeave={handleLeave}
            href="https://github.com/ajitkumar-1001"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blue-600 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-md transition"
          >
            <GitHubLogoIcon className="w-8 h-8 rounded-2xl shadow-3xl">

            </GitHubLogoIcon>
          </motion.a>
        </motion.div>
      </div>
      
    </section>



  
  );
};

export default Contact;
