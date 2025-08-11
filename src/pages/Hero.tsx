import React, { useMemo, useEffect , useRef} from 'react';
import ProfileCard from '../components/Profilecard.tsx';
import TextType from '../components/Texttype.tsx';
import {motion, useAnimation, useInView} from "framer-motion";
import {  DownloadIcon, } from 'lucide-react';
import { EyeOpenIcon } from '@radix-ui/react-icons';

const Hero: React.FC = () => {

  const control1 = useAnimation();
  const control2 = useAnimation();

  // const MotionCard = motion(ProfileCard);
  const secView = useRef(null);
  const threshold: any = 0.3;
  const onView = useInView(secView, threshold);

  const controlprops = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
    
      y: 0,
      scale : 1,
      transition: { duration: 1.2, ease: "easeIn", delay: 0.3, staggerChildren: 0.5 }
    }
  }), []);

  const middleware = useMemo(()=>({
    hidden : { opacity:0, y:30, scale:0.8},
    visible : { opacity : 1, y:0, scale:1, transition : {delay:0.5 ,duration : 2.1, ease:"easeInOut"}}
  }),[])
  
  const controlprops2 = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.1 , rotate: 360},
    visible: {
      opacity: 1,
      scale: 1,
      rotate : 0,
      transition: { delay: 0.2, duration: 0.9, ease: "easeIn" }
    }
  }), []);
  

  useEffect(()=>{

    const contain = async()=>{
      if(onView){
      await control1.start("visible");
      await new Promise((res)=> setTimeout(res,1000));
      await control2.start("visible");
    }; }

    contain();
  },[onView,control1,control2]);

  
  

  return (


    <section ref = {secView} id = "hero" className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16 md:px-20 bg-inherit">
      {/* Left: Intro Text */}
      <motion.div  className=" w-full md:w-1/2 mx-5" variants={controlprops as any} initial="hidden" animate={control1} >
        <motion.h1 className="text-2xl text-white sm:text-3xl font-extrabold leading-tight" variants={middleware as any}>
          Hi, I am  <h2 className='text-5xl font-sans font-extrabold'><span className='bg-gradient-to-br from-blue-400 to-indigo-500 bg-clip-text text-transparent text-outline-white'><TextType
            text={["AJITKUMAR SENTHIL KUMAR", "or", "AJITKUMAR","even","AJIT!","sometimes..","Ak!"]}
            typingSpeed={75}
            pauseDuration={3500}
/></span>
            
          </h2>
        
        </motion.h1>
        <motion.div className='flex flex-row items-center' variants={middleware as any}>
          <h2 className="mt-6 text-2xl font-sans font-bold text-white leading-relaxed tracking-wide">
            My <span className='text-indigo-300'>Fields</span> of <span className='text-blue-400'>Interests</span>:{" "}
            <span className='text-blue-300'>
              <TextType
                text={["Machine Learning", "Deep Learning", "Artificial Intelligence", "Web Applications!"]}
                className='text-bold font-sans'
                typingSpeed={75}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
              />
            </span>
          </h2>
        </motion.div>

        <motion.div className='flex-flex-row items-center' variants={middleware as any}>
          <h2 className='mt-6 text-2xl font-sans font-bold text-white leading-relaxed tracking-wide'> Dear <span className='brightness-120 font-bold bg-gradient-to-t from-blue-500 to-blue-100 bg-clip-text text-transparent'><TextType
              text={["Recruiters,","Managers,","Visitors,","Colleagues,"]}
              className='text-bold font-sans '
              typingSpeed={75}
              pauseDuration={2500}
              showCursor={true}
              cursorCharacter="|"
            /></span></h2>
          <h6 className='mt-6 text-xl text-start font-sans font-bold text-white leading-relaxed tracking-wide font-capitalise bg-gradient-to-r from-gray-600 to-white bg-clip-text text-transparent'>
          From the precision of :{"  "}<span className='bg-gradient-to-t from-blue-300 to-indigo-500 bg-clip-text text-transparent font-extrabold brightness-130'><TextType
                text={["Mechanical Machines","Automobiles","Design Principles","Thermal Engineering","Finite Element Analysis"]}
                className='text-bold font-sans '
                typingSpeed={75}
                pauseDuration={3000}
                showCursor={true}
                cursorCharacter="|"
              /></span>{"  "} <br></br>To the Logic's of :{"  "}<span className='bg-gradient-to-r from-indigo-500 to-blue-300 bg-clip-text text-transparent font-extrabold brightness-130'><TextType
              text={["Neural Networks","Supervised Learning","Unsupervised Learning","Data Processing","Hyperparameter Fine Tuning"]}
              className='text-bold font-sans '
              typingSpeed={75}
              pauseDuration={3000}
              showCursor={true}
              cursorCharacter="|"
            /></span> {"  "}<br></br><br></br> 
            <span className='px-5 bg-gradient-to-t from-white to-gray-700 bg-clip-text font-bold  text-transparent brightness-150'>
            My journey has been anything but ordinary.  
            I’m a passionate engineer driven by curiosity, with roots in Mechanical Engineering and a thriving ambition in the world of Data Science, Machine Learning, and Artificial Intelligence.
            </span>
          </h6>
           <h6 className='font-bold font-sans text-xl relative mt-2 bg-gradient-to-t from-gray-700 to-white bg-clip-text text-transparent brightness-170 capitalize'>
            Actively looking for full time opportunities in Machine learning engineer, data scientist roles, I would appreciate you to explore my works! down below 

           </h6>
        </motion.div>
         
        


        {/* CTA Buttons */}
        <motion.div className="mt-8 flex md: flex-rows items-center flex-wrap gap-4" variants={middleware as any}>
          <motion.a
            variants={controlprops2 as any} 
            href="#projects"
            className="bg-transparent text-white relative flex flex-row items-center gap-2 border border-white-400 px-6 py-3 font-sans font-bold shadow-3xl rounded-md hover:scale-110 transition duration-300 shadow-md"
          >
            <EyeOpenIcon className='relative mx-2 w-8 h-8 rounded-2xl shadow-3xl'></EyeOpenIcon>
            <h2 className='relative mx-auto bg-gradient-to-t from-blue-400 to-blue-900 bg-clip-text text-transparent brightness-200 text-xl hover:text-white '>Projects</h2>
          </motion.a>
          <motion.a
            variants={controlprops2 as any} 
            href="/Ajitkumar_Resume.pdf"
            target="_blank"
            className="flex flex-row border font-sans font-bold border-white-400 text-white px-6 py-3 rounded-md  hover:text-white hover:scale-110 transition duration-300 shadow-3xl" 
          >
           <DownloadIcon className='relative mx-2 w-8 h-8 rounded-2xl shadow-3xl '></DownloadIcon>
           <h2 className='text-xl relative bg-gradient-to-br from-blue-500 to-blue-950 bg-clip-text text-transparent brightness-200  hover:text-white mx-auto'> Resume</h2>
           
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Right: Profile Card */}
    
      <motion.div className="w-full md:w-1/2 flex justify-center text-indigo-500 font-bold bg-transparent" variants={controlprops2 as any} initial="hidden" animate={control1}>
        <ProfileCard
          name="Ajitkumar"
          role="Data Scientist / ML Engineer"
          university="University at Buffalo"
          address='25 Callodine Avenue, Buffalo'
          location='New York'
          contact='+1-(716)-249-9240'
          // className='border rounded-xl shadow-3xl border-white-500'

          degree='Master of Science'
          mainImageUrl="../../892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG" 
          profileImageUrl="../../892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG" 
          profileHandle="ajitkumar"
          isAvailable={true} 

      
        />
      </motion.div>
      
    </section>
  );
};

export default Hero;
