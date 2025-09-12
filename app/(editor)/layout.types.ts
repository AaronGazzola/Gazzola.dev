export type NodeType = "directory" | "file" | "segment" | "component";

export interface BaseNode {
  id: string;
  name: string;
  displayName: string;
  type: NodeType;
  order?: number;
  path: string;
  urlPath: string;
}

export interface DirectoryNode extends BaseNode {
  type: "directory";
  children: MarkdownNode[];
}

export interface FileNode extends BaseNode {
  type: "file";
  content: string;
  segments: SegmentNode[];
  components: ComponentRef[];
  sections: Record<string, Record<string, string>>;
}

export interface SegmentNode extends BaseNode {
  type: "segment";
  content: string;
  sectionId: string;
  options?: Record<string, string>;
}

export interface ComponentRef extends BaseNode {
  type: "component";
  componentId: string;
}

export type MarkdownNode = DirectoryNode | FileNode | SegmentNode | ComponentRef;

export interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>;
}

export interface EditorState {
  data: MarkdownData;
  darkMode: boolean;
  refreshKey: number;
  visitedPages: string[];
  sectionSelections: Record<string, string>;
  appStructure: FileSystemEntry[];
  updateContent: (path: string, content: string) => void;
  setContent: (path: string, content: string) => void;
  getNode: (path: string) => MarkdownNode | null;
  setDarkMode: (darkMode: boolean) => void;
  markPageVisited: (path: string) => void;
  isPageVisited: (path: string) => boolean;
  getNextUnvisitedPage: (currentPath: string) => string | null;
  getSectionOptions: (sectionId: string) => Record<string, string>;
  getSectionContent: (sectionId: string, optionId: string) => string;
  setSectionContent: (sectionId: string, optionId: string, content: string) => void;
  setSectionSelection: (sectionId: string, optionId: string) => void;
  getSectionSelection: (sectionId: string) => string | null;
  setAppStructure: (appStructure: FileSystemEntry[]) => void;
  updateAppStructureNode: (id: string, updates: Partial<FileSystemEntry>) => void;
  deleteAppStructureNode: (id: string) => void;
  addAppStructureNode: (parentId: string, newNode: FileSystemEntry) => void;
  reset: () => void;
  forceRefresh: () => void;
}

export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  order?: number;
  path?: string;
  children?: NavigationItem[];
}

export interface MarkdownDocument {
  id: string;
  path: string;
  content: string;
}

export interface FileSystemEntry {
  id: string;
  name: string;
  type: "file" | "directory";
  children?: FileSystemEntry[];
  isExpanded?: boolean;
  isEditing?: boolean;
}
