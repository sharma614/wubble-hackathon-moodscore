"use client";

import { useState, useEffect } from "react";
import EcosystemModal from "./EcosystemModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(5,5,8,0.85)] backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="px-6 lg:px-12 xl:px-20 py-4 flex items-center justify-between" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 opacity-80" />
            <div className="absolute inset-0 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 11.5v-7l5 3.5-5 3.5z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Mood<span className="gradient-text">Score</span>
            </span>
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105"
            style={{ borderColor: "rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.1)", color: "#f472b6" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Dev Ecosystem
          </button>
          
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Wubble Hackathon
          </span>
          <a
            href="https://github.com/sharma614/wubble-hackathon-moodscore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            GitHub
          </a>
        </div>
      </div>
      
      {/* Dev Ecosystem Modal overlay */}
      <EcosystemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
