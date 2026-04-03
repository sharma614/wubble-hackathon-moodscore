"use client";

export const MOOD_TAGS = [
  { label: "🌊 Calm", value: "calm", color: "#06b6d4" },
  { label: "🔥 Epic", value: "epic", color: "#f97316" },
  { label: "✨ Inspirational", value: "inspirational", color: "#a78bfa" },
  { label: "😊 Happy", value: "happy", color: "#fbbf24" },
  { label: "🌧️ Melancholic", value: "melancholic", color: "#60a5fa" },
  { label: "⚡ Energetic", value: "energetic", color: "#f43f5e" },
  { label: "🎬 Cinematic", value: "cinematic", color: "#8b5cf6" },
  { label: "🌙 Dark", value: "dark", color: "#475569" },
  { label: "🌿 Chill", value: "chill", color: "#34d399" },
  { label: "💫 Dreamy", value: "dreamy", color: "#c084fc" },
  { label: "🎷 Jazz", value: "jazz", color: "#d97706" },
  { label: "🤖 Futuristic", value: "futuristic", color: "#22d3ee" },
];

export const GENRE_OPTIONS = [
  "Orchestral", "Electronic", "Lo-fi", "Acoustic", "Ambient",
  "Hip-hop", "Jazz", "Pop", "Rock", "Synthwave",
];

export const TEMPO_OPTIONS = [
  { label: "Slow", value: "slow" },
  { label: "Medium", value: "medium" },
  { label: "Fast", value: "fast" },
];

export const ENERGY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  tempo: string;
  onTempoChange: (v: string) => void;
  energy: string;
  onEnergyChange: (v: string) => void;
  userDescription: string;
  onDescriptionChange: (v: string) => void;
  duration: number;
  onDurationChange: (v: number) => void;
}

export default function MoodSelector({
  selectedMood,
  onMoodChange,
  selectedGenre,
  onGenreChange,
  tempo,
  onTempoChange,
  energy,
  onEnergyChange,
  userDescription,
  onDescriptionChange,
  duration,
  onDurationChange,
}: MoodSelectorProps) {
  return (
    <div className="glass-card p-6 mb-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-widest">
          Describe the Vibe
        </label>
        <textarea
          id="vibe-description"
          className="input-field resize-none"
          rows={3}
          placeholder="e.g. 'Uplifting sunrise timelapse with a sense of wonder and possibility...'"
          value={userDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          maxLength={300}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-[var(--text-muted)]">{userDescription.length}/300</span>
        </div>
      </div>

      {/* Mood tags */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-widest">
          Select Mood
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => (
            <button
              key={tag.value}
              id={`mood-${tag.value}`}
              onClick={() => onMoodChange(tag.value === selectedMood ? "" : tag.value)}
              className={`mood-tag ${selectedMood === tag.value ? "active" : ""}`}
              style={
                selectedMood === tag.value
                  ? {
                      borderColor: tag.color + "80",
                      background: `${tag.color}18`,
                      color: tag.color,
                    }
                  : {}
              }
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-widest">
          Genre
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <button
              key={g}
              id={`genre-${g.toLowerCase()}`}
              onClick={() => onGenreChange(g === selectedGenre ? "" : g)}
              className={`mood-tag text-xs ${selectedGenre === g ? "active" : ""}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Tempo + Energy + Duration row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tempo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
            Tempo
          </label>
          <div className="flex gap-2">
            {TEMPO_OPTIONS.map((t) => (
              <button
                key={t.value}
                id={`tempo-${t.value}`}
                onClick={() => onTempoChange(t.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  tempo === t.value
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : "border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
            Energy
          </label>
          <div className="flex gap-2">
            {ENERGY_OPTIONS.map((e) => (
              <button
                key={e.value}
                id={`energy-${e.value}`}
                onClick={() => onEnergyChange(e.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  energy === e.value
                    ? "border-pink-500 bg-pink-500/20 text-pink-300"
                    : "border-white/10 bg-white/5 text-[var(--text-muted)] hover:border-white/20"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
            Duration: {duration}s
          </label>
          <input
            id="duration-slider"
            type="range"
            min={15}
            max={120}
            step={15}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
              height: "6px",
              borderRadius: "6px",
              background: `linear-gradient(to right, #7c3aed ${((duration - 15) / 105) * 100}%, rgba(255,255,255,0.1) ${((duration - 15) / 105) * 100}%)`,
              outline: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>15s</span><span>60s</span><span>120s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
