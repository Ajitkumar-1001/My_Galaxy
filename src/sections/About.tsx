import React from "react";

// Rendered to static HTML at build time (no client directive). Reveal
// animations come from the `reveal` classes in global.css + the observer in Layout.astro.
const About: React.FC = () => {

  const cards = [
    {
      title: "A Brief",
      text: `A passionate engineer driven by curiosity and a love for innovation. I explore the evolving world of AI, always seeking breakthroughs that shape the future. With a focus on emerging trends and tech's societal impact, I thrive on turning complex ideas into exciting possibilities.`,
    },
    {
      title: "Passion",
      text: `Passion towards innovation and improvement, interested in exploring the world of agents in AI, ardent on building applications with seamless integrations of the latest technologies.`,
    },
    {
      title: "Career Aspirations",
      text: `I'm deeply thrilled by the possibilities of Machine Learning and aspire to build models that solve real-world problems at scale to deployment—driving impact across industries. Eager to collaborate in teams where I can contribute to both experimentation and production-ready solutions.`,
    },
    {
      title: "Education",
      text: `Pursuing a Master of Science in Data Science at the University at Buffalo, with a strong focus on machine learning, deep learning, and statistical modeling. Also holds a Bachelor's in Mechanical Engineering from Anna University (Sri Sai Ram Engineering College).`,
    },
    {
      title: "Coursework",
      text: `Through hands-on projects and advanced coursework, I have gained expertise in building scalable ML systems, analyzing large datasets, and applying AI techniques to real-world challenges.`,
    },
    {
      title: "Current Work",
      text: `I'm currently exploring and working in reinforcement learning to further expand my knowledge in deep learning through reward-based learning enabling machines to learn efficiently and adaptively.`,
    },
  ];

  return (
    <section id="about" className="min-h-screen flex flex-col justify-center bg-transparent py-10">
      <div className="relative">
        <h1 className="reveal text-4xl font-extrabold font-sans mx-auto my-20 text-center text-blue-400 cursor-pointer">
          About
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 md:px-20">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="reveal relative w-full max-w-2xl mx-auto p-[2px] rounded-2xl hover:scale-[1.03] hover:shadow-[0_0_15px_#60a5fa,0_0_30px_#93c5fd,0_0_45px_#bfdbfe]"
              style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
            >
              <div className="absolute inset-0 z-0 bg-blue-500/20 rounded-[18px] opacity-50" />

              <div className="relative z-10 bg-black/100 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between transition-shadow duration-300 ">
                <h2 className="text-2xl font-bold text-blue-400 text-center mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-300 font-sans font-semibold text-center leading-relaxed text-md capitalize">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
