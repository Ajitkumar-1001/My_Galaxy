import React ,{useEffect, useState, useRef, useMemo} from "react";
import { motion, useAnimation } from "framer-motion";


const ExperienceData = { 


}
const Experience: React.FC = () => {
    const controls = useAnimation(); 
    const containerref = useRef<HTMLDivElement>(null);


    

    return (

        <section id="experience" className="min-h-screen w-full flex flex-col justify-center items-center bg-transparent  py-2 overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-xl md:text-4xl font-bold font-sans bg-gradient-to-tr from-blue-500 to-indigo-500 bg-clip-text text-transparent">Experience</h1>

                </div>
            

                <div className="w-full relative ">
                    <div className="flex">
                <div className="flex-shrink-0 w-full p-2">
                    <div className="relative bg-gradient-to-br from-white-500 to-gray-500 rounded-2xl flex flex-row overflow-hidden transition-all border bg-gradient-to-br from-white-500 to-gray-500 p-[2px] bg-clip-padding duration-300 ">
                        <div className="relative z-10  w-1/3 flex flex-col items-center m-3">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> icon </h2>
                        </div>
                        <div className="relative z-10 md:w-2/3 px-30 w-full ">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>

                        </div>
                    </div>
                    
                    
  
                    </div>
                    </div>
                </div>
                
                
                <div className="w-full relative ">
                    <div className="flex">
                <div className="flex-shrink-0 w-full p-2">
                    <div className="relative bg-gradient-to-br from-white-500 to-gray-500 rounded-2xl flex flex-row overflow-auto transition-all border bg-gradient-to-br from-white-500 to-gray-500 p-[2px] bg-clip-padding duration-300 ">
                        <div className="relative w-1/3 flex flex-col items-center m-3">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> icon </h2>
                        </div>
                        <div className="relative md:w-2/3 px-30 w-full ">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>

                        </div>
                    </div>
                    
                    
  
                    </div>
                    </div>
                </div>
                
                <div className="w-full relative ">
                    <div className="flex">
                <div className="flex-shrink-0 w-full p-2">
                    <div className="relative bg-gradient-to-br from-white-500 to-gray-500 rounded-2xl flex flex-row overflow-auto transition-all border bg-gradient-to-br from-white-500 to-gray-500 p-[2px] bg-clip-padding duration-300 ">
                        <div className="relative w-1/3 flex flex-col items-center m-3">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> icon </h2>
                        </div>
                        <div className="relative md:w-2/3 px-30 w-full ">
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>
                            <h2 className="text-5xl font-bold font-sans text-white-500"> content</h2>

                        </div>
                    </div>
                    
                    
  
                    </div>
                    </div>
                </div>

            </div>

        </section>




    );

};

export default Experience;