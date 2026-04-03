"use client";

import { useState, useRef, useCallback } from "react";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";

interface VideoInputProps {
  onVideoReady: (data: { type: "youtube" | "upload"; videoId?: string; file?: File; thumbnailUrl?: string }) => void;
}

export default function VideoInput({ onVideoReady }: VideoInputProps) {
  const [activeTab, setActiveTab] = useState<"youtube" | "upload">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (val: string) => {
    setYoutubeUrl(val);
    setUrlError("");
    setUrlValid(false);

    if (!val.trim()) return;

    const id = extractYouTubeId(val.trim());
    if (id) {
      setUrlValid(true);
      onVideoReady({
        type: "youtube",
        videoId: id,
        thumbnailUrl: getYouTubeThumbnail(id, "high"),
      });
    } else if (val.length > 10) {
      setUrlError("Please enter a valid YouTube URL");
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file);
      onVideoReady({ type: "upload", file });
    }
  }, [onVideoReady]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onVideoReady({ type: "upload", file });
    }
  };

  return (
    <div className="glass-card p-1 mb-6">
      {/* Tab switcher */}
      <div className="flex p-1 bg-white/5 rounded-2xl mb-1">
        {(["youtube", "upload"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-violet-600/80 to-pink-600/60 text-white shadow-lg shadow-violet-900/30"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            {tab === "youtube" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.762 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
                </svg>
                YouTube URL
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Upload Video
              </>
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === "youtube" ? (
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                id="youtube-url-input"
                type="url"
                className="input-field pl-11 pr-12"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              {urlValid && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              )}
            </div>
            {urlError && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {urlError}
              </p>
            )}
            {urlValid && youtubeUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative group w-full max-w-sm" style={{ aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getYouTubeThumbnail(extractYouTubeId(youtubeUrl) || "", "high")}
                  alt="YouTube preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-white/90 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md font-medium border border-white/10 shadow-lg">
                  ✓ Video detected
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                : uploadedFile
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/15 hover:border-violet-500/40 hover:bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">{uploadedFile.name}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Click to change
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Drop your video here</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse · MP4, MOV, WebM</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
