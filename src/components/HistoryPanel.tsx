"use client";

import { useState, useEffect } from "react";
import { formatDuration } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  audioUrl: string;
  trackTitle: string;
  mood: string;
  genre: string;
  prompt: string;
  createdAt: number;
  duration?: number;
}

const STORAGE_KEY = "moodscore_history";
const MAX_HISTORY = 20;

export function saveToHistory(item: HistoryItem) {
  try {
    const existing = getHistory();
    const updated = [item, ...existing.filter((h) => h.id !== item.id)].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

interface HistoryPanelProps {
  onSelect: (item: HistoryItem) => void;
  currentId?: string;
}

const MOOD_EMOJIS: Record<string, string> = {
  calm: "😌", epic: "⚡", inspirational: "✨", happy: "😄",
  melancholic: "🌧️", energetic: "🔥", cinematic: "🎬", dark: "🌑",
  chill: "🎵", dreamy: "💭", jazz: "🎷", futuristic: "🚀",
};

export default function HistoryPanel({ onSelect, currentId }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, [isOpen]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const handleRemove = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const [now] = useState(() => Date.now());

  const relativeTime = (ts: number) => {
    const diff = now - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        id="history-panel-btn"
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200 text-sm font-medium text-[var(--text-secondary)] hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        History
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
            {history.length > 9 ? "9+" : history.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 w-80 z-50 rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: "rgba(13, 13, 20, 0.97)", backdropFilter: "blur(30px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <span className="text-sm font-semibold text-white">Recent Tracks</span>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors px-2 py-1 rounded bg-white/5"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-y-auto max-h-80">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--text-muted)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <p className="text-xs">No tracks generated yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className={`group relative flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition-all duration-150 hover:bg-violet-500/10 ${
                    currentId === item.id ? "bg-violet-500/15 border-l-2 border-l-violet-500" : ""
                  }`}
                  onClick={() => { onSelect(item); setIsOpen(false); }}
                >
                  {/* Mood icon */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 to-pink-600/20 border border-violet-500/20 flex items-center justify-center text-base flex-shrink-0">
                    {MOOD_EMOJIS[item.mood] || "🎵"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{item.trackTitle}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      {item.genre} · {formatDuration(item.duration || 30)} · {relativeTime(item.createdAt)}
                    </p>
                  </div>

                  {/* Remove btn */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
