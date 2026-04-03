import { NextRequest, NextResponse } from "next/server";

// POST /api/extract-mood — analyze a YouTube URL and suggest mood tags
// In a full implementation, this could use the YouTube Data API + an LLM
// to extract video metadata and suggest the best mood for the soundtrack.
export async function POST(req: NextRequest) {
  try {
    const { videoId, url } = await req.json();

    if (!videoId && !url) {
      return NextResponse.json({ error: "Missing videoId or url" }, { status: 400 });
    }

    // Enhanced Mock for YT Data API integration
    // If we had a YouTube API key, we'd fetch snippet & tags here.
    const isSad = url?.toLowerCase().includes("sad") || videoId?.includes("s");
    const isEpic = url?.toLowerCase().includes("epic") || videoId?.includes("e");

    const baseMoods = isSad 
      ? ["Melancholic", "Dark", "Calm"]
      : isEpic
      ? ["Epic", "Cinematic", "Energetic"]
      : ["Happy", "Chill", "Inspirational"];

    const suggestions = {
      moods: baseMoods,
      genre: isSad ? "Ambient" : isEpic ? "Orchestral" : "Pop",
      tempo: isSad ? "slow" : isEpic ? "fast" : "medium",
      energy: isSad ? "low" : isEpic ? "high" : "medium",
      description:
        `Video metadata mock analyzed. Suggested moods based on URL patterns (${baseMoods.join(", ")}).`,
      demo: true,
    };

    return NextResponse.json(suggestions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
