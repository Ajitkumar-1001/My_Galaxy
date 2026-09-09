import React ,{useState,useMemo, useEffect, useRef }from 'react';
import { motion, useAnimation } from 'framer-motion';
import {  Mail} from 'lucide-react'; // Using lucide-react for icons

// Define the types for the component's props for type safety with TypeScript
interface ProfileCardProps {
  name: string;
  role: string;
  university: string;
  degree: string;
  address: string,
  location: string,
  contact: string;
  mainImageUrl: string;
  profileImageUrl: string;
  profileHandle: string;
  isAvailable: boolean;
  // className : string,
}

// The Profile Card Component
const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  // role,
  university,
  // address,
  location,
  degree,
  contact,
  mainImageUrl,
  profileImageUrl,
  profileHandle,
  isAvailable,
  // className
}) => {

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
    const [isHovered , setIsHovered] = useState<boolean>(false);
    const control1 = useAnimation();

    const hoverGlow = useMemo(() => ({
      hidden: { scale: 1 },
      visible: {
        scale: 1.1,
        boxShadow: "0 0 15px #f5f5f5, 0 0 25px #60a5fa, 0 0 40px #2563eb",
        transition: { duration: 0.3, ease: "easeIn" }
      }
    }), []);

    // const handleHover = useCallback(()=>{
    //   control3.start("visible");

    // },[control3]);


    const img = useRef<HTMLImageElement|null>(null);
    


    const cardvariants = useMemo(() => ({
      hidden : {opacity:0, y: 20 , z: 30},
      visible : {opacity:1, y:0,z:0 , transition : {duration:0.5 , delay:0.4 , ease:"easeIn", staggerChildren : 0.2}}
    }),[])

    const itemvariants = useMemo(()=>({
      hidden : {opacity : 0, y:30, z: 20},
      visible : {opacity : 1, y:0 , z: 0, transition: {duration:0.5, ease:"easeInOut"}}
    }),[])

    const itemvariants2 = useMemo(() => ({

       hidden : {opacity: 0 , y:40, z:50},
       visible : {opacity :1 , y:0 , z:0 , transition : {duration : 0.7, ease:"easeOut"}}
    }), [])

    const itemvariants3 = useMemo(() => ({

      hidden : {opacity: 0 , y:40, z:50},
      visible : {opacity :1 , y:0 , z:0 , transition : {duration : 0.8, ease:"easeOut"}}
   }), [])

    useEffect(()=>{
      const sequence = () => control1.start("visible");
      // On a first visit the splash overlay is up; play the entrance after it lifts.
      if (document.documentElement.classList.contains("splash")) {
        window.addEventListener("splash:done", sequence, { once: true });
        return () => window.removeEventListener("splash:done", sequence);
      }
      sequence();
    },[control1])

  return (
    // Outermost container to center the card and provide a background
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 font-sans font-bold relative z-20">
      <div
        className="w-full max-w-xl min-h-xl p-[1px] rounded-xl bg-white/10 shadow-xl relative z-20"
        
      >
        {/* Top section with name and role */}
        <motion.div className="p-6 text-center" variants={cardvariants as any} 
        initial="hidden"
        animate ={control1}
        viewport = {{once:true}}>
          <motion.h1 className="text-3xl font-extrabold text-blue-400 " variants={itemvariants as any}>{university}</motion.h1>
          <motion.p className="text-md text-white mt-1 " variants={itemvariants as any}>{degree}</motion.p>
          {/* <motion.p className="text-md text-white mt-2 tracking-widest " variants={itemvariants as any}>{address}</motion.p> */}
          <motion.p className="text-md text-white mt-2 tracking-widest " variants={itemvariants as any}>{location}</motion.p>
          <motion.p className='text-md text-white ' variants={itemvariants as any}>{contact}</motion.p>
        </motion.div>

     
        <motion.div 
          className="px-4" 
          variants={cardvariants as any} 
         initial="hidden"
         animate ={control1}
         viewport = {{once:true}}
         
     
        >
          <motion.img
           
            variants={itemvariants as any}
            src={mainImageUrl}
            alt={`${name}'s photo`}
            className="w-full  h-90 object-cover rounded-[2rem] shadow-lg "
            // Fallback in case the image fails to load
            onError={(e) => {
              (e.target as HTMLImageElement).src = `src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG`;
            }}
          />
        </motion.div>

        {/* Bottom section with profile info and CTA */}
        <motion.div className="p-6 flex items-center justify-between " variants={cardvariants as any} initial="hidden" animate={control1}>
          <motion.div className="flex items-center gap-3  " variants={itemvariants2 as any}>
            <motion.img
            variants={hoverGlow as any}
             ref = {img}
             onMouseEnter={()=>{ setIsHovered(true);}}
             onMouseLeave={()=>{setIsHovered(false);}}
             initial="hidden"
             animate = {isHovered ? "visible" : "hidden"}
              
              src={profileImageUrl}
              alt={name}
              className="w-14 h-14 p-[3px] rounded-full  bg-blue-300 animate-pulse object-cover "
              onError={(e) => {
                (e.target as HTMLImageElement).src = `src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG`;
              }}
            />
            <div>
              <p className="text-xs md:text-sm font-semibold text-white">@{profileHandle}</p>
              {isAvailable && (
                <div className="flex items-center gap-1 md:gap-1.5 mt-1">
                  <span className="md:w-2 md:h-2 w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs md:text-sm text-green-400">Available</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.a 
            onClick={() => handleScroll("contact")}
            className="bg-gray-200 text-gray-900 font-semibold px-5 py-2.5  rounded-lg shadow-lg  flex items-center sm:gap-4 md:gap-2 animate-pulse"
            variants={itemvariants3 as any}
            
            
          >
            <Mail size={16} />
            Hire Me
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCard;