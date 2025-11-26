"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { OpenRouterRequest, OpenRouterResponse } from "@/lib/openrouter.types";
import { getDeviceFingerprint } from "@/lib/fingerprint.utils";
import { CodeGenerationInput, CodeGenerationError } from "./openrouter.types";

export const useCodeGeneration = (
  onSuccess?: (data: OpenRouterResponse) => void
): UseMutationResult<
  OpenRouterResponse,
  CodeGenerationError,
  CodeGenerationInput
> => {
  return useMutation({
    mutationFn: async (
      input: CodeGenerationInput
    ): Promise<OpenRouterResponse> => {
      const fingerprint = await getDeviceFingerprint();

      const response = await fetch("/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          fingerprint,
        } as OpenRouterRequest),
      });

      if (response.status === 429) {
        const data = await response.json();
        const retryAfter = data.retryAfter || 60;
        throw {
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        };
      }

      if (!response.ok) {
        const data = await response.json();
        throw { message: data.error || "Code generation failed" };
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Code generated successfully!", { duration: 3000 });
      onSuccess?.(data);
    },
    onError: (error: CodeGenerationError) => {
      toast.error(error.message, {
        duration: error.retryAfter ? error.retryAfter * 1000 : 5000,
      });
    },
  });
};
