// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound({
  title = "404 — Page not found",
  message = "The page you’re looking for doesn’t exist or has moved.",
  backTo = "/",
  backhome ="/blogs",
  backLabel = "Go home",
  blogLabel = "← Back to Blogs"

}: {
  title?: string;
  message?: string;
  backTo?: string;
  backhome? : string;
  backLabel?: string;
  blogLabel?: string;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 px-6 py-16">
      <div className="text-center space-y-6">

        <h1 className="text-2xl font-bold text-cyan-400">Error 404</h1>
        <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
        <p className="text-slate-300 max-w-xl mx-auto">{message}</p>
        <div className="flex flex-row items-center justify-center gap-3 mx-auto p-2">
         
          <Link
            to={backhome}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-t from-blue-800 to-cyan-900
                       border-2 border-blue-700 px-4 py-2 text-md font-bold
                       text-white hover:bg-slate-800 transition"
          >
            {blogLabel} 
            {/* <span aria-hidden>→</span> */}
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-t from-blue-800 to-cyan-900
                       border-2 border-blue-700 px-4 py-2 text-md font-bold
                       text-white hover:bg-slate-800 transition"
          >
            {backLabel}    <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
