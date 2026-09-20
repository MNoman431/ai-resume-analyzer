"use client";

import { useQuery } from "@tanstack/react-query";
import { getResumeById } from "@/services/resumeService";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResultPage() {
  const params = useParams();
  const [isDataOpen, setIsDataOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["resume", params.id],
    queryFn: () => getResumeById(params.id as string),
    enabled: !!params.id,
  });

  // Helper for empty data
  const renderData = (value: any) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="opacity-40 italic font-normal text-[10px]">Not Specified</span>;
    }
    return value;
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-background">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
      </div>
      <p className="mt-4 font-bold text-xs uppercase tracking-[3px] animate-pulse">Scanning Analysis...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500 font-bold">
      Failed to load analysis. Please try again.
    </div>
  );

  const resume = data.data;
  const analysis = resume.analysis;
  const parsedData = analysis.parsedData;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-12 px-4 md:px-8">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* --- LEFT COLUMN: AI INSIGHTS --- */}
        <div className="flex-1 space-y-8">
          
          {/* Hero Score & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Circular Score */}
            <div className="md:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-2xl">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-emerald-500/10" />
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * analysis.atsScore) / 100}
                    className="text-emerald-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <span className="absolute text-4xl font-black">{analysis.atsScore}%</span>
              </div>
              <h3 className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-emerald-500">ATS Match Score</h3>
            </div>

            {/* Summary */}
            <div className="md:col-span-8 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-emerald-500 ">
                <span className="h-2 w-2 rounded-full bg-emerald-500 "></span>
                <h2 className="text-sm font-black uppercase tracking-widest">AI Audit Summary</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic text-sm md:text-base">
                "{analysis.summary}"
              </p>
            </div>
          </div>

          {/* Suggestions & Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-[2rem] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span> Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywordsMissing.length > 0 ? (
                  analysis.keywordsMissing.map((k: string) => (
                    <span key={k} className="px-3 py-1.5 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-bold">
                      {k}
                    </span>
                  ))
                ) : <p className="text-xs font-medium text-green-500">Perfect alignment with JD!</p>}
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2rem] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Optimization Tips
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((s: string, i: number) => (
                  <li key={i} className="text-[11px] text-slate-500 flex gap-3 leading-relaxed">
                    <span className="text-emerald-500 font-bold">0{i+1}</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interview Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              {/* <span className="text-8xl font-black">?</span> */}
            </div>
            <h2 className="text-2xl font-black mb-8">Interview Prep Kit</h2>
            <div className="space-y-8">
              <section>
                <p className="text-[10px] font-black tracking-[4px] text-emerald-400 uppercase mb-4">Technical Drill</p>
                <div className="space-y-3">
                  {analysis.interviewQuestions.technical.map((q: string, i: number) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs leading-relaxed hover:bg-white/10 transition-colors">
                      {q}
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-[10px] font-black tracking-[4px] text-teal-300 uppercase mb-4">Behavioral Drill</p>
                <div className="space-y-3">
                  {analysis.interviewQuestions.behavioral.map((q: string, i: number) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs leading-relaxed hover:bg-white/10 transition-colors italic">
                      "{q}"
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="lg:w-[400px]">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 sticky top-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="h-24 w-24 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-xl shadow-emerald-500/20">
                {parsedData.name ? parsedData.name[0] : "?"}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{parsedData.name || "Anonymous User"}</h2>
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-emerald-500">{parsedData.email || "No email"}</p>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{parsedData.phoneNumber || "No Contact"}</p>
              </div>
            </div>

            <div className="space-y-4">
               {/* Experience Box */}
               <div className="bg-background border border-border p-5 rounded-3xl">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Experience</p>
                  <p className="text-sm font-bold">{renderData(parsedData.experience)}</p>
               </div>

               {/* Dropdown Section */}
               <div className="border border-border rounded-3xl overflow-hidden">
                  <button onClick={() => setIsDataOpen(!isDataOpen)} className="w-full flex justify-between items-center p-5 bg-background/50 hover:bg-emerald-500/5 transition-all font-black text-[10px] uppercase tracking-widest">
                     Deep Scan Data
                     <span>{isDataOpen ? "▲" : "▼"}</span>
                  </button>
                  {isDataOpen && (
                    <div className="p-6 bg-card border-t border-border space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                      <div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Education</p>
                        <p className="text-xs font-semibold">{parsedData.university ? `${parsedData.university} (${parsedData.education})` : renderData(null)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase mb-2">Skills Found</p>
                        <div className="flex flex-wrap gap-1.5">
                          {parsedData.skills?.map((s: string) => (
                            <span key={s} className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded text-[9px] font-bold uppercase">{s}</span>
                          )) || renderData(null)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">FYP</p>
                        <p className="text-[11px] leading-relaxed italic opacity-70">{renderData(parsedData.fyp)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">City</p>
                          <p className="text-[10px] font-bold">{renderData(parsedData.home_town)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Interests</p>
                          <p className="text-[10px] font-bold">{renderData(parsedData.interest)}</p>
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="mt-10">
              <a href={resume.fileUrl} target="_blank" className="flex items-center justify-center w-full py-5 bg-foreground text-background rounded-3xl font-black text-xs uppercase tracking-[3px] hover:scale-[1.02] transition-transform shadow-lg shadow-black/10">
                Original PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}