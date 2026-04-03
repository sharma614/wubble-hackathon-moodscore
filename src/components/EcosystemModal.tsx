"use client";

import { useEffect } from "react";

interface EcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EcosystemModal({ isOpen, onClose }: EcosystemModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const workflows = [
    {
      title: "Twitch Hype Analyzer",
      description: "Custom agent that listens to stream audio levels and chat speed, dynamically shifting Wubble AI's background generation from chill to energetic in real-time.",
      tags: ["Agent", "Real-Time"],
      color: "#a855f7" // purple
    },
    {
      title: "Premiere Pro Orchestrator",
      description: "Workflow that scans timeline markers or reads color grading LUT metadata, piping structured prompts into Wubble to score an entire 10-minute short film instantly.",
      tags: ["Workflow", "Integration"],
      color: "#ec4899" // pink
    },
    {
      title: "Custom Brand Fine-Tuner",
      description: "Upload 5 of your brand's existing commercial songs. This agent fine-tunes a persistent taste profile so all future Wubble generations strictly match your brand identity.",
      tags: ["Profile", "Brand"],
      color: "#06b6d4" // cyan
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border rounded-3xl p-8" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)" }}>
            <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-xl" />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">The Wubble Developer Ecosystem</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            MoodScore isn't just an app—it's built on a foundation designed for extendability. 
            Imagine building custom agents, automated workflows, and complex integrations that tap into the core Wubble generation engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <div key={wf.title} className="glass-card-glow p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
               <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${wf.color}20 0%, transparent 70%)`, pointerEvents: "none" }} />
               
               <div className="flex gap-2 mb-4">
                 {wf.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: wf.color }}>
                      {tag}
                    </span>
                 ))}
               </div>

               <h3 className="text-xl font-bold text-white mb-3 leading-tight">{wf.title}</h3>
               <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                 {wf.description}
               </p>

               <div className="mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-xs font-semibold flex items-center gap-2" style={{ color: wf.color }}>
                   View the API Docs <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </button>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl text-center" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.1), rgba(236,72,153,0.1))", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 className="text-lg font-bold text-white mb-2">Want to build your own?</h4>
          <p className="text-sm text-[var(--text-muted)] mb-4 max-w-xl mx-auto">
            Get early access to our open dev layer. Build headless music generation directly into your own tools.
          </p>
          <button className="btn-gradient px-8 py-3 rounded-xl font-bold text-sm tracking-wide text-white">
            Request API Access
          </button>
        </div>

      </div>
    </div>
  );
}
