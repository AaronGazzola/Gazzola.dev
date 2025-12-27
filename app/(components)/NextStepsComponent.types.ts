import type { LucideIcon } from "lucide-react";

export interface StepData {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  isOptional?: boolean;
  logos?: Array<{ component: React.ComponentType<{ className?: string }>; label: string }>;
}

export interface NextStepsState {
  currentStep: number;
  totalSteps: number;
}
