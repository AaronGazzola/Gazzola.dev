export type IDEType = "lovable" | "replit" | "claudecode" | "cursor";

export interface IDEOption {
  id: IDEType;
  name: string;
  description: string;
}

export const IDE_OPTIONS: IDEOption[] = [
  {
    id: "lovable",
    name: "Lovable",
    description: "AI-powered full-stack development platform",
  },
  {
    id: "replit",
    name: "Replit",
    description: "Browser-based collaborative coding environment",
  },
  {
    id: "claudecode",
    name: "Claude Code",
    description: "AI-powered coding assistant by Anthropic",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor",
  },
];
