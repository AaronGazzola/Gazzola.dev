export type LLMType = "Claude" | "GPT-4" | "Gemini" | "Llama";

export interface LLMOption {
  value: LLMType;
  label: string;
}