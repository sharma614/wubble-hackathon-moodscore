"use client";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  loadingStep?: string;
}

export default function GenerateButton({
  onClick,
  isLoading,
  isDisabled,
  loadingStep,
}: GenerateButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        id="generate-soundtrack-btn"
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className="btn-gradient w-full py-5 rounded-2xl font-bold text-lg tracking-wide relative overflow-hidden"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="relative flex h-5 w-5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"
                style={{ animation: "ping-slow 1.2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
              />
              <span className="relative inline-flex rounded-full h-5 w-5 border-2 border-white border-t-transparent animate-spin" />
            </span>
            {loadingStep || "Composing your soundtrack…"}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
            </svg>
            Generate Soundtrack
          </span>
        )}
      </button>

      {isLoading && (
        <div className="w-full space-y-2 slide-up">
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{loadingStep || "Generating…"}</span>
            <span className="text-violet-400 animate-pulse">AI composing…</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden progress-shimmer">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                animation: "progress-fill 3s ease-in-out infinite alternate",
                width: "60%",
              }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-[var(--text-muted)] text-center">
        Powered by{" "}
        <a
          href="https://wubble.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          Wubble AI
        </a>{" "}
        · 100% royalty-free · Commercial use allowed
      </p>
    </div>
  );
}
