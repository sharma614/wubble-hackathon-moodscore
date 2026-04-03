"use client";

import { useEffect, useRef, useState } from "react";

interface WaveformVisualizerProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function WaveformVisualizer({
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  audioRef,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate static waveform bars (decorative when not connected to audio context)
  useEffect(() => {
    const bars = Array.from({ length: 60 }, (_, i) => {
      const x = i / 60;
      return 0.2 + 0.8 * Math.abs(Math.sin(x * Math.PI * 4) * Math.cos(x * Math.PI * 2.5));
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWaveformData(bars);
  }, [audioUrl]);

  // Connect Web Audio API analyser when playing
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audioRef.current);
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 128;
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAnalyzing(true);
      }

      if (ctx.state === "suspended") ctx.resume();
    } catch {
      // CORS or browser restriction — fall back to decorative bars
    }
  }, [isPlaying, audioRef]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx2d.clearRect(0, 0, width, height);

      const bars = 60;
      const barWidth = (width - bars * 2) / bars;
      const progress = duration > 0 ? currentTime / duration : 0;

      let dataArray: Uint8Array<ArrayBuffer> | null = null;
      if (analyserRef.current && isAnalyzing) {
        dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + 2);
        const isPlayed = i / bars <= progress;

        let heightFraction: number;
        if (dataArray && isPlaying) {
          const dataIdx = Math.floor((i / bars) * dataArray.length);
          heightFraction = (dataArray[dataIdx] / 255) * 0.9 + 0.1;
        } else {
          heightFraction = waveformData[i] || 0.3;
        }

        const barH = Math.max(4, heightFraction * height * 0.8);
        const y = (height - barH) / 2;

        const grad = ctx2d.createLinearGradient(0, y, 0, y + barH);
        if (isPlayed) {
          grad.addColorStop(0, "#a78bfa");
          grad.addColorStop(1, "#ec4899");
        } else {
          grad.addColorStop(0, "rgba(255,255,255,0.15)");
          grad.addColorStop(1, "rgba(255,255,255,0.05)");
        }

        ctx2d.fillStyle = grad;
        ctx2d.beginPath();
        ctx2d.roundRect(x, y, barWidth, barH, 2);
        ctx2d.fill();
      }

      if (isPlaying) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, currentTime, duration, waveformData, isAnalyzing]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    onSeek(pct * duration);
  };

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        width={600}
        height={64}
        className="w-full cursor-pointer rounded-lg"
        style={{ height: "64px" }}
        onClick={handleCanvasClick}
        title="Click to seek"
      />
    </div>
  );
}
