import { useEffect, useMemo, useState } from 'react';
import Hero from './pages/Hero';
import About from './pages/About';
import Navbar from './components/navbar';
import Skills from './pages/Skills';
import Galaxy from './components/Galaxy';
import Particles from './components/particles';
import {  motion, useAnimation } from 'framer-motion';
import Projects from './pages/Project';
import Experience from './pages/Experience';
// import SplashCursor from './components/Splashcursor';
import './App.css';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import BgMusicButton from './components/Audio';



function App() {



  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();

  const [welcomeScreen, setWelcomeScreen] = useState<boolean>(() => {
    return sessionStorage.getItem('hasVisited') !== 'true';
  });

  const welcome = useMemo(() => ({
    hidden: { },
    visible: { transition: { staggerChildren: 1} }
  }), []);

  const welcome2 = useMemo(() => ( {
    hidden: { opacity: 0, scale: 0.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }), []);

  // const welcome3 = useMemo(() => ( {
  //   hidden: { opacity: 0, scale: 0.2 },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: { duration: 0.8, ease: "easeOut" }
  //   }
  // }), []);
 

  useEffect(() => {
    if (welcomeScreen) {
      const runWelcome = async () => {
        await control1.start("visible");
        await new Promise((res)=>setTimeout(res,500));
        await control2.start("visible");
        await new Promise((res)=> setTimeout(res,500));
        await control3.start("visible");
         

        setTimeout(() => {
          sessionStorage.setItem('hasVisited', 'true');
          setWelcomeScreen(false);
        }, 1500);
      };
      runWelcome();
    }
  }, [welcomeScreen, control1,control2,control3]);
  

  return (
    <main className="relative">
      {welcomeScreen ? (
        <div className="min-w-screen min-h-screen relative overflow-hidden bg-black">
          <div className="absolute inset-0 w-full h-full z-1">
            <Galaxy
              mouseRepulsion={true}
              mouseInteraction={false}
              density={2.5}
              glowIntensity={0.2}
              twinkleIntensity={1}
              autoCenterRepulsion={0.2}
              starSpeed={2}
              saturation={0.1}
              hueShift={50}
              speed={2}

            />
          </div>

          <motion.div
            className="flex flex-col items-center justify-center min-h-screen relative z-10"
            initial="hidden"
            animate="visible"
            variants={welcome as any}
          >
           
            <motion.h1
              className="text-4xl subpixel-antialiased md:text-6xl text-border-2 font-sans text-white font-extrabold text-center"
              variants={welcome2 as any}
            >
              <span className='bg-gradient-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent'>Welcome</span> to <span className='bg-gradient-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent'>My Galaxy!</span>
            </motion.h1>

            
            <motion.h5
              className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
              variants={welcome2 as any}
              initial="hidden"
              animate={control2}
            >
              A space to host my <span className='bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent'>Personal</span> <span className='text-white'>/</span> <span className='bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent'>Professional</span> works !!
            </motion.h5>
         
           <motion.h5
              className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
              variants={welcome2 as any}
              initial="hidden"
              animate={control3}
            
            >
                      Let's Explore !!.... 
             </motion.h5>
          </motion.div>


        </div>
      ) : (
        <>
          
          <div className="fixed inset-0 z-0">
            <Particles
              particleCount={1200}
              particleSpread={20}
              particleColors={["#ffffff", "#1ffff", "#3f3f3f", "#fefefe"]}
              moveParticlesOnHover={true}
              particleBaseSize={50}
              speed={0.25}
              cameraDistance={10}
              disableRotation = {false}
              className="w-full h-full brightness-200 "
            />
          </div>

          <div className="relative z-10">

            <Navbar />
            <BgMusicButton src="../../Hayden Folker - Adrift.mp3" />
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            
            <Contact />
            <Footer />

          </div>
        </>
      )}
    </main>
  );

};


export default App;