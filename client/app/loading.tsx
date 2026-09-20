import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 transition-colors duration-300">
      
      {/* --- LOGO ANIMATION --- */}
      <div className="relative mb-12">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 bg-emerald-600/20 blur-2xl rounded-full animate-pulse"></div>
        
        {/* The Animated Logo Box */}
        <div className="relative w-20 h-20 bg-emerald-600 rounded-4xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-emerald-500/40 animate-bounce">
          R
        </div>
      </div>

      {/* --- SKELETON MOCKUP (Professional Feel) --- */}
      <div className="w-full max-w-md space-y-4">
        {/* Main Heading Skeleton */}
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 mx-auto animate-pulse"></div>
        
        {/* Subtext Skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2 mx-auto animate-pulse opacity-60"></div>

        {/* Action Button Skeleton */}
        <div className="mt-10 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full animate-pulse"></div>
      </div>

      {/* --- FUNNY STATUS TEXT --- */}
      <div className="mt-12 text-center">
        <p className="text-lg font-bold text-foreground animate-pulse tracking-tight">
          AI is reading between the lines...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
          Finding the keywords you forgot to include.
        </p>
      </div>

      {/* --- SPINNER (Bottom) --- */}
      <div className="mt-8">
        <div className="w-8 h-8 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>

    </div>
  );
}