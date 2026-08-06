import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET() {
  try {
    const { text } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: "Say hello in one sentence.",
    });

    return Response.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("TEST ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}