import { NextRequest, NextResponse } from "next/server";

// POST /api/extract-mood — analyze a YouTube URL and suggest mood tags
// In a full implementation, this could use the YouTube Data API + an LLM
// to extract video metadata and suggest the best mood for the soundtrack.
export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY not configured for production use.");
    }

    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!ytResponse.ok) {
      throw new Error(`YouTube API failed: ${ytResponse.statusText}`);
    }

    const ytData = await ytResponse.json();

    if (!ytData.items || ytData.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const snippet = ytData.items[0].snippet;
    const title = snippet.title || "";
    // Note: In a fully-fledged production app, you would pass `title` and `snippet.description` to an LLM 
    // to dynamically extract the mood. For now, we perform a robust keyword analysis on the title and tags.
    const lowercaseText = `${title} ${snippet.tags?.join(" ") || ""}`.toLowerCase();

    const isSad = lowercaseText.includes("sad") || lowercaseText.includes("melancholy");
    const isEpic = lowercaseText.includes("epic") || lowercaseText.includes("action") || lowercaseText.includes("trailer");

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
      description: `Analyzed from real YouTube metadata for: ${title}`,
    };

    return NextResponse.json(suggestions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
