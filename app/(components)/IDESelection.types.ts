export type IDEType = "lovable" | "replit" | "vscode";

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
    id: "vscode",
    name: "VS Code",
    description: "Professional desktop code editor",
  },
];
