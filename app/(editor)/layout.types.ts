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
  previewOnly?: boolean;
  includeInToolbar?: boolean;
  fileExtension?: string;
}

export interface DirectoryNode extends BaseNode {
  type: "directory";
  visibleAfterPage?: string;
  children: MarkdownNode[];
}

export interface SectionOption {
  content: string;
  include: boolean;
}

export interface FileNode extends BaseNode {
  type: "file";
  visibleAfterPage?: string;
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

export type MarkdownNode =
  | DirectoryNode
  | FileNode
  | ComponentRef
  | SegmentNode;

export interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>;
  contentVersion: number;
}

export interface InitialConfigurationType {
  technologies: {
    nextjs: boolean;
    tailwindcss: boolean;
    shadcn: boolean;
    zustand: boolean;
    reactQuery: boolean;
    supabase: boolean;
    neondb: boolean;
    prisma: boolean;
    betterAuth: boolean;
    postgresql: boolean;
    vercel: boolean;
    railway: boolean;
    cypress: boolean;
    resend: boolean;
    stripe: boolean;
    paypal: boolean;
    openrouter: boolean;
  };
  questions: {
    useSupabase: "none" | "no" | "withBetterAuth" | "authOnly";
    alwaysOnServer: boolean;
  };
  features: {
    authentication: {
      enabled: boolean;
      magicLink: boolean;
      emailPassword: boolean;
      otp: boolean;
      twoFactor: boolean;
      passkey: boolean;
      anonymous: boolean;
      googleAuth: boolean;
      githubAuth: boolean;
      appleAuth: boolean;
      passwordOnly: boolean;
    };
    admin: {
      enabled: boolean;
      superAdmins: boolean;
      orgAdmins: boolean;
      orgMembers: boolean;
    };
    payments: {
      enabled: boolean;
      paypalPayments: boolean;
      stripePayments: boolean;
      stripeSubscriptions: boolean;
    };
    aiIntegration: {
      enabled: boolean;
      imageGeneration: boolean;
      textGeneration: boolean;
    };
    realTimeNotifications: {
      enabled: boolean;
      emailNotifications: boolean;
      inAppNotifications: boolean;
    };
    fileStorage: boolean;
  };
  database: {
    hosting: "supabase" | "neondb" | "postgresql";
  };
  deployment: {
    platform: "vercel" | "railway";
  };
}

export interface EditorState {
  version: number;
  data: MarkdownData;
  darkMode: boolean;
  previewMode: boolean;
  refreshKey: number;
  visitedPages: string[];
  appStructure: FileSystemEntry[];
  placeholderValues: Record<string, string>;
  initialConfiguration: InitialConfigurationType;
  storedContentVersion?: number;
  updateContent: (path: string, content: string) => void;
  setContent: (path: string, content: string) => void;
  getNode: (path: string) => MarkdownNode | null;
  setDarkMode: (darkMode: boolean) => void;
  setPreviewMode: (previewMode: boolean) => void;
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
  addAppStructureNodeAfterSibling: (siblingId: string, newNode: FileSystemEntry) => void;
  updateInclusionRules: (inclusionConfig: Record<string, boolean>) => void;
  getInitialConfiguration: () => InitialConfigurationType;
  setInitialConfiguration: (config: InitialConfigurationType) => void;
  updateInitialConfiguration: (
    updates: Partial<InitialConfigurationType>
  ) => void;
  updateAuthenticationOption: (optionId: string, enabled: boolean) => void;
  updateAdminOption: (optionId: string, enabled: boolean) => void;
  updatePaymentOption: (optionId: string, enabled: boolean) => void;
  updateAIIntegrationOption: (optionId: string, enabled: boolean) => void;
  updateRealTimeNotificationsOption: (optionId: string, enabled: boolean) => void;
  setMarkdownData: (data: MarkdownData) => void;
  refreshMarkdownData: () => void;
  reset: () => void;
  resetToLatestData: () => void;
  forceRefresh: () => void;
  setRefreshKey: (key: number) => void;
  wireframeState: WireframeState;
  setWireframeCurrentPage: (pageIndex: number) => void;
  getWireframeCurrentPage: () => string | null;
  addWireframeElement: (
    targetPath: string,
    targetType: "layout" | "page",
    element: WireframeElement
  ) => void;
  removeWireframeElement: (
    targetPath: string,
    targetType: "layout" | "page",
    elementId: string
  ) => void;
  updateWireframeElement: (
    targetPath: string,
    targetType: "layout" | "page",
    elementId: string,
    updates: Partial<WireframeElement>
  ) => void;
  initializeWireframePages: () => void;
  setWireframeConfigPopover: (open: boolean, elementType?: WireframeElementType) => void;
  selectWireframeItem: (type: "page" | "layout", path: string) => void;
  clearWireframeSelection: () => void;
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

export type WireframeElementType =
  | "header"
  | "sidebar-left"
  | "sidebar-right"
  | "footer"
  | "form"
  | "table"
  | "tabs"
  | "accordion";

export interface WireframeElement {
  id: string;
  type: WireframeElementType;
  label: string;
  config: {
    width?: "sm" | "md" | "lg" | "xl" | "full";
    height?: "sm" | "md" | "lg" | "xl" | "auto";
    position?: "top" | "bottom" | "left" | "right" | "center";
    variant?: "primary" | "secondary" | "outline";
  };
}

export interface WireframeLayoutData {
  layoutPath: string;
  elements: WireframeElement[];
}

export interface WireframePageData {
  pagePath: string;
  elements: WireframeElement[];
}

export interface WireframeData {
  layouts: Record<string, WireframeLayoutData>;
  pages: Record<string, WireframePageData>;
}

export interface WireframeState {
  currentPageIndex: number;
  totalPages: number;
  availablePages: string[];
  wireframeData: WireframeData;
  isConfigPopoverOpen: boolean;
  selectedElementType: WireframeElementType | null;
  selectedType: "page" | "layout" | null;
  selectedPath: string | null;
}

