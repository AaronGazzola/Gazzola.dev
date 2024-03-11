import { getCustomInstructions } from "@/app/lib/GPT";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const hourlyRate = process.env.HOURLY_RATE || "";
const hoursPerWeek = process.env.HOURS_PER_WEEK || "";
const availability = process.env.AVAILABILITY || "";
const apiKey = process.env.OPENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const chatgpt = new OpenAI({
      apiKey,
    });

    const completion = await chatgpt.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getCustomInstructions(
            hourlyRate,
            hoursPerWeek,
            availability
          ),
        },
        ...messages,
      ],
      model: "gpt-3.5-turbo",
    });
    return NextResponse.json({
      message: completion.choices[0].message?.content ?? "",
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Error)
      return NextResponse.json({
        error: err.message,
      });
  }
}
