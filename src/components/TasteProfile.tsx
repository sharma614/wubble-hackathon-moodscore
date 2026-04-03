"use client";

import { useEffect, useState } from "react";

interface TasteProfileProps {
  recentMood?: string;
  recentGenre?: string;
  generateCount: number;
}

export default function TasteProfile({ recentMood, recentGenre, generateCount }: TasteProfileProps) {
  const [stats, setStats] = useState([
    { label: "Cinematic Affinity", value: 65, color: "#8b5cf6" }, // Violet
    { label: "High Energy Ratio", value: 40, color: "#ec4899" }, // Pink
    { label: "Ambient Tolerance", value: 75, color: "#06b6d4" }, // Cyan
  ]);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Animate changes when the user generates something new
  useEffect(() => {
    if (generateCount === 0) return;

    setStats((currentStats) => {
      return currentStats.map((stat) => {
        let delta = 0;
        
        // Dynamically shift stats based on what they are generating
        if (stat.label === "Cinematic Affinity" && (recentMood === "epic" || recentGenre === "cinematic")) {
          delta = 15;
        } else if (stat.label === "High Energy Ratio" && (recentMood === "energetic" || recentGenre === "rock")) {
          delta = 20;
        } else if (stat.label === "Ambient Tolerance" && (recentMood === "chill" || recentGenre === "ambient")) {
          delta = 15;
        } else {
          // Slight decay/random drift for unused traits
          delta = Math.random() > 0.5 ? -5 : 2;
        }

        // Clamp between 10 and 95
        const newValue = Math.max(10, Math.min(95, stat.value + delta));
        return { ...stat, value: newValue };
      });
    });

    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [generateCount, recentMood, recentGenre]);

  return (
    <div className="glass-card p-6 relative overflow-hidden slide-up">
      <div style={{ position: "absolute", top: 0, right: 0, width: 140, height: 140, background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}>
            <div className="absolute inset-0 bg-pink-500/20 animate-pulse" style={{ animationDuration: '3s' }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Taste DNA</h3>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Producer Profile</p>
          </div>
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-pink-400 font-medium px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 animate-fade-in">
            Updating...
          </span>
        )}
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="group">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[var(--text-secondary)] group-hover:text-white transition-colors">{stat.label}</span>
              <span className="font-bold font-mono" style={{ color: stat.color }}>{Math.round(stat.value)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${stat.value}%`,
                  background: stat.color,
                  boxShadow: `0 0 10px ${stat.color}40`
                }}
              >
                <div className="absolute top-0 right-0 w-4 h-full bg-white/30 blur-[2px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-white/5 flex items-start gap-2">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="mt-0.5 flex-shrink-0">
           <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
         </svg>
         <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
           Wubble is implicitly learning your workflow. Generations are currently biased toward <strong className="text-white">ambient textures</strong> based on your download history.
         </p>
      </div>
    </div>
  );
}
