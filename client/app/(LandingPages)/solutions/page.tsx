import React from 'react';
import { Target, Users, Briefcase, GraduationCap } from 'lucide-react';

export default function Solutions() {
  const solutions = [
    { title: "Job Seekers", desc: "Beat the ATS and land interviews at top-tier companies.", icon: <Briefcase /> },
    { title: "Career Switchers", desc: "Highlight transferable skills for a smooth industry transition.", icon: <Target /> },
    { title: "Fresh Graduates", desc: "Optimize entry-level resumes to stand out from the crowd.", icon: <GraduationCap /> },
    { title: "Recruiters", desc: "Quickly verify if candidates meet the semantic job requirements.", icon: <Users /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-5 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Tailored <span className="text-emerald-500">Solutions.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-16">
          Whether you are a seasoned pro or just starting out, our AI adapts to your career stage.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-card border border-border hover:border-emerald-500 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}