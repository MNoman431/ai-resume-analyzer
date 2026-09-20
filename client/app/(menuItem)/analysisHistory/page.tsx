"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserAnalyses } from "@/services/resumeService";
import { FileText, Calendar, ChevronRight, BarChart3, ExternalLink, Search } from "lucide-react";
import Link from "next/link";

const AnalysisHistory = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analysisHistory"],
    queryFn: getAllUserAnalyses,
  });

  const analyses = data?.data || [];

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500">
        History load karne mein masla hua. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic">
            Analysis <span className="text-emerald-600">History</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            You have performed {analyses.length} AI resume scans so far.
          </p>
        </div>
        
        <div className="relative group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search by job title..." 
             className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 outline-none w-full md:w-64 transition-all"
           />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {analyses.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem]">
            <FileText className="mx-auto w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No analysis history found.</p>
            <Link href="/" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline mt-2 inline-block">Start your first scan</Link>
          </div>
        ) : (
          analyses.map((item) => (
            <Link 
              key={item._id} 
              href={`/analysisHistory/${item._id}`} // Adjust path according to your result page
              className="group relative bg-card border border-border hover:border-emerald-600/50 rounded-3xl p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
            >
              {/* Score Indicator */}
              <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl bg-secondary/50 flex flex-col items-center justify-center border border-border group-hover:bg-emerald-600/5 transition-colors">
                <span className={`text-2xl font-black ${item.analysis.atsScore >= 70 ? 'text-green-500' : 'text-emerald-600'}`}>
                  {item.analysis.atsScore}
                </span>
                <span className="text-[10px] font-bold uppercase opacity-50">Score</span>
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate group-hover:text-emerald-600 transition-colors capitalize">
                    {item.jobTitle || "Untitled Position"}
                  </h3>
                  <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                    {/* {item.aiModel} */}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} className="text-emerald-600" />
                    <span className="truncate max-w-[150px]">{item.fileName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex items-center gap-3">
                 <div className="hidden sm:flex flex-col items-end mr-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Status</p>
                    <p className="text-xs font-bold text-green-500 uppercase italic">Completed</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                 </div>
              </div>

              {/* Background Decorative Element */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <BarChart3 size={120} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;