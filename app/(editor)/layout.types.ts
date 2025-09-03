export interface EditorState {
  welcome: string;
  installationIDE: string;
  installationNextjs: string;
  installationEssentials: string;
  setWelcome: (content: string) => void;
  setInstallationIDE: (content: string) => void;
  setInstallationNextjs: (content: string) => void;
  setInstallationEssentials: (content: string) => void;
  reset: () => void;
}

export interface MarkdownDocument {
  id: string;
  path: string;
  content: string;
}

export type DocumentKey = 'welcome' | 'installationIDE' | 'installationNextjs' | 'installationEssentials';