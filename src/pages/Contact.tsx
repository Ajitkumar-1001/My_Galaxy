import React, { useMemo, useEffect, useRef } from "react";
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { motion, useAnimation, useInView } from "framer-motion";



const Contact: React.FC = () => {
  const contactRef = useRef(null);
  const threshold : any = 0.3;
  const inView = useInView(contactRef, threshold);
  const controls = useAnimation();

  const parentVariant : any = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  }), []);

  const childVariant : any = useMemo(() => ({
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }), []);

  const glowColors = [
    ["#f5f5f5", "#3b82f6", "#331FC5"],
    ["#ffffff", "#3b56f6", "#341FC5"],
    ["#e0e0ff", "#3a55f5", "#321FC5"],
  ];

  const iconVariants : any = glowColors.map(([a, b, c]) => ({
    rest: { scale: 1, boxShadow: "none" },
    hover: {
      scale: 1.2,
      boxShadow: `0 0 15px ${a}, 0 0 25px ${b}, 0 0 35px ${c}`,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }));

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView]);

  return (
    <section
      id="contact"
      ref={contactRef}
      className="min-h-screen py-24 px-6 flex flex-col items-center justify-center"
    >
      <motion.div
        className="max-w-3xl text-center space-y-8"
        variants={parentVariant}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="sm:text-2xl md:text-4xl font-bold bg-gradient-to-br from-gray-300 to-blue-600 bg-clip-text text-transparent"
          variants={childVariant}
        >
          Contact Me
        </motion.h2>

        <motion.p
          className="sm:text-lg md:text-2xl leading-relaxed font-bold bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent brightness-120"
          variants={childVariant}
        >
          Whether you're interested in collaborating, hiring, or just want to connect —feel free to reach out. I'm always open to new opportunities in AI, machine learning, and full-stack development.
        </motion.p>

        <motion.div
          className="flex flex-col  justify-center items-center gap-6 mt-6"
          variants={childVariant}
        >
          {[{
            href: "mailto:senthil5@buffalo.edu",
            Icon: EnvelopeOpenIcon,
            variant: iconVariants[0]
          }, {
            href: "https://www.linkedin.com/in/ajit-kumar-558693114/",
            Icon: LinkedInLogoIcon,
            variant: iconVariants[1]
          }, {
            href: "https://github.com/ajitkumar-1001",
            Icon: GitHubLogoIcon,
            variant: iconVariants[2]
          }].map(({ href, Icon, variant }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition"
              variants={variant}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <Icon className="w-8 h-8" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

    
    </section>

        
        );
    
};

export default Contact;
