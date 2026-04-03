import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoodScore — AI Soundtrack Generator",
  description:
    "Paste a YouTube URL or upload a video, describe your vibe, and MoodScore generates a perfectly matched royalty-free soundtrack using AI.",
  keywords: [
    "AI music generator",
    "royalty-free music",
    "video soundtrack",
    "mood-based music",
    "Wubble API",
    "MoodScore",
  ],
  openGraph: {
    title: "MoodScore — AI Soundtrack Generator",
    description:
      "Generate the perfect royalty-free soundtrack for any video based on its mood.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
