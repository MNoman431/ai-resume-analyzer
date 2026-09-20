import React from "react";
import Link from "next/link";
import { Search, MapPinOff, ArrowRight } from "lucide-react";

export default function NoFound(): React.ReactElement {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 text-center transition-colors duration-300">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-600/20 blur-3xl rounded-full"></div>
        <MapPinOff size={100} className="text-emerald-600 relative z-10 animate-bounce" />
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-foreground">
        You are <span className="text-emerald-600">Off-Track.</span>
      </h1>

      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
        This page is like a resume without contact info—completely unreachable. Lets get you back to the main stage.
      </p>

      <Link
        href="/"
        className="group flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all active:scale-95"
      >
        Back to Dashboard
        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
      </Link>

      <div className="mt-16 flex items-center gap-2 text-slate-400 font-medium">
        <Search size={16} />
        <span className="text-sm tracking-wide">Lost? Double-check the URL for any typos.</span>
      </div>
    </div>
  );
}