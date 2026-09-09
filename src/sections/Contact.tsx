import React from "react";
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";

// Rendered to static HTML at build time (no client directive). Reveal
// animations come from the `reveal` classes in global.css + the observer in Layout.astro.
const Contact: React.FC = () => {
  const links = [
    {
      href: "mailto:dev@ajitkumar.io",
      Icon: EnvelopeOpenIcon,
      glow: "hover:shadow-[0_0_15px_#f5f5f5,0_0_25px_#3b82f6,0_0_35px_#331FC5]",
    },
    {
      href: "https://www.linkedin.com/in/ajitkumar1001",
      Icon: LinkedInLogoIcon,
      glow: "hover:shadow-[0_0_15px_#ffffff,0_0_25px_#3b56f6,0_0_35px_#341FC5]",
    },
    {
      href: "https://github.com/ajitkumar-1001",
      Icon: GitHubLogoIcon,
      glow: "hover:shadow-[0_0_15px_#e0e0ff,0_0_25px_#3a55f5,0_0_35px_#321FC5]",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen py-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="max-w-3xl text-center space-y-8">
        <h1
          className="reveal text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent brightness-120"
        >
          Contact Me
        </h1>

        <p
          className="reveal sm:text-lg md:text-2xl leading-relaxed font-bold bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent brightness-120"
          style={{ transitionDelay: "0.3s" }}
        >
          Whether you're interested in collaborating, hiring, or just want to connect —feel free to reach out. I'm always open to new opportunities in AI, machine learning, and full-stack development.
        </p>

        <div
          className="reveal flex flex-row justify-center items-center gap-6 mt-6"
          style={{ transitionDelay: "0.6s" }}
        >
          {links.map(({ href, Icon, glow }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-blue-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition duration-200 ease-in-out hover:scale-[1.2] brightness-120 ${glow}`}
            >
              <Icon className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
