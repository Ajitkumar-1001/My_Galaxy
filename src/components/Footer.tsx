import React from "react";

const Footer : React.FC = () => { 

    return( 
        <footer className=" w-full flex flex-col items-center">
              <div className="fixed-bottom  mt-10 py-3 border-t max-w-10xl border-gray-700 text-center text-gray-500">
            <h1 className="text-md">Ajitkumar Senthil Kumar</h1>
            <p className="text-sm"> {new Date().getFullYear()} copyrights All Rights Reserved.</p>
            <p className="text-xs mt-1">Licensed under the MIT License.</p>
          </div>
        </footer>
    );

};

export default Footer;