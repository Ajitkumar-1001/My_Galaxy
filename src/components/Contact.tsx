import React from "react";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="min-h-screen py-20 px-6 bg-inherit text-white flex flex-col md:flex-col items-center justify-center" >
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold text-indigo-400">Contact Me</h2>

        <p className="text-lg leading-relaxed text-gray-300">
          Whether you're interested in collaborating, hiring, or just want to connect —
          feel free to reach out. I'm always open to new opportunities and meaningful discussions in the world of AI, machine learning, and full-stack development.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
          <a
            href="mailto:yourname@example.com"
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
            className="text-indigo-400 hover:text-indigo-200 underline transition"
          >
            Visit GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
