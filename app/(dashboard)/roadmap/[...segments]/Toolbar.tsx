"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LLMType } from "./page.types";

interface ToolbarProps {
  selectedLLM: LLMType;
  onLLMChange: (llm: LLMType) => void;
}

export const Toolbar = ({ selectedLLM, onLLMChange }: ToolbarProps) => {
  const llmOptions: { value: LLMType; label: string }[] = [
    { value: "Claude", label: "Claude" },
    { value: "GPT-4", label: "GPT-4" },
    { value: "Gemini", label: "Gemini" },
    { value: "Llama", label: "Llama" },
  ];

  return (
    <div className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">LLM Configuration</h2>
        <Select value={selectedLLM} onValueChange={onLLMChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select LLM" />
          </SelectTrigger>
          <SelectContent>
            {llmOptions.map((llm) => (
              <SelectItem key={llm.value} value={llm.value}>
                {llm.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};