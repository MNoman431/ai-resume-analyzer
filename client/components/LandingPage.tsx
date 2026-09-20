import UploadPage from '@/app/(resume)/upload/uplaod';
import React from 'react';

const LandingPage = () => {
    // throw new Error("Testing my cool error page!");
  return (
    /* bg-background aur text-foreground aapke CSS variables se link hain */
    <div className="w-full h-full bg-background text-foreground  pt-5 pb-16 px-6 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Next-Gen AI Analysis
          </span>
        </div>

        <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-6">
          Transform Your Resume with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            Precision AI Analysis
          </span>
        </h1>

        <p className="text-sm md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Stop guessing why your applications are ignored. Our proprietary AI engine audits your resume against hundreds of recruiter patterns to ensure 100% ATS visibility.
        </p>

        {/* --- MAIN ACTION / DROPZONE MOCKUP --- */}
        <div className="mt-16 max-w-4xl h-full mx-auto">
          <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-teal-400 shadow-2xl shadow-emerald-500/20">
            {/* Yahan bg-background dark mode mein automatically dark ho jaye ga */}
            <div className="bg-background rounded-[2.3rem] p-6 flex flex-col items-center border-4 border-dashed border-border hover:border-emerald-400 transition-all cursor-pointer">
              
              <h3 className="text-2xl font-bold mb-2">Drop your resume here</h3>
              <p className="text-slate-500 pb-3 dark:text-slate-400">For Analyze</p>
              
              <UploadPage/>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
        {[
          { 
            title: "Predictive ATS Scoring", 
            desc: "Understand how algorithms rank you before you even hit 'Apply'.",
            icon: "📊"
          },
          { 
            title: "Semantic Keyword Mapping", 
            desc: "Automatically detect missing skills based on modern job descriptions.",
            icon: "🔍"
          },
          { 
            title: "Bullet-Point Optimizer", 
            desc: "AI-generated action verbs and metrics to showcase your impact.",
            icon: "⚡"
          }
        ].map((feat, i) => (
          /* bg-card aur border-border ka use */
          <div key={i} className="p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300">
            <div className="text-4xl mb-6">{feat.icon}</div>
            <h4 className="text-xl font-bold mb-3">{feat.title}</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;