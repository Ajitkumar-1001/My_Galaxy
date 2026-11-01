import React from "react";

const Footer : React.FC = () => { 

    return( 
        <footer className=" w-full  flex flex-col items-center">
              <div className="fixed-bottom max-w-9xl w-full mt-10 py-3 border-t max-w-10xl border-gray-700 text-center text-gray-500">
            <h1 className="text-md">Ajitkumar Senthil Kumar</h1>
            <p className="text-sm"> {new Date().getFullYear()} copyrights All Rights Reserved.</p>
            <p className="text-xs mt-1">Licensed under the MIT License.</p>
            <p className="text-xs mt-1 px-4">
              Milky Way illustration:{" "}
              <a className="underline underline-offset-2 hover:text-gray-300" href="https://science.nasa.gov/photojournal/our-milky-way-gets-a-makeover-artist-concept/" target="_blank" rel="noopener noreferrer">NASA/JPL-Caltech/R. Hurt (SSC/Caltech)</a>
              {" · "}Milky Way panorama:{" "}
              <a className="underline underline-offset-2 hover:text-gray-300" href="https://www.eso.org/public/images/eso0932a/" target="_blank" rel="noopener noreferrer">ESO/S. Brunier</a>
              {" · "}Planet textures:{" "}
              <a className="underline underline-offset-2 hover:text-gray-300" href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope (CC BY 4.0)</a>
            </p>
          </div>
        </footer>
    );

};

export default Footer;