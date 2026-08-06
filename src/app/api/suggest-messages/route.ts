import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST() {
  try {
    const { text } = await generateText({
      model: google("gemini-3-flash-preview"),
      system: `You are an assistant that generates conversation starters.

Generate exactly three open-ended and engaging questions for an anonymous social messaging platform like Qooh.me.

Rules:
- Return exactly three questions.
- Separate each question with ||
- Do not number the questions.
- Do not include any extra text.
- Avoid personal, offensive, or sensitive topics.
- Make the questions friendly and suitable for a diverse audience.

Example output:
What's a hobby you've recently started?||If you could travel anywhere tomorrow, where would you go?||What's one small thing that always makes you smile?`,
      prompt: "Generate exactly three unique conversation starter questions.",
    });

    return Response.json({
      success: true,
      suggestions: text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate suggestions",
      },
      {
        status: 500,
      }
    );
  }
}