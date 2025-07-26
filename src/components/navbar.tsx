import React from "react";

const Navbar: React.FC = () => {

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed flex flex-col md:flex-row top-0 left-0 w-full z-50 bg-inherit-shadow-md px-6 py-4">
      <div className="mt-3 ml-9 w-full flex flex-row">
        <h1 onClick={() => handleScroll("hero")} className="text-xl font-bold bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-650 hover:to-white hover:bg-clip-text hover:text-transparent hover:scale-130 transition duration-300">
          AK
        </h1>

        <div className="w-full flex justify-end">
          <ul className="flex flex-row gap-x-8 ml-3">
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("about")}
            >
              About
            </li>
            {/* <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("experience")}
            >
              Experience
            </li> */}
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("skills")}
            >
              Skills
            </li>
            
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("projects")}
            >
              Projects
            </li>
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("contact")}
            >
              Contact
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
