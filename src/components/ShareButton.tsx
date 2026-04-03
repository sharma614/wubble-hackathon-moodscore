"use client";

import { useState } from "react";

interface ShareButtonProps {
  mood: string;
  genre: string;
  tempo: string;
  energy: string;
  duration: number;
  description?: string;
}

export default function ShareButton({
  mood, genre, tempo, energy, duration, description,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const params = new URLSearchParams({
      mood,
      genre,
      tempo,
      energy,
      duration: String(duration),
      ...(description ? { desc: description } : {}),
    });

    const shareUrl = `${window.location.origin}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  return (
    <button
      id="share-settings-btn"
      onClick={handleShare}
      title="Copy shareable link with current settings"
      className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200 text-sm font-medium text-[var(--text-secondary)] hover:text-white"
    >
      {copied ? (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </>
      )}
    </button>
  );
}
