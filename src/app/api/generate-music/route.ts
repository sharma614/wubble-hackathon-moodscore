import { NextRequest, NextResponse } from "next/server";
import {
  generateMusicWithWubble,
  getWubbleTrackStatus,
  buildMusicPrompt,
  WubbleGenerateRequest,
} from "@/lib/wubble";

// POST /api/generate-music
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userDescription,
      selectedMood,
      genre,
      tempo,
      energy,
      videoContext,
      duration = 30,
    } = body;

    if (!userDescription && !selectedMood) {
      return NextResponse.json(
        { error: "Please provide a mood description or select a mood tag." },
        { status: 400 }
      );
    }

    const prompt = buildMusicPrompt({
      userDescription: userDescription || "",
      selectedMood: selectedMood || "neutral",
      videoContext: videoContext || "",
      genre,
      tempo,
      energy,
    });

    const generateParams: WubbleGenerateRequest = {
      prompt,
      mood: selectedMood,
      genre: genre || "cinematic",
      duration: Math.min(Math.max(duration, 15), 120),
      tempo: tempo || "medium",
      energy: energy || "medium",
    };

    const result = await generateMusicWithWubble(generateParams);

    return NextResponse.json({
      id: result.id,
      status: result.status,
      audio_url: result.audio_url,
      prompt,
    });
  } catch (err: unknown) {
    console.error("[generate-music] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/generate-music?id=xxx — poll track status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("id");

  if (!trackId) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }


  try {
    const status = await getWubbleTrackStatus(trackId);
    return NextResponse.json(status);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
