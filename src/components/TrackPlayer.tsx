"use client";

import { useState, useRef, useEffect } from "react";
import { formatDuration } from "@/lib/utils";
import WaveformVisualizer from "./WaveformVisualizer";

interface TrackPlayerProps {
  audioUrl: string;
  trackTitle?: string;
  isDemo?: boolean;
  prompt?: string;
  mood?: string;
  duration?: number;
}

export default function TrackPlayer({
  audioUrl,
  trackTitle = "Generated Soundtrack",
  isDemo = false,
  prompt,
  mood,
  duration = 30,
}: TrackPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
  }, [audioUrl]);

  const tick = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    animFrameRef.current = requestAnimationFrame(tick);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      animFrameRef.current = requestAnimationFrame(tick);
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = false;
    }
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    audioRef.current.muted = next;
    setIsMuted(next);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moodscore-${mood || "track"}-${Date.now()}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(audioUrl, "_blank");
    }
  };

  const skip = (secs: number) => {
    if (!audioRef.current) return;
    const next = Math.max(0, Math.min(audioDuration, currentTime + secs));
    audioRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className="glass-card-glow p-6 slide-up">
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin="anonymous"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration || duration);
            audioRef.current.volume = volume;
            setIsLoading(false);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        }}
        onError={() => setIsLoading(false)}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Animated equalizer icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/40 to-pink-600/30 border border-violet-500/30 flex items-center justify-center gap-[3px]">
            {isPlaying ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{ height: `${12 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">{trackTitle}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Royalty-free · MP3
              {isDemo && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                  Demo
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Download button */}
        <button
          id="download-track-btn"
          onClick={handleDownload}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200 text-sm font-medium text-[var(--text-secondary)] hover:text-white"
        >
          <svg
            width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="group-hover:translate-y-0.5 transition-transform"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download
        </button>
      </div>

      {/* Prompt used */}
      {prompt && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
            <span className="text-violet-400 font-medium">Prompt: </span>
            {prompt}
          </p>
        </div>
      )}

      {/* Waveform Visualizer */}
      <div className="mb-3">
        <WaveformVisualizer
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={audioDuration}
          onSeek={handleSeek}
          audioRef={audioRef}
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1.5">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(audioDuration))}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Rewind 10s */}
        <button
          onClick={() => skip(-10)}
          className="p-2 text-[var(--text-muted)] hover:text-white transition-colors"
          title="Rewind 10s"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V7l-4-4 4-4v2.08A9.01 9.01 0 0 1 12.5 3z"/>
            <text x="7.5" y="14" fontSize="5" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">10</text>
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          id="track-play-pause-btn"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-14 h-14 rounded-full btn-gradient flex items-center justify-center shadow-lg flex-shrink-0 disabled:opacity-40"
        >
          {isLoading ? (
            <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
              <path d="M12 3a9 9 0 019 9"/>
            </svg>
          ) : isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Forward 10s */}
        <button
          onClick={() => skip(10)}
          className="p-2 text-[var(--text-muted)] hover:text-white transition-colors"
          title="Forward 10s"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
            <path d="M12.5 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V7l-4-4 4-4v2.08A9.01 9.01 0 0 1 12.5 3z"/>
            <text x="7.5" y="14" fontSize="5" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">10</text>
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Volume control */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={toggleMute} className="text-[var(--text-muted)] hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              {!isMuted && effectiveVolume > 0.5 && <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>}
              {!isMuted && effectiveVolume > 0 && effectiveVolume <= 0.5 && <path d="M15.54 8.46a5 5 0 010 7.07"/>}
              {(isMuted || effectiveVolume === 0) && (
                <>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </>
              )}
            </svg>
          </button>
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
              height: "4px",
              borderRadius: "4px",
              background: `linear-gradient(to right, #8b5cf6 ${effectiveVolume * 100}%, rgba(255,255,255,0.1) ${effectiveVolume * 100}%)`,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
}
