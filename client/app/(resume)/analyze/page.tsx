"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { analyzeResume } from "@/services/resumeService";
import toast from "react-hot-toast";

export default function AnalyzePage() {
  const params = useSearchParams();
  const router = useRouter();

  const resumeId = params.get("resumeId");

  const { mutate, isPending } = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      toast.success("Analysis completed successfully!");
      router.push(`/result/${data.data._id}`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Analysis failed. Please check your monthly limit.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumeId) {
      return toast.error("Resume ID missing. Please upload again.");
    }

    const formData = new FormData(e.currentTarget);

    const jobDescription = formData.get("jobDescription") as string;
    const jobTitle = formData.get("jobTitle") as string;

    if (!jobDescription || !jobTitle) {
      return toast.error("All fields are required");
    }

    mutate({ resumeId, jobDescription, jobTitle });
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-6">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
              CVInsight AI Analysis
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Match Your Resume with{" "}
            <span className="text-emerald-500">Job Role</span>
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste job description and title. Our AI will analyze and give ATS insights.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-[2rem] p-8 md:p-10 space-y-6 shadow-xl"
        >



          {/* JOB TITLE */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 block">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              placeholder="e.g. Frontend Developer"
              className="w-full bg-background border-2 border-border rounded-xl p-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
            />
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 block">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              rows={8}
              placeholder="Paste full job description..."
              className="w-full bg-background border-2 border-border rounded-xl p-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
            />
          </div>


          {/* BUTTON */}
          <button
            type="submit"
            disabled={!resumeId || isPending}
            className={`w-full py-4 rounded-xl font-black text-sm tracking-widest transition-all flex justify-center items-center gap-2
              ${
                !resumeId || isPending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
              }`}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              "🚀 START ANALYSIS"
            )}
          </button>
        </form>

        {/* STEPS */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { step: "01", text: "Paste Job Description" },
            { step: "02", text: "AI Analysis" },
            { step: "03", text: "Get Results" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border p-4 rounded-xl flex items-center gap-4"
            >
              <span className="text-2xl font-black text-emerald-500 opacity-30">
                {item.step}
              </span>
              <span className="text-sm font-bold opacity-70">
                {item.text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}