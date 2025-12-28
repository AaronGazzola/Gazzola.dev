export type NodeType = "directory" | "file" | "segment" | "component" | "code-file";

export type IDEType = "windsurf" | "claudecode" | "cursor";

export const IDE_ROBOTS_DISPLAY_NAMES: Record<IDEType, string> = {
  claudecode: "CLAUDE",
  cursor: ".cursorrules",
  windsurf: ".windsurfrules",
};

export interface BaseNode {
  id: string;
  name: string;
  displayName: string;
  type: NodeType;
  order?: number;
  path: string;
  urlPath: string;
  include: boolean;
  includeInSidebar?: boolean;
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
  isDynamicRobotsFile?: boolean;
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

export interface CodeFileNode extends BaseNode {
  type: "code-file";
  content: () => string;
  language: string;
  includeCondition: () => boolean;
  visibleAfterPage?: string;
  parentPath?: string;
  downloadPath?: string;
}

export type MarkdownNode =
  | DirectoryNode
  | FileNode
  | ComponentRef
  | SegmentNode;

export type NavigationNode = MarkdownNode | CodeFileNode;

export interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>;
  contentVersion: number;
}

export interface InitialConfigurationType {
  technologies: {
    nextjs: boolean;
    typescript: boolean;
    tailwindcss: boolean;
    shadcn: boolean;
    zustand: boolean;
    reactQuery: boolean;
    supabase: boolean;
    postgresql: boolean;
    vercel: boolean;
    railway: boolean;
    playwright: boolean;
    cypress: boolean;
    resend: boolean;
    stripe: boolean;
    paypal: boolean;
    openrouter: boolean;
  };
  questions: {
    databaseProvider: "none" | "supabase";
    alwaysOnServer: boolean;
  };
  features: {
    authentication: {
      enabled: boolean;
      magicLink: boolean;
      emailPassword: boolean;
      otp: boolean;
      phoneAuth: boolean;
      googleAuth: boolean;
      githubAuth: boolean;
      appleAuth: boolean;
      emailVerification: boolean;
      mfa: boolean;
    };
    admin: {
      enabled: boolean;
      admin: boolean;
      superAdmin: boolean;
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
  codeFiles: CodeFileNode[];
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
  getCodeFile: (path: string) => CodeFileNode | null;
  generateCodeFiles: () => void;
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
  toggleAuthMethod: (method: keyof InitialConfigurationType['features']['authentication']) => void;
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
  isResetting: boolean;
  setIsResetting: (isResetting: boolean) => void;
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
  selectedFilePath: string | null;
  selectedFileId: string | null;
  userExperienceFiles: Record<string, UserExperienceFileType[]>;
  features: Record<string, Feature[]>;
  featureFileSelection: {
    fileId: string | null;
    featureId: string | null;
    fileType: UserExperienceFileType | null;
  };
  setSelectedFile: (filePath: string | null, fileId: string | null) => void;
  addUtilityFile: (parentFileId: string, parentFileName: string, fileType: UserExperienceFileType) => void;
  getUtilityFiles: (fileId: string) => UserExperienceFileType[];
  clearSelection: () => void;
  addFeature: (fileId: string) => void;
  updateFeature: (fileId: string, featureId: string, updates: Partial<Feature>) => void;
  removeFeature: (fileId: string, featureId: string) => void;
  getFeatures: (fileId: string) => Feature[];
  setFeatures: (features: Record<string, Feature[]>) => void;
  linkFeatureFile: (fileId: string, featureId: string, fileType: UserExperienceFileType, filePath: string) => void;
  unlinkFeatureFile: (fileId: string, featureId: string, fileType: UserExperienceFileType) => void;
  getUtilFileFunctions: (utilFilePath: string) => string[];
  setFunctionForUtilFile: (fileId: string, featureId: string, fileType: UserExperienceFileType, functionName: string) => void;
  setFeatureFileSelection: (fileId: string | null, featureId: string | null, fileType: UserExperienceFileType | null) => void;
  clearFeatureFileSelection: () => void;
  testSuites: TestSuite[];
  addTestSuite: (suite: Omit<TestSuite, "id">) => void;
  updateTestSuite: (id: string, updates: Partial<TestSuite>) => void;
  removeTestSuite: (id: string) => void;
  addTestCase: (suiteId: string, testCase: Omit<TestCase, "id">) => void;
  updateTestCase: (suiteId: string, caseId: string, updates: Partial<TestCase>) => void;
  removeTestCase: (suiteId: string, caseId: string) => void;
  resetTestsFromFeatures: () => void;
  reorderTestSuites: (fromIndex: number, toIndex: number) => void;
  readmeGenerated: boolean;
  setReadmeGenerated: (generated: boolean) => void;
  readmeWasPasted: boolean;
  setReadmeWasPasted: (wasPasted: boolean) => void;
  appStructureGenerated: boolean;
  setAppStructureGenerated: (generated: boolean) => void;
  databaseGenerated: boolean;
  setDatabaseGenerated: (generated: boolean) => void;
  helpPopoverOpened: boolean;
  setHelpPopoverOpened: (opened: boolean) => void;
  appStructureHelpPopoverOpened: boolean;
  setAppStructureHelpPopoverOpened: (opened: boolean) => void;
  databaseHelpPopoverOpened: boolean;
  setDatabaseHelpPopoverOpened: (opened: boolean) => void;
}

export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  order?: number;
  path?: string;
  include?: boolean;
  includeInSidebar?: boolean;
  icon?: string;
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

export type UserExperienceFileType = "stores" | "hooks" | "actions" | "types";

export interface FunctionNameData {
  name: string;
  utilFile: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  linkedFiles: Partial<Record<UserExperienceFileType, string>>;
  functionNames: Partial<Record<UserExperienceFileType, string | FunctionNameData>>;
  isEditing: boolean;
}

export interface TestCase {
  id: string;
  description: string;
  passCondition: string;
  isEditing?: boolean;
}

export interface TestSuite {
  id: string;
  name: string;
  featureId?: string;
  description: string;
  command: string;
  testCases: TestCase[];
  isEditing?: boolean;
}

