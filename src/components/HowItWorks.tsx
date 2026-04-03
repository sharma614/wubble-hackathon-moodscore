"use client";

const STEPS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
      </svg>
    ),
    title: "1. Add Your Video",
    desc: "Paste a YouTube link or upload any short video clip. MoodScore works with any content.",
    color: "#06b6d4",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 13s1.5 2 5 2 5-2 5-2M9 9h.01M15 9h.01"/>
      </svg>
    ),
    title: "2. Describe the Mood",
    desc: "Choose a mood tag or type what vibe you want. Set genre, tempo, and energy to fine-tune.",
    color: "#a78bfa",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
      </svg>
    ),
    title: "3. Generate & Download",
    desc: "Hit Generate. Wubble AI composes an original royalty-free track — preview it, then download.",
    color: "#ec4899",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 lg:px-12 xl:px-20">
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400 mb-3">Simple Process</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How MoodScore works
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">
            Three simple steps to a perfectly matched, AI-generated soundtrack for any video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="glass-card p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}30` }}
              >
                {step.icon}
              </div>
              <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
