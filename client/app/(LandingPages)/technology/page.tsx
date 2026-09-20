import React from 'react';
import { Cpu, Search, ShieldCheck, Zap } from 'lucide-react';

export default function Technology() {
  return (
    <div className="min-h-screen bg-background pt-5 pb-20 px-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter italic">
              Driven by <br /><span className="text-emerald-500">Neural Logic.</span>
            </h1>
            <div className="space-y-8">
              {[
                { label: "Llama 3 Powered", desc: "State-of-the-art LLM for deep semantic understanding.", icon: <Cpu className="text-emerald-500" /> },
                { label: "Recruiter Pattern Matching", desc: "Algorithms trained on thousands of successful hiring cycles.", icon: <Search className="text-emerald-500" /> },
                { label: "Military-Grade Security", desc: "Your data is encrypted and never sold. Period.", icon: <ShieldCheck className="text-emerald-500" /> }
              ].map((tech, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">{tech.icon}</div>
                  <div>
                    <h4 className="font-bold text-xl">{tech.label}</h4>
                    <p className="text-slate-500">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3rem] aspect-square flex items-center justify-center shadow-2xl shadow-emerald-500/20">
             <div className="text-white text-center">
                <Zap size={100} fill="white" className="mx-auto mb-4 animate-pulse" />
                <p className="font-black text-2xl uppercase tracking-widest">Processing at <br /> 0.4s / Resume</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}