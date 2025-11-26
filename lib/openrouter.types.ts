export interface OpenRouterRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  fingerprint: string;
}

export interface OpenRouterResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}
