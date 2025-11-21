export type IDEType = "windsurf" | "claudecode" | "cursor";

export interface IDEOption {
  id: IDEType;
  name: string;
  description: string;
}

export const IDE_OPTIONS: IDEOption[] = [
  {
    id: "claudecode",
    name: "Claude Code",
    description: "AI-powered coding assistant by Anthropic",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "AI-powered IDE by Codeium",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor",
  },
];
