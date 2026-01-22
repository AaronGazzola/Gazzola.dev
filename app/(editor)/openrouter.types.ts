export interface CodeGenerationInput {
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface CodeGenerationError {
  message: string;
  retryAfter?: number;
  isInsufficientCredits?: boolean;
}

export enum OpenRouterDataAttributes {
  GENERATE_BUTTON = "openrouter-generate-button",
  PROMPT_INPUT = "openrouter-prompt-input",
  OUTPUT_CONTAINER = "openrouter-output-container",
  RATE_LIMIT_INDICATOR = "openrouter-rate-limit-indicator",
}
