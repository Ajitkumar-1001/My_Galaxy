import React, { useMemo, useEffect, useState, useRef } from "react";
import SpotlightCard from "../comp/Spotlightcard";
import { motion, useAnimation, useInView } from "framer-motion";
import DialogDemo from "../comp/Dialog";



const projects: any = [
  {
    title: "Smart Loan Predictor",
    description:
      "Built a Production complete Full-stack end-to-end ML application that predicts the approval rate of Loan , provides a automated LLM generated report according to the response....",
    tech: ["Python", "Typescript", "React", "Tailwindcss", "Sci-kit Learn", "FastAPI", "Docker", "Dagshub", "MLflow",],
    link: "https://github.com/Ajitkumar-1001/Loan_prediction_App",
    demo: "Live coming soon....",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-2",
    demo2: "",
  },
  {
    title: "MIDAS Skin Cancer Detection",
    description:
      "Developed a CNN-based image classifier alongside a colleague for identifying melanoma using the standford skin cancer dataset. Achieved 85%+ accuracy with SE,CBAM blocks and LR scheduler.",
    tech: ["PyTorch", "CNN", "RestNet", "Transformers", "Distil-BERT", "Hyperparameter Tuning", "Explainable AI", "Data Augmentation"],
    link: "https://github.com/Ajitkumar-1001/MIDAS-Skin-Cancer-Detection",
    demo: "Live coming soon...",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-1",
    demo2: "",
  },
  {
    title: "CovDet",
    description:
      "An Application where you upload your chest x-ray images, it detects if the sample is a COVID-19 affected or other lung disease!, useful medical application for both patient and doctors",
    tech: ["PyTorch", "CNN", "RestNet", "ConvNext", "Hyperparameter Tuning", "Explainable AI", "Data Augmentation"],
    link: "https://github.com/Ajitkumar-1001/Covid-19-detection",
    demo: "Live coming soon....",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-3",
    demo2: "",
  },
  {
    title: "BlogPosts",
    description:
      "A Blogs, Journals and detailed Description of all my and upcoming works!, in a blog fashion with AI summarizer!",
    tech: ["React", "TailwindCSS", "TypeScript"],
    link: "https://github.com/Ajitkumar-1001/Blogspot",
    demo: "https://blog.ajitkumar.io",
    source: "https://blog.ajitkumar.io/blogs/",
    demo2: "",
  }, {
    title: "Jersey City Citibike rides Prediction",
    description:
      "Built an end-to-end MLops pipeline using real-time Citi Bike data with preprocessing in Hopsworks, tracked via MLflow, and deployed on Streamlit,Integrated CI/CD to fetch and load Daily data and updates in model.",
    tech: ["Python", "MLflow", "Hopsworks", "Streamlit", "Github Actions"],
    link: "https://github.com/Ajitkumar-1001/citibike_mlops",
    demo: "Live coming soon....",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-5",
    demo2:"",
  },
  {
    title: "New York City Taxi-rides Prediciton",
    description:
      "Built an end-to-end ML pipeline using real-time NYC data with preprocessing in Hopsworks, tracked via MLflow, and deployed on Streamlit.",
    tech: ["Python", "Github Actions", "MLflow", "Hopsworks", "Streamlit"],
    link: "https://github.com/Ajitkumar-1001/AppliedML_NYC_taxidata",
    demo: "Live coming soon....",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-6",
    demo2: "",
  },
  {
    title: "Simulation of a Prosthetic Robotic limbs using Reinforcement Learning",
    description:
      "Trained a humanoid-V4 robot to walk and balance focusing on the stability and efficiency of the limbs, to aid the physically challenged individuals to walk and perform daily activities with the implementation of Reinforcement Learning.",
    tech: ["Python", "PyTorch", "Reinforcement Learning", "OpenAI Gym", "TensorBoard",",MuJoCo","Soft Actor-Critic","TD3","PPO"],
    link: "https://github.com/Tylerrut/CSE-546-RL-Final-Project",
    demo: "Live coming soon....",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-8",
    demo2: "",
  },{
    title: "Nexomnis",
    description:
      "An agentic AI knowledge platform that lets users upload documents, ask questions, and receive grounded answers from their preferred LLM. Nexomnis combines Retrieval-Augmented Generation, LangGraph-based orchestration, multi-model routing, and document-aware reasoning to deliver citation-backed responses across OpenAI, Gemini, Claude, and local Ollama models.",
    tech: [
      "Python",
      "LangChain",
      "LangGraph",
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "ChromaDB",
      "OpenAI",
      "Google Gemini",
      "Anthropic Claude",
      "Ollama",
      "RAG",
      "Agentic AI"
    ],
    link: "https://github.com/Ajitkumar-1001/Nexomnis",
    demo: "Live coming soon",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-9",
    demo2: "",
  },{
    title: "Tutorly",
    description:
      "An AI-powered tutoring platform that uses reinforcement learning to personalize curriculum sequencing—where students upload their syllabus, an RL agent dynamically selects optimal topics to teach, an LLM delivers lessons, and adaptive quizzes continuously optimize the learning path.",
    tech: ["Python", "Langchain","Langgraph","Next.js","TailwindCSS","TypeScript","ChromaDB","Reinforcement Learning","SAC","OpenAI"],
    link: "https://github.com/Ajitkumar-1001/Tutorly",
    demo: "Live coming soon",
    source: "https://blog.ajitkumar.io/blogs/featured/blog-10",
    demo2: "",
  }



];

const Projects: React.FC = () => {

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [demo, setDemo] = useState<string>("Click Here to demo me!!");

  const threshold: any = 0.3;

  const demoref = useRef<HTMLHeadingElement | null>(null);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, threshold);

  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const parentVariant: any = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const childVariant: any = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 40,
        scale: 0.9,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  return (
    <section
      id="projects"
      className=" min-h-screen py-20 flex flex-col items-center justify-start"
    >
      <motion.div
        ref={sectionRef}
        variants={parentVariant as any}
        initial="hidden"
        animate={controls}
        className="max-w-8xl mx-auto px-10 mt-3 text-center"
      >
        <motion.h2
          variants={childVariant as any}
          className="text-4xl font-bold text-blue-400 mb-3"
        >
          Projects
        </motion.h2>

        {/* <motion.h2 variants={childVariant  as any} className="text-lg font-sans font-bold bg-gradient-to-t from-indigo-200 to-transparent bg-clip-text text-transparent text-center ">For More projects...</motion.h2>
          <motion.a variants={childVariant  as any} href="https://www.google.com" className="inline-flex items-center p-2 justify-center bg-gradient-to-t from-indigo-500 to-indigo-200 bg-clip-text text-transparent bg-transparent border border-indigo-200 rounded-full mb-5">Visit Blogspot</motion.a> */}


        <motion.div
          variants={parentVariant as any}
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-10"
        >
          {projects.map((project:any, index:number) => (
            <motion.div
              key={index}
              variants={childVariant as any}
              whileHover={{ scale: 1.02 }}
            // className="border-2 rounded-2xl"
            >
              <SpotlightCard
                className="min-h-55 bg-transparent"
                maxTilt={20}
                spotlightColor="rgba(255, 255, 255, 0.15)"
              >
                <div
                  className="h-full bg-transparent rounded-xl shadow-2xl p-6 transition-transform duration-300"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <h3 className="text-2xl font-semibold text-blue-400 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-md text-gray-300 font-semibold mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {project.tech.map((tech:any, idx:number) => (
                      <span
                        key={idx}
                        className="bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 mb-2 items-center">
                    <div className="flex justify-center mb-2">
                      <DialogDemo className="text-white rounded-full" button="Read More.." source={project.source} ratio={20/16}/>
                    </div>
                    <div className="flex justify-center mb-2">
                      <DialogDemo className="text-blue-300 bg-transparent border-blue-200 border-2 rounded-full" button="View Demo" source={project.demo2} ratio={20/16}/>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline text-sm"
                    >
                      Experience or GetSource →
                    </a>
                    <div className="mb-2 text-md brightness-120 transition-spring">
                      {project.demo && hoverIndex === index && (
                        
                        <h2
                          ref={demoref}
                          onMouseEnter={() => setDemo(project.demo)}
                          onMouseLeave={() =>
                            setDemo("Click here for Live!!")
                          }
                          className="text-sm font-semibold font-sans text-blue-300 text-center"
                        >
                         {demo}
                        </h2>
                        
                      )}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
