import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Navbar from './components/navbar';
import Skills from './components/Skills'; 
import Projects from './components/Project';

import Particles from './components/particles';
import SplashCursor from './components/Splashcursor';
import './App.css';
import Contact from './components/Contact';

function App() {
  return (
    <main className="relative">
    
       <div className="fixed inset-0 z-0">
        <Particles
          particleCount={1200}
          particleColors={["#ffffff","#1e90ff","#3d4ae9","#d3d3d3"]}
          moveParticlesOnHover={true}
          particleBaseSize={80}
          speed={0.4}
          className="w-full h-full"
        />
      </div> 
    
      <SplashCursor/>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact/>
      </div>
    </main>
  );
}

export default App;
