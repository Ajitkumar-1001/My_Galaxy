import React from "react";
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";

// Rendered to static HTML at build time (no client directive). Reveal
// animations come from the `reveal` classes in global.css + the observer in Layout.astro.
const Contact: React.FC = () => {
  const links = [
    {
      href: "mailto:dev@ajitkumar.io",
      Icon: EnvelopeOpenIcon,
      glow: "hover:shadow-[0_0_15px_#ffffff,0_0_25px_#60a5fa,0_0_35px_#2563eb]",
    },
    {
      href: "https://www.linkedin.com/in/ajitkumar1001",
      Icon: LinkedInLogoIcon,
      glow: "hover:shadow-[0_0_15px_#ffffff,0_0_25px_#60a5fa,0_0_35px_#2563eb]",
    },
    {
      href: "https://github.com/ajitkumar-1001",
      Icon: GitHubLogoIcon,
      glow: "hover:shadow-[0_0_15px_#ffffff,0_0_25px_#60a5fa,0_0_35px_#2563eb]",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen py-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="max-w-3xl text-center space-y-8">
        <h1
          className="reveal text-4xl font-extrabold text-blue-400"
        >
          Contact Me
        </h1>

        <p
          className="reveal sm:text-lg md:text-2xl leading-relaxed font-bold text-gray-300"
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
              className={`border border-blue-600 text-blue-300 hover:text-white font-semibold px-6 py-3 rounded-2xl transition duration-200 ease-in-out hover:scale-[1.2] ${glow}`}
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
