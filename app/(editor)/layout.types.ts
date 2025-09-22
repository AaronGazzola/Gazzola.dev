export type NodeType = "directory" | "file" | "segment" | "component";

export interface BaseNode {
  id: string;
  name: string;
  displayName: string;
  type: NodeType;
  order?: number;
  path: string;
  urlPath: string;
  include: boolean;
}

export interface DirectoryNode extends BaseNode {
  type: "directory";
  children: MarkdownNode[];
}

export interface SectionOption {
  content: string;
  include: boolean;
}

export interface FileNode extends BaseNode {
  type: "file";
  content: string;
  components: ComponentRef[];
  sections: Record<string, Record<string, SectionOption>>;
}

export interface ComponentRef extends BaseNode {
  type: "component";
  componentId: string;
}

export interface SegmentNode extends BaseNode {
  type: "segment";
  sectionId: string;
  optionId: string;
  content: string;
  options?: Record<string, SectionOption>;
}

export type MarkdownNode = DirectoryNode | FileNode | ComponentRef | SegmentNode;

export interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>;
}

export interface InitialConfiguration {
  authentication: {
    magicLink: boolean;
    emailPassword: boolean;
    googleAuth: boolean;
    githubAuth: boolean;
    appleAuth: boolean;
    facebookAuth: boolean;
  };
  theme: {
    supportLightDark: boolean;
    defaultTheme: 'light' | 'dark';
  };
  admin: {
    basicAdmin: boolean;
    withOrganizations: boolean;
  };
  payments: {
    stripePayments: boolean;
    stripeSubscriptions: boolean;
    paypalPayments: boolean;
    cryptoPayments: boolean;
  };
  features: {
    realTimeNotifications: boolean;
    emailSending: boolean;
  };
  database: {
    hosting: 'supabase' | 'postgresql';
  };
}

export interface EditorState {
  version: number;
  data: MarkdownData;
  darkMode: boolean;
  refreshKey: number;
  visitedPages: string[];
  appStructure: FileSystemEntry[];
  placeholderValues: Record<string, string>;
  initialConfiguration: InitialConfiguration;
  updateContent: (path: string, content: string) => void;
  setContent: (path: string, content: string) => void;
  getNode: (path: string) => MarkdownNode | null;
  setDarkMode: (darkMode: boolean) => void;
  markPageVisited: (path: string) => void;
  isPageVisited: (path: string) => boolean;
  getNextUnvisitedPage: (currentPath: string) => string | null;
  getSectionOptions: (
    filePath: string,
    sectionId: string
  ) => Record<string, SectionOption>;
  getSectionContent: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => string;
  setSectionContent: (
    filePath: string,
    sectionId: string,
    optionId: string,
    content: string
  ) => void;
  setSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string,
    include: boolean
  ) => void;
  getSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => boolean;
  getPlaceholderValue: (key: string) => string | null;
  setPlaceholderValue: (key: string, value: string) => void;
  setAppStructure: (appStructure: FileSystemEntry[]) => void;
  updateAppStructureNode: (
    id: string,
    updates: Partial<FileSystemEntry>
  ) => void;
  deleteAppStructureNode: (id: string) => void;
  addAppStructureNode: (parentId: string, newNode: FileSystemEntry) => void;
  updateInclusionRules: (inclusionConfig: Record<string, boolean>) => void;
  getInitialConfiguration: () => InitialConfiguration;
  setInitialConfiguration: (config: InitialConfiguration) => void;
  updateInitialConfiguration: (updates: Partial<InitialConfiguration>) => void;
  reset: () => void;
  resetToLatestData: () => void;
  forceRefresh: () => void;
}

export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  order?: number;
  path?: string;
  include?: boolean;
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
}
