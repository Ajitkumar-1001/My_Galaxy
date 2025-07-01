import React  from "react"; 




const Navbar: React.FC = () => {

    return( 
        <>
        <nav className="fixed flex flex-col md:flex-row top-0 left-0 w-full z-50 bg-inherit-shadow-md px-6 py-4">
        <div className="mt-3 ml-9 w-full flex flex-row md: flex-row"> 
            <a href="Home"> <h1 className="text-2xl subpixel-antialiased font-bold text-white text-shadow-lg/30 hover:text-indigo-600">Portfolio</h1> </a>
        
   

        <div className="w-5/6 flex flex-row md:flex-row justify-end-safe">
            <ul className="flex flex-row justify-evenly gap-x-10">
                <li><a href="#about" className="text-2xl subpixel-antialiased font-bold text-white text-shadow-lg/30 hover:text-indigo-600 ">About</a></li>
                <li><a href="#skills" className="text-2xl subpixel-antialiased font-bold text-white text-shadow-lg/30 hover:text-indigo-600 ">Skills</a></li>
                <li><a href="#projects" className="text-2xl subpixel-antialiased font-bold text-white text-shadow-lg/30 hover:text-indigo-600 ">Projects</a></li>
                <li><a href="#contact" className="text-2xl subpixel-antialiased font-bold text-white text-shadow-lg/30 hover:text-indigo-600 ">Contact</a></li>
                
            </ul>  
        </div>

       </div>
       </nav>
    </>

    )
}

export default Navbar;