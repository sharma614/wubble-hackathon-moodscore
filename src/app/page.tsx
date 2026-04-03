"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VideoInput from "@/components/VideoInput";
import MoodSelector from "@/components/MoodSelector";
import GenerateButton from "@/components/GenerateButton";
import TrackPlayer from "@/components/TrackPlayer";
import HowItWorks from "@/components/HowItWorks";
import HistoryPanel, { saveToHistory, HistoryItem } from "@/components/HistoryPanel";
import ShareButton from "@/components/ShareButton";

interface VideoData {
  type: "youtube" | "upload";
  videoId?: string;
  file?: File;
  thumbnailUrl?: string;
}

interface GeneratedTrack {
  id: string;
  audioUrl: string;
  prompt: string;
  mood: string;
  duration?: number;
}

const LOADING_STEPS = [
  "Analyzing your video…",
  "Understanding the mood…",
  "Composing original music…",
  "Adding finishing touches…",
  "Almost ready…",
];

const MOOD_EMOJIS: Record<string, string> = {
  calm: "😌", epic: "⚡", inspirational: "✨", happy: "😄",
  melancholic: "🌧️", energetic: "🔥", cinematic: "🎬", dark: "🌑",
  chill: "🎵", dreamy: "💭", jazz: "🎷", futuristic: "🚀",
};

function HomePageInner() {
  const searchParams = useSearchParams();

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [userDescription, setUserDescription] = useState(() => searchParams.get("desc") || "");
  const [selectedMood, setSelectedMood] = useState(() => searchParams.get("mood") || "cinematic");
  const [selectedGenre, setSelectedGenre] = useState(() => searchParams.get("genre") || "Orchestral");
  const [tempo, setTempo] = useState(() => searchParams.get("tempo") || "medium");
  const [energy, setEnergy] = useState(() => searchParams.get("energy") || "medium");
  const [duration, setDuration] = useState(() => parseInt(searchParams.get("duration") || "30", 10));

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);

  const [variations, setVariations] = useState<GeneratedTrack[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [generateCount, setGenerateCount] = useState(1);

  const activeTrack = variations.length > 0 ? variations[selectedVariation] : generatedTrack;

  const [shareNotice, setShareNotice] = useState(false);
  useEffect(() => {
    if (searchParams.get("mood")) {
      setShareNotice(true);
      setTimeout(() => setShareNotice(false), 4000);
    }
  }, [searchParams]);

  const handleVideoReady = useCallback((data: VideoData) => {
    setVideoData(data);
    setError("");
  }, []);

  const pollTrackStatus = async (trackId: string, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fetch(`/api/generate-music?id=${trackId}`);
      const data = await res.json();
      if (data.status === "completed" && data.audio_url) return data;
      if (data.status === "failed") throw new Error(data.error || "Track generation failed");
      const stepIdx = Math.min(Math.floor((i / maxAttempts) * LOADING_STEPS.length), LOADING_STEPS.length - 1);
      setLoadingStep(LOADING_STEPS[stepIdx]);
    }
    throw new Error("Generation timed out. Please try again.");
  };

  const generateOne = async () => {
    const genRes = await fetch("/api/generate-music", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userDescription, selectedMood, genre: selectedGenre, tempo, energy, duration,
        videoContext: videoData?.videoId ? `YouTube video ID: ${videoData.videoId}` : "",
      }),
    });
    if (!genRes.ok) {
      const errData = await genRes.json();
      throw new Error(errData.error || "Failed to start music generation");
    }
    const genData = await genRes.json();
    const completed = await pollTrackStatus(genData.id);
    return {
      id: genData.id, audioUrl: completed.audio_url, prompt: genData.prompt || "",
      mood: selectedMood, duration: completed.duration || duration,
    } as GeneratedTrack;
  };

  const handleGenerate = async () => {
    setError("");
    if (!selectedMood && !userDescription.trim()) {
      setError("Please select a mood or describe the vibe you want.");
      return;
    }
    setIsLoading(true);
    setGeneratedTrack(null);
    setVariations([]);
    setSelectedVariation(0);
    setLoadingStep(LOADING_STEPS[0]);
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        const idx = LOADING_STEPS.indexOf(prev);
        return LOADING_STEPS[Math.min(idx + 1, LOADING_STEPS.length - 2)];
      });
    }, 2500);
    try {
      if (generateCount === 1) {
        const track = await generateOne();
        setGeneratedTrack(track);
        saveToHistory({
          id: track.id, audioUrl: track.audioUrl,
          trackTitle: `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Soundtrack`,
          mood: selectedMood, genre: selectedGenre, prompt: track.prompt,
          createdAt: Date.now(), duration: track.duration,
        });
      } else {
        const [v1, v2, v3] = await Promise.all([generateOne(), generateOne(), generateOne()]);
        const vars = [v1, v2, v3];
        setVariations(vars);
        saveToHistory({
          id: v1.id, audioUrl: v1.audioUrl,
          trackTitle: `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Soundtrack`,
          mood: selectedMood, genre: selectedGenre, prompt: v1.prompt,
          createdAt: Date.now(), duration: v1.duration,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setGeneratedTrack({ id: item.id, audioUrl: item.audioUrl, prompt: item.prompt, mood: item.mood, duration: item.duration });
    setVariations([]);
    setSelectedMood(item.mood);
    setSelectedGenre(item.genre);
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1, overflowX: 'hidden' }}>

      {/* Background orbs */}
      <div className="orb" style={{ width: 700, height: 700, top: "-200px", left: "50%", transform: "translateX(-60%)", background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)", animationDuration: "12s" }} />
      <div className="orb" style={{ width: 500, height: 500, top: "40%", right: "-150px", background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)", animationDuration: "15s", animationDelay: "3s" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: "10%", left: "-100px", background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", animationDuration: "18s", animationDelay: "6s" }} />

      <Header />

      {/* Share notice */}
      {shareNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl slide-up flex items-center gap-2 border" style={{ background: "rgba(109,40,217,0.9)", borderColor: "rgba(167,139,250,0.5)", backdropFilter: "blur(20px)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Mood settings loaded from shared link!
        </div>
      )}

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6 text-center flex flex-col items-center" style={{ zIndex: 2 }}>
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border" style={{ background: "rgba(109,40,217,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#c4b5fd" }}>
          <span className="w-2 h-2 rounded-full bg-violet-400" style={{ animation: "pulse-glow 2s infinite" }} />
          AI-Powered · Royalty-Free · Instant
        </div>

        <h1 className="font-black tracking-tight mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1.05 }}>
          The perfect<br />
          <span className="gradient-text">soundtrack</span><br />
          for any video.
        </h1>

        <p className="text-lg max-w-lg mx-auto leading-relaxed mb-12" style={{ color: "#94a3b8" }}>
          Paste a YouTube URL, describe the vibe — MoodScore generates a perfectly matched, royalty-free track in seconds.
        </p>

        {/* Animated waveform decoration — use deterministic values (no Math.random) to avoid SSR hydration mismatch */}
        <div className="flex items-end justify-center gap-1 h-12 mb-4" style={{ opacity: 0.5 }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: `${12 + Math.sin(i * 0.7) * 16 + 8}px`,
                animationDelay: `${i * 0.07}s`,
                animationDuration: `${1.2 + Math.abs(Math.sin(i * 1.3)) * 0.4}s`,
                opacity: 0.5 + Math.sin(i * 0.5) * 0.5,
              }}
            />
          ))}
        </div>
      </section>

      {/* ─── MAIN APP AREA ─────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 xl:px-20 pb-20 w-full" style={{ zIndex: 2 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">

            {/* LEFT — Main generator card */}
            <div className="app-main-card overflow-hidden">
              {/* Card top bar */}
              <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-6">
                  {["Add Video", "Set Mood", "Generate"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2.5">
                      {i > 0 && <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.1)" }} />}
                      <div className="step-badge">{i + 1}</div>
                      <span className="text-sm font-semibold hidden sm:block" style={{ color: "#94a3b8" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <HistoryPanel onSelect={handleHistorySelect} currentId={activeTrack?.id} />
              </div>

              <div className="p-8">
                {/* Video Input */}
                <VideoInput onVideoReady={handleVideoReady} />

                {/* Mood & Settings */}
                <MoodSelector
                  selectedMood={selectedMood} onMoodChange={setSelectedMood}
                  selectedGenre={selectedGenre} onGenreChange={setSelectedGenre}
                  tempo={tempo} onTempoChange={setTempo}
                  energy={energy} onEnergyChange={setEnergy}
                  userDescription={userDescription} onDescriptionChange={setUserDescription}
                  duration={duration} onDurationChange={setDuration}
                />

                {/* Variation count */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Generate</span>
                  {[1, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setGenerateCount(n)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        generateCount === n
                          ? "border-violet-500/60 text-violet-300"
                          : "text-[var(--text-muted)] hover:border-white/20 hover:text-white"
                      }`}
                      style={{
                        background: generateCount === n ? "rgba(109,40,217,0.2)" : "rgba(255,255,255,0.03)",
                        borderColor: generateCount === n ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)",
                      }}
                    >
                      {n === 1 ? "1 track" : "3 variations"}
                    </button>
                  ))}
                  {generateCount === 3 && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>— pick your favourite</span>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 px-5 py-4 rounded-2xl flex items-start gap-3 slide-up" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#fca5a5" }}>Generation failed</p>
                      <p className="text-xs mt-0.5" style={{ color: "#f87171", opacity: 0.8 }}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <GenerateButton onClick={handleGenerate} isLoading={isLoading} isDisabled={isLoading} loadingStep={loadingStep} />

                {/* Variations picker */}
                {variations.length > 1 && (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Choose a variation</p>
                    <div className="grid grid-cols-3 gap-3">
                      {variations.map((v, i) => (
                        <button
                          key={v.id} onClick={() => setSelectedVariation(i)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200"
                          style={{
                            background: selectedVariation === i ? "rgba(109,40,217,0.2)" : "rgba(255,255,255,0.03)",
                            borderColor: selectedVariation === i ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.08)",
                            color: selectedVariation === i ? "#c4b5fd" : "var(--text-muted)",
                          }}
                        >
                          <span className="text-lg">{MOOD_EMOJIS[v.mood] || "🎵"}</span>
                          <span>Take {i + 1}</span>
                          {selectedVariation === i && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#a78bfa" className="ml-auto"><path d="M20 6L9 17l-5-5"/></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Track Player */}
                {activeTrack && (
                  <div className="mt-8 slide-up">
                    <div className="flex items-center gap-3 mb-5">
                      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {variations.length > 1 ? `Variation ${selectedVariation + 1}` : "Generated Track"}
                      </span>
                      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                    </div>
                    <TrackPlayer
                      audioUrl={activeTrack.audioUrl}
                      trackTitle={`${activeTrack.mood ? activeTrack.mood.charAt(0).toUpperCase() + activeTrack.mood.slice(1) : "Custom"} Soundtrack`}
                      prompt={activeTrack.prompt}
                      mood={activeTrack.mood}
                      duration={activeTrack.duration}
                    />
                    <div className="mt-4 flex justify-end">
                      <ShareButton mood={selectedMood} genre={selectedGenre} tempo={tempo} energy={energy} duration={duration} description={userDescription} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <div className="hidden xl:flex flex-col gap-5 sticky top-28">

              {/* Current Settings */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div style={{ position: "absolute", top: 0, right: 0, width: 140, height: 140, background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(109,40,217,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  </div>
                  <h3 className="text-sm font-bold text-white">Current Settings</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Mood", value: selectedMood },
                    { label: "Genre", value: selectedGenre },
                    { label: "Tempo", value: tempo },
                    { label: "Energy", value: energy },
                    { label: "Duration", value: `${duration}s` },
                  ].map(({ label, value }) => (
                    <div key={label} className="settings-row">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span className="text-xs font-bold text-white capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="glass-card p-5 relative overflow-hidden">
                <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  </div>
                  <h3 className="text-sm font-bold text-white">Quick Tips</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Select a mood first — it shapes everything.",
                    "Use 3 variations to A/B test vibes.",
                    "Duration should match your video length.",
                    "Paste a YouTube URL for better context.",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22d3ee", opacity: 0.7 }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="glass-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Platform Stats</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "12+", label: "Moods" },
                    { val: "10", label: "Genres" },
                    { val: "∞", label: "Royalty-Free" },
                    { val: "< 10s", label: "Generation" },
                  ].map(({ val, label }) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-lg font-black gradient-text">{val}</p>
                      <p className="text-[11px] mt-0.5 font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How it Works */}
      <HowItWorks />

      <section className="px-6 lg:px-12 xl:px-20 pb-28 relative" style={{ zIndex: 2 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
              Everything you need
            </div>
            <h2 className="text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Built for <span className="gradient-text">creators</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🎵", title: "AI Composition", desc: "Wubble AI generates original, never-before-heard music tailored to your exact vibe.", color: "#a78bfa" },
              { icon: "⚡", title: "Instant Results", desc: "From description to downloadable track in under 60 seconds.", color: "#fbbf24" },
              { icon: "✅", title: "100% Royalty-Free", desc: "Every generated track is commercially safe — use it anywhere, forever.", color: "#34d399" },
              { icon: "🎬", title: "Video-Aware", desc: "Paste a YouTube URL and let the AI understand the context of your content.", color: "#60a5fa" },
              { icon: "🎛️", title: "Fine-Tune Controls", desc: "Adjust mood, genre, tempo, energy, and duration for the perfect match.", color: "#f97316" },
              { icon: "🕐", title: "Track History", desc: "All your generated tracks are saved locally — revisit and replay anytime.", color: "#22d3ee" },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300 cursor-default" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 lg:px-12 xl:px-20 py-10" style={{ borderColor: "rgba(255,255,255,0.06)", zIndex: 2, position: "relative" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }} className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 11.5v-7l5 3.5-5 3.5z" fill="white"/></svg>
            </div>
            <span className="font-black text-lg tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Mood<span className="gradient-text">Score</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(109,40,217,0.15)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)" }}>Wubble Hackathon</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            <a href="https://wubble.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Wubble AI</a>
            <a href="https://github.com/sharma614/wubble-hackathon-moodscore" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <span>MIT © 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInner />
    </Suspense>
  );
}
