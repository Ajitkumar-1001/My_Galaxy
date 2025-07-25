import React ,{useMemo, useEffect}from 'react';
import { motion, useAnimation } from 'framer-motion';
import { User, Mail, University } from 'lucide-react'; // Using lucide-react for icons

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
}

// The Profile Card Component
const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  university,
  address,
  location,
  degree,
  contact,
  mainImageUrl,
  profileImageUrl,
  profileHandle,
  isAvailable,
}) => {

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

    const control1 = useAnimation(); 
    const control2 = useAnimation(); 

    const cardvariants = useMemo(() => ({
      hidden : {opacity:0, y: 20 , z: 30},
      visible : {opacity:1, y:0,z:0 , transition : {duration:1 , delay:2 , ease:"easeIn", staggerChildren : 0.5}}
    }),[])

    const itemvariants = useMemo(()=>({
      hidden : {opacity : 0, y:30, z: 20},
      visible : {opacity : 1, y:0 , z: 0, transition: {duration:1, ease:"easeInOut"}}
    }),[])

    const itemvariants2 = useMemo(() => ({

       hidden : {opacity: 0 , y:40, z:50},
       visible : {opacity :1 , y:0 , z:0 , transition : {duration : 1.5, ease:"easeOut"}}
    }), [])

    const itemvariants3 = useMemo(() => ({

      hidden : {opacity: 0 , y:40, z:50},
      visible : {opacity :1 , y:0 , z:0 , transition : {duration : 1.7, ease:"easeOut"}}
   }), [])

    useEffect(()=>{
      
      const sequence = async() => {

        await control1.start("visible");
        await new Promise((res)=> setTimeout(res,1000));
        await control2.start("visible"); 
    

      }
      sequence();
    },[control1,control2])

  return (
    // Outermost container to center the card and provide a background
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 font-sans font-bold">
      <div
        className="w-full max-w-xl min-h-xl p-[1px] bg-gradient-to-br from-black-900 via-gray-800 to-white-900  shadow-xl"
        
      >
        {/* Top section with name and role */}
        <motion.div className="p-6 text-center" variants={cardvariants as any} 
        initial="hidden"
        animate ={control1}
        viewport = {{once:true}}>
          <motion.h1 className="text-3xl font-extrabold bg-gradient-to-t from-blue-600 to-blue-300 bg-clip-text text-transparent" variants={itemvariants as any}>{university}</motion.h1>
          <motion.p className="text-md bg-gradient-to-t from-white to-blue-650 bg-clip-text text-transparent mt-1" variants={itemvariants as any}>{degree}</motion.p>
          <motion.p className="text-md text-white mt-2 tracking-widest" variants={itemvariants as any}>{address}</motion.p>
          <motion.p className="text-md text-white mt-2 tracking-widest" variants={itemvariants as any}>{location}</motion.p>
          <motion.p className='text-md bg-gradient-to-t from-white to-blue-400 bg-clip-text text-transparent' variants={itemvariants as any}>{contact}</motion.p>
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
            className="w-full z-20 h-80 object-cover rounded-[2rem] shadow-lg"
            // Fallback in case the image fails to load
            onError={(e) => {
              (e.target as HTMLImageElement).src = `src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG`;
            }}
          />
        </motion.div>

        {/* Bottom section with profile info and CTA */}
        <motion.div className="p-6 flex items-center justify-between" variants={cardvariants as any} initial="hidden" animate={control1}>
          <motion.div className="flex items-center gap-3" variants={itemvariants2 as any}>
            <img
              src={profileImageUrl}
              alt={name}
              className="w-12 h-12 p-[3px] rounded-full  bg-gradient-to-r from-blue-300 via-blue-700 to-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `src/assets/892724AE-DA9C-4F9F-8AB4-ED853900ACA1.JPG`;
              }}
            />
            <div>
              <p className="font-semibold text-white">@{profileHandle}</p>
              {isAvailable && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-green-400">Available</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.a 
            onClick={() => handleScroll("contact")}
            className="bg-gray-200 text-gray-900 font-semibold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2"
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