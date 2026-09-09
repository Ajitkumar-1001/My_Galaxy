import React from "react";
import { experience_content } from "../data/data";

// Rendered to static HTML at build time (no client directive). Reveal
// animations come from the `reveal` classes in global.css + the observer in Layout.astro.
const Experience: React.FC = () => {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center items-center bg-transparent py-24 w-full relative z-10 overflow-hidden">

      {/* Ambient background glow to fit the Galaxy theme */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[800px] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>

      <div className="text-center mb-24 relative z-20">
        <h1 className="reveal text-2xl md:text-3xl font-extrabold font-sans bg-gradient-to-tr from-blue-300 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Experience
        </h1>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 flex flex-col space-y-16">

        {/* The Vertical Glowing Timeline Axis */}
        <div className="reveal reveal-line absolute z-0 w-[3px] bg-gradient-to-b from-blue-400 via-transparent to-black-600 left-[40px] md:left-1/2 transform md:-translate-x-1/2 top-4 shadow-[0_0_20px_rgba(59,130,246,0.8)] rounded-full"></div>

        {experience_content.map((exp, index) => {
          // Even indices will display the card on the left side on desktop
          const isEven = index % 2 === 0;

          return (
            <div key={exp.id} className={`relative z-10 flex items-center justify-start md:justify-between w-full flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>

              {/* Desktop offset spacer */}
              <div className="hidden md:block md:w-[45%]"></div>

              {/* Center Celestial Node */}
              <div className="absolute left-[40px] md:left-1/2 transform -translate-x-1/2 flex justify-center items-center h-full top-0 md:top-auto z-20">
                <div
                  className="reveal reveal-pop w-5 h-5 bg-black border-[3px] border-blue-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,1)] relative"
                  style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
                >
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                </div>
              </div>

              {/* The Detail Card */}
              <div
                className={`reveal ${isEven ? 'reveal-left' : 'reveal-right'} w-full md:w-[45%] pl-[90px] md:pl-0 mt-2 md:mt-0 relative`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="p-6 sm:p-8 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)] hover:bg-black/60 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500 group">

                  <div className="flex flex-col lg:flex-row gap-5 items-center lg:items-start mb-6">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/5 border border-white/10 shadow-lg p-3 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-500">
                      <img src={exp.logo} alt={exp.company_name} className="w-full h-full object-contain brightness-110 group-hover:brightness-125 transition-all" />
                    </div>
                    <div className="text-center lg:text-left flex flex-col justify-center">
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-gray-500 to-white bg-clip-text text-transparent mb-2 group-hover:from-white group-hover:to-blue-300 transition-colors drop-shadow-sm leading-tight">{exp.company_name}</h3>
                      <div className="inline-flex items-center justify-center lg:justify-start space-x-2 text-sm font-semibold text-gray-300 bg-white/10 border border-white/5 py-1.5 px-4 rounded-full w-max mx-auto lg:mx-0 shadow-inner">
                        <span>{exp.period_Start}</span>
                        <span className="text-blue-500">—</span>
                        <span>{exp.period_end}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5 mt-2">
                    <h4 className="text-xl font-semibold text-white/95 mb-3 tracking-wide">{exp.role}</h4>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-normal whitespace-pre-line group-hover:text-gray-100 transition-colors">{exp.role_description}</p>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;
