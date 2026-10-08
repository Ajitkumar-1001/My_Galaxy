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
        logo : "/ub.jpeg", 
        company_name : "University at Buffalo", 
        role: "Research Assistant — AI Systems",
        role_description: `MyVictor: Shipped a production university-advising chatbot backed by ~300 automated tests, with async APIs, stateless SSE streaming and non-blocking conversation persistence, all without breaking the existing public API contract.
          MyVictor: Cut LLM calls to zero for common list and count questions by running structured database queries directly, and improved answer grounding with Neo4j + Qdrant hybrid retrieval, reranking and self-correcting query repair, evaluated on 37 QA cases.
          MyVictor: Locked access down to approved users with allowlisted authentication and ownership-scoped, private conversation history, plus an audited read-only admin view for oversight.
          MyVictor: Deployed on OpenShift, standardizing delivery through container orchestration, routing and release management on the university's infrastructure.
          Faculty Monitoring: Built a research-intelligence platform tracking 80+ UB faculty across 12 academic and federal sources, using automated ingestion, entity resolution and provenance-aware PostgreSQL/Supabase storage.
          Faculty Monitoring: Delivered FastAPI + Next.js workflows that turn retrieval-grounded LLM synthesis into human-reviewable weekly reports on publications and grants, with Gmail/Slack alerts automated through Composio.`,
        period_Start : "March-2026",
        period_end : "Present"
    },
    {
        id : 2, 
        logo : "/hcs.jpeg", 
        company_name : "Human Cloud Soft Pvt Ltd", 
        role: "Software Developer",
        role_description: `Built 18 REST API endpoints giving 4 operational teams one place to track inventory, update stock and retrieve records.
          Raised inventory accuracy by 35% by replacing manual recordkeeping with React.js interfaces and ASP.NET MVC logic that validates every stock transaction.
          Cut inventory audit time by 40% with T-SQL stored procedures, indexed-query tuning and database-driven stock reconciliation.
          Hardened the APIs with server-side validation, input sanitization and Postman testing, on SQL Server persistence with AWS deployment support.`,
        period_Start : "May-2023",
        period_end : "June-2024"
    },
   

    {
        id : 3,
        logo : "/klicknet.jpeg",
        company_name : "Klicknet Info Services Pvt Ltd",
        role : "Junior Software Developer",
        role_description : `Created reusable React.js and JavaScript functional components for client-facing web apps, standardizing responsive layouts by almost 70% and removing duplicate UI work.
                            Connected Flask REST APIs to frontend workflows, backed by unit and API-to-database integration tests that checked business logic, data persistence and error handling before each release.`,
        period_Start : "April-2022",
        period_end : "April-2023"

    },
    {
        id : 4,
        logo : "/L&T.webp",
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