import React from "react";
import {motion } from "framer-motion";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="min-h-screen m-10 py-20 px-6 bg-inherit text-white flex flex-col md:flex-col items-center justify-center" >
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold bg-gradient-to-br from-gray-300 to-blue-600 bg-clip-text text-transparent">Contact Me</h2>

        <p className="text-xl font-sans font-bold leading-relaxed bg-gradient-to-t from-white to-gray-600 bg-clip-text text-transparent">
          Whether you're interested in collaborating, hiring, or just want to connect —
          feel free to reach out. I'm always open to new opportunities and meaningful discussions in the world of AI, machine learning, and full-stack development.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
          <a
            href="mailto:senthil5@buffalo.edu"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Send an Email
          </a>
          <a
            href="https://www.linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-indigo-600 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Connect on LinkedIn
          </a>
          <a
            href="https://github.com/ajitkumar-1001"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-indigo-600 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Visit GitHub →
          </a>
        </div>
      </div>
      
    </section>



  
  );
};

export default Contact;
