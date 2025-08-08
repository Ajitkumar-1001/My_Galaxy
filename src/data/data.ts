export interface Experience_data { 
    id : number; 
    logo : string; 
    company_name : string; 
    role : string; 
    role_description : string; 
    period_Start : string; 
    period_end : string;
}; 


//so we have defined our interface where the data will be following the interface layout or structure , we need the data list to be exported in a variable 

export const experience_content : Experience_data[] = [ 

    {
        id : 1, 
        logo : "../../hcs.jpeg", 
        company_name : "Human Cloud Soft Pvt Ltd", 
        role: "Software Developer Intern",
        role_description: `Developed and maintained web applications using .NET Framework, C#, and ASP.NET MVC.
          Designed and implemented database schemas, stored procedures, and queries in Microsoft SQL Server for application backends.
          Built and integrated user interfaces with server-side logic, ensuring optimal performance and maintainability.
          Collaborated with senior developers in debugging, code reviews, and deploying applications to production environments.`,
        period_Start : "May-2023",
        period_end : "June-2024"
    },
   

    {
        id : 2,
        logo : "../../klicknet.jpeg",
        company_name : "Klicknet Info Services Pvt Ltd",
        role : "Frontend Developer",
        role_description : `Responsible for maintaining dynamic updation of the ui components.
                            designed a scalable and mobile first design for the applications in react.
                            Implemented dynamic UI components with state management.
                            Optimized performance through code splitting, lazy loading, and reusable component patterns.`,
        period_Start : "April-2022",
        period_end : "April-2023"

    },
    {
        id : 3,
        logo : "../../L&T.webp",
        company_name : "L&T Rubber Processing Machinery Pvt Ltd",
        role : "Design Engineer",
        role_description : `Worked in the Mechanical design parts of the Hydraulic Tyre Curing and Processing section
                            Provided Geometric Dimensioning and Tolerance to the 2-dimensional drawings of the mechanical parts of the Hydraulic tyre curing press in Auto-CAD
                            Updated and maintained records of the products  in wrench for hazzle free production control in the bay 
                            Designed the 3 dimensional components of the mechanical parts of the hydraulic tyre curing press in Creo`,
        period_Start : "November-2021",
        period_end : "February-2022"

    }

    


]