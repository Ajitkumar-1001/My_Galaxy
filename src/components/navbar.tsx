import React ,{useState,useEffect} from "react";
import { FaAlignJustify } from 'react-icons/fa';
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {

  const [ismobile, setIsMobile] = useState<boolean>(false);

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobile(false);
    }
  };

  useEffect(()=>{
    // Close mobile menu when screen size changes
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[])

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md shadow-lg px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 onClick={() => handleScroll("hero")} className="text-xl font-bold bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent hover:scale-110 transition duration-300 cursor-pointer">
          AK
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex flex-row gap-x-8">
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("about")}
            >
              About
            </li>
            <li
              className="text-xl font-bold bg-gradient-to-t from-white to-gray-650 bg-clip-text text-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-white hover:bg-clip-text hover:text-transparent transition duration-300 cursor-pointer hover:scale-110"
              onClick={() => handleScroll("experience")}
            >
              Experience
            </li>
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
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobile(!ismobile)}
          className="md:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          {ismobile ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        ismobile 
          ? 'max-h-96 opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      } overflow-hidden`}>
        <nav className="py-4 border-t border-gray-700/50 mt-4">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleScroll("about")}
                className="w-full text-left text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("experience")}
                className="w-full text-left text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Experience
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("skills")}
                className="w-full text-left text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Skills
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("projects")}
                className="w-full text-left text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("contact")}
                className="w-full text-left text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
