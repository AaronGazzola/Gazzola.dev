import { RateLimitResult } from "@/lib/openrouter.types";

const rateLimitStore = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function checkRateLimit(fingerprint: string): RateLimitResult {
  const now = Date.now();
  const requests = rateLimitStore.get(fingerprint) || [];

  const validRequests = requests.filter((ts) => now - ts < WINDOW_MS);

  if (validRequests.length >= MAX_REQUESTS) {
    const oldestInWindow = validRequests[0];
    const resetMs = WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, remaining: 0, resetMs };
  }

  validRequests.push(now);
  rateLimitStore.set(fingerprint, validRequests);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - validRequests.length,
    resetMs: WINDOW_MS,
  };
}
