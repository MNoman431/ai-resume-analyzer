"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadResume } from "@/services/resumeService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      toast.success("Resume uploaded successfully!");
      // Route group (resume) is pathless, so target route is /analyze
      router.push(`/analyze?resumeId=${data.data._id}`);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Upload failed. Please try again.";
      toast.error(message);
    },
  });

  const handleUpload = () => {
    if (!file) return toast.error("Please select a resume first");
    const formData = new FormData();
    formData.append("resume", file);
    mutate(formData);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="relative group w-full">
        <label
          htmlFor="resume-upload"
          className={`relative flex flex-col items-center justify-center w-full min-h-[250px] md:h-72 p-6 md:p-10 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300 ease-in-out
            ${!file 
              ? 'bg-card border-border hover:bg-emerald-500/[0.02] hover:border-emerald-500/50' 
              : 'bg-emerald-500/[0.03] border-emerald-500'}
            shadow-sm hover:shadow-xl hover:shadow-emerald-500/10`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

          <div className="relative z-10 flex flex-col items-center justify-center w-full">
            {/* Icon Container */}
            <div className={`mb-4 md:mb-6 p-4 md:p-5 rounded-2xl transition-all duration-500 
                ${file 
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-slate-500/5 text-slate-400 group-hover:scale-110'}`}
            >
              {file ? (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>

            {file ? (
              <div className="text-center w-full px-2">
                <p className="text-base md:text-lg font-bold tracking-tight text-emerald-500 truncate w-full max-w-[200px] md:max-w-[300px] mx-auto">
                  {file.name}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-bold text-emerald-500 uppercase">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <span className="text-[10px] md:text-xs opacity-40">Click to replace</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                  <span className="text-emerald-500 underline underline-offset-6 decoration-2">Select Resume</span>
                </p>
                <p className="mt-2 text-[10px] md:text-xs opacity-40 font-medium tracking-wide">
                  PDF supported (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={isPending || !file}
        className={`w-full mt-6 md:mt-8 flex items-center justify-center gap-3 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all active:scale-95 shadow-lg
          ${isPending || !file 
            ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50" 
            : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40"
          }`}
      >
        {isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
}