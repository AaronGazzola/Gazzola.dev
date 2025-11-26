import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ENV } from "@/lib/env.utils";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  OpenRouterRequest,
  OpenRouterResponse,
} from "@/lib/openrouter.types";

export async function POST(request: NextRequest) {
  const body: OpenRouterRequest = await request.json();

  if (!body.fingerprint) {
    throw new Error("Fingerprint required");
  }

  const hashedFingerprint = crypto
    .createHash("sha256")
    .update(body.fingerprint)
    .digest("hex");

  const rateLimitResult = checkRateLimit(hashedFingerprint);

  conditionalLog(
    { fingerprint: hashedFingerprint.slice(0, 8), ...rateLimitResult },
    { label: LOG_LABELS.RATE_LIMIT }
  );

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil(rateLimitResult.resetMs / 1000);
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Date.now() + rateLimitResult.resetMs),
        },
      }
    );
  }

  const openRouterResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gazzola.dev",
        "X-Title": "Gazzola.dev Code Generator",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: body.context || "You are a code generation assistant.",
          },
          { role: "user", content: body.prompt },
        ],
        max_tokens: body.maxTokens || 4096,
      }),
    }
  );

  if (!openRouterResponse.ok) {
    const errorData = await openRouterResponse.json();
    conditionalLog({ error: errorData }, { label: LOG_LABELS.OPENROUTER });
    throw new Error(errorData.error?.message || "OpenRouter request failed");
  }

  const data = await openRouterResponse.json();

  conditionalLog(
    {
      usage: data.usage,
      model: data.model,
    },
    { label: LOG_LABELS.OPENROUTER }
  );

  const response: OpenRouterResponse = {
    content: data.choices[0]?.message?.content || "",
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined,
  };

  return NextResponse.json(response, {
    headers: {
      "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      "X-RateLimit-Reset": String(Date.now() + rateLimitResult.resetMs),
    },
  });
}
