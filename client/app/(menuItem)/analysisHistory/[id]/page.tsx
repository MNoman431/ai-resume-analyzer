"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getResumeById } from "@/services/resumeService";
import {
  ArrowLeft,
  Download,
  User as UserIcon,
} from "lucide-react";

const AnalysisDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => getResumeById(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="h-16 w-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest animate-pulse">
          Analyzing Resume...
        </p>
      </div>
    );

  if (isError || !data?.data)
    return <div className="text-center p-20">Data not found</div>;

  const resume = data.data;
  const analysis = resume.analysis;
  const parsedData = analysis.parsedData;

  return (
    <div className="min-h-screen bg-background px-4 md:px-8 py-10">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE */}
        <div className="flex-1 space-y-8">

          {/* TOP NAV */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 font-bold hover:text-emerald-500"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <a
              href={resume.fileUrl}
              target="_blank"
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
            >
              <Download size={16} />
            </a>
          </div>

          {/* SCORE + SUMMARY */}
          <div className="grid md:grid-cols-12 gap-6">

            {/* SCORE */}
            <div className="md:col-span-4 bg-card border border-border rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-xl">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="64" cy="64" r="58" strokeWidth="8" className="text-emerald-500/10" fill="transparent" />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * analysis.atsScore) / 100}
                    className="text-emerald-600 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-black">
                  {analysis.atsScore}%
                </span>
              </div>
              <p className="text-[10px] mt-3 uppercase tracking-widest text-emerald-500 font-black">
                ATS Score
              </p>
            </div>

            {/* SUMMARY */}
            <div className="md:col-span-8 bg-card border border-border rounded-[2rem] p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-3">
                AI Summary
              </h2>
              <p className="italic text-sm text-muted-foreground leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* SKILLS + MISSING */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* SKILLS */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xs font-black uppercase text-green-500 mb-4">
                Skills Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((s: string) => (
                  <span key={s} className="px-3 py-1 text-xs bg-green-500/10 text-green-600 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xs font-black uppercase text-red-500 mb-4">
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywordsMissing.map((k: string) => (
                  <span key={k} className="px-3 py-1 text-xs bg-red-500/10 text-red-600 rounded-lg">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="bg-emerald-600 text-white rounded-[2rem] p-8 shadow-xl">
            <h2 className="font-black mb-4">AI Suggestions</h2>
            <ul className="space-y-3 text-sm">
              {analysis.suggestions.map((s: string, i: number) => (
                <li key={i}>
                  <span className="opacity-50 mr-2">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* INTERVIEW */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8">
            <h2 className="font-black mb-6 text-xl">Interview Prep</h2>

            <div className="space-y-4">
              {analysis.interviewQuestions.technical.map((q: string, i: number) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl text-sm">
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:w-[380px]">
          <div className="bg-card border border-border rounded-[2rem] p-8 sticky top-10 shadow-xl">

            {/* PROFILE */}
            <div className="text-center mb-8">
              <div className="h-20 w-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">
                {parsedData.name?.[0] || "?"}
              </div>
              <h2 className="font-black text-xl">{parsedData.name}</h2>
              <p className="text-xs text-emerald-500">{parsedData.email}</p>
            </div>

            {/* EXPERIENCE */}
            <div className="bg-background border border-border p-4 rounded-2xl mb-4">
              <p className="text-[10px] uppercase text-emerald-500 font-black">
                Experience
              </p>
              <p className="font-bold text-sm">{parsedData.experience}</p>
            </div>

            {/* DROPDOWN */}
            <div className="border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between text-xs font-black uppercase"
              >
                Deep Data {isOpen ? "▲" : "▼"}
              </button>

              {isOpen && (
                <div className="p-4 space-y-4 text-xs">
                  <p><strong>Education:</strong> {parsedData.university}</p>
                  <p><strong>City:</strong> {parsedData.home_town}</p>
                  <p><strong>Interest:</strong> {parsedData.interest}</p>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            <a
              href={resume.fileUrl}
              target="_blank"
              className="mt-6 block text-center bg-black text-white py-4 rounded-xl text-xs font-black"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;