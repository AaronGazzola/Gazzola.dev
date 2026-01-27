import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ENV } from "@/lib/env.utils";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  OpenRouterRequest,
  OpenRouterResponse,
} from "@/lib/openrouter.types";
import { getDomainConfigFromHostname } from "@/lib/domain.utils";

export const maxDuration = 180;

export async function POST(request: NextRequest) {
  const body: OpenRouterRequest = await request.json();
  const hostname = request.headers.get("host") || "gazzola.dev";
  const config = getDomainConfigFromHostname(hostname);

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 175000);

  let openRouterResponse: Response;
  try {
    openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": config.api.referer,
          "X-Title": config.api.title,
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
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      );
    }
    throw error;
  }
  clearTimeout(timeoutId);

  if (!openRouterResponse.ok) {
    const errorData = await openRouterResponse.json();
    conditionalLog({ error: errorData }, { label: LOG_LABELS.OPENROUTER });

    if (openRouterResponse.status === 402) {
      return NextResponse.json(
        {
          error: errorData.error?.message || "Insufficient OpenRouter credits",
          insufficientCredits: true,
        },
        { status: 402 }
      );
    }

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
