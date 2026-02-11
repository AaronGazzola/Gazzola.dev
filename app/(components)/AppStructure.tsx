"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Bot,
  CornerLeftUp,
  FolderTree,
  HelpCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useStructureGeneration } from "./AppStructure.generation-handlers";
import { useAppStructureStore } from "./AppStructure.stores";
import { InferredFeature } from "./AppStructure.types";
import {
  addRouteSegment,
  createRouteFromPath,
  deleteRouteFromFileSystem,
  generateId,
  generateRoutesFromFileSystem,
  generateUniqueSegmentName,
  getQualifyingFiles,
  validateRoutePath,
} from "./AppStructure.utils";
import { PageFeaturesAccordionItem } from "./AppStructure/PageFeaturesAccordionItem";
import { useREADMEStore } from "./READMEComponent.stores";
import {
  AuthMethods,
  LayoutInput,
  PageAccess,
  PageInput,
} from "./READMEComponent.types";
import { SiteMapNode } from "./SiteMapNode";
import { TreeNode } from "./TreeNode";

export { WireFrame } from "./WireFrame";

const isDevelopment = process.env.NODE_ENV === "development";

const formatLayoutOptions = (layout: LayoutInput): string => {
  const parts: string[] = [];
  if (layout.options.header.enabled) {
    const headerParts: string[] = ["Header"];
    const headerDetails: string[] = [];
    if (layout.options.header.title) headerDetails.push("app title");
    if (layout.options.header.navigationItems) headerDetails.push("navigation");
    if (layout.options.header.profileAvatarPopover)
      headerDetails.push("profile menu");
    if (layout.options.header.sticky) headerDetails.push("sticky");
    if (layout.options.header.sidebarToggleButton)
      headerDetails.push("sidebar toggle");
    if (headerDetails.length > 0) {
      headerParts.push(`(${headerDetails.join(", ")})`);
    }
    parts.push(headerParts.join(" "));
  }
  if (layout.options.leftSidebar.enabled) {
    const sidebarParts: string[] = ["Left Sidebar"];
    const sidebarDetails: string[] = [];
    if (layout.options.leftSidebar.title) sidebarDetails.push("app title");
    if (layout.options.leftSidebar.navigationItems)
      sidebarDetails.push("navigation");
    if (layout.options.leftSidebar.profileAvatarPopover)
      sidebarDetails.push("profile menu");
    if (sidebarDetails.length > 0) {
      sidebarParts.push(`(${sidebarDetails.join(", ")})`);
    }
    parts.push(sidebarParts.join(" "));
  }
  if (layout.options.rightSidebar.enabled) {
    const sidebarParts: string[] = ["Right Sidebar"];
    const sidebarDetails: string[] = [];
    if (layout.options.rightSidebar.title) sidebarDetails.push("app title");
    if (layout.options.rightSidebar.navigationItems)
      sidebarDetails.push("navigation");
    if (layout.options.rightSidebar.profileAvatarPopover)
      sidebarDetails.push("profile menu");
    if (sidebarDetails.length > 0) {
      sidebarParts.push(`(${sidebarDetails.join(", ")})`);
    }
    parts.push(sidebarParts.join(" "));
  }
  if (layout.options.footer.enabled) {
    const footerParts: string[] = ["Footer"];
    const footerDetails: string[] = [];
    if (layout.options.footer.title) footerDetails.push("app title");
    if (layout.options.footer.allNavItems) footerDetails.push("all nav items");
    if (layout.options.footer.legalNavItems) footerDetails.push("legal links");
    if (footerDetails.length > 0) {
      footerParts.push(`(${footerDetails.join(", ")})`);
    }
    parts.push(footerParts.join(" "));
  }
  return parts.join(", ");
};

const buildFeatureGenerationPrompt = (
  layouts: LayoutInput[],
  pages: PageInput[],
  pageAccess: PageAccess[],
  authMethods: AuthMethods
): string => {
  const layoutsSection =
    layouts.length > 0
      ? `LAYOUTS:\n${layouts
          .map((l) => {
            return `- ${l.name}: ${formatLayoutOptions(l)}\n`;
          })
          .join("")}`
      : "No layouts defined.\n";

  const pagesSection =
    pages.length > 0
      ? `PAGES:\n${pages
          .map((p) => {
            const access = pageAccess.find((pa) => pa.pageId === p.id);
            const accessLevels = [];
            if (access?.anon) accessLevels.push("anonymous");
            if (access?.auth) accessLevels.push("authenticated");
            if (access?.admin) accessLevels.push("admin");
            const accessStr =
              accessLevels.length > 0
                ? accessLevels.join(", ")
                : "not specified";

            return `- ${p.route} - ${p.name}\n  Description: ${p.description}\n  Access: ${accessStr}\n`;
          })
          .join("")}`
      : "";

  const authMethodsSection = `AUTHENTICATION METHODS:\n- Email/Password: ${authMethods.emailPassword ? "Yes" : "No"}\n- Magic Link: ${authMethods.magicLink ? "Yes" : "No"}\n`;

  return `You are generating action-based features for a Next.js web application.

${authMethodsSection}

${layoutsSection}

${pagesSection}

FEATURE DEFINITION:
Each feature represents a SINGLE ACTION that a user can perform.
Features should be atomic and specific with action verbs.

GOOD FEATURE EXAMPLES:
- "Sign in with email and password"
- "Sign up with email and password"
- "Sign out user"
- "Send forgot password email"
- "Reset password"
- "Get authenticated user profile"
- "Get all users"
- "Edit user profile"
- "Delete post"
- "Create new post"
- "Get list of messages"
- "Send message"
- "Submit contact form"
- "Upload profile image"
- "Filter products by category"
- "Sort users by name"

BAD FEATURE EXAMPLES (TOO VAGUE):
- "User authentication" → Split into: "Sign in", "Sign up", "Sign out"
- "Profile management" → Split into: "Get profile", "Edit profile", "Upload avatar"
- "Dashboard display" → Split into: "Get user stats", "Get recent activity"
- "Content management" → Split into: "Create post", "Edit post", "Delete post"

GUIDELINES:
1. FOR LAYOUTS: Only include actions shared across ALL pages using that layout (e.g., sign out, notifications)
2. FOR PAGES: Identify EVERY action mentioned in the description
3. FEATURE COUNT:
   - Simple page (static): 0-1 features
   - Form page: 1-3 features
   - List/view page: 1-3 features
   - Complex page (dashboard, admin): 4-10 features
4. Break down complex functionality into individual actions
5. Use action verbs: get, create, edit, delete, send, submit, upload, filter, sort, etc.

OUTPUT FORMAT (NO markdown code blocks, just JSON):
{
  "layouts": [
    {
      "name": "Main Layout",
      "features": [
        {
          "title": "Sign out user",
          "description": "Clear user session and redirect to login page"
        }
      ]
    }
  ],
  "pages": [
    {
      "route": "/login",
      "name": "Login Page",
      "description": "User login page",
      "features": [
        {
          "title": "Sign in with email and password",
          "description": "Authenticate user with email and password credentials"
        },
        {
          "title": "Send forgot password email",
          "description": "Send password reset link to user's email"
        }
      ]
    }
  ]
}

CRITICAL:
- Return ONLY valid JSON (no markdown code blocks)
- Start with { and end with }
- Include ALL layouts from input (even if features array is empty)
- Include ALL pages from input (even if features array is empty)
- Each feature = single action with action verb in title`;
};

const validateFeature = (feature: InferredFeature): boolean => {
  const invalidTitles = [
    "header",
    "footer",
    "sidebar",
    "navigation",
    "layout",
    "wrapper",
    "container",
    "auth state",
    "global state",
    "app state",
  ];

  const titleLower = feature.title.toLowerCase();

  if (invalidTitles.some((invalid) => titleLower.includes(invalid))) {
    return false;
  }

  if (!feature.title || feature.title.trim().length === 0) {
    return false;
  }

  return true;
};

export const LayoutAndStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    setFeatures,
    featureFileSelection,
    selectedFilePath,
    data,
    appStructureGenerated,
    setAppStructureGenerated,
    readmeGenerated,
    appStructureHelpPopoverOpened,
    setAppStructureHelpPopoverOpened,
  } = useEditorStore();

  const { layouts, pages, pageAccess, authMethods } = useREADMEStore();
  const searchParams = useSearchParams();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const phase1ToastIdRef = useRef<string | number | undefined>();
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);
  const [helpPopoverOpen, setHelpPopoverOpen] = useState(false);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

  const {
    inferredFeatures,
    parsedPages,
    featuresGenerated,
    accordionValue,
    lastGeneratedForStructure,
    setInferredFeatures,
    setParsedPages,
    setFeaturesGenerated,
    setAccordionValue,
    setLastGeneratedForStructure,
    updateFeature,
  } = useAppStructureStore();

  const [globalExpandedFeatureId, setGlobalExpandedFeatureId] = useState<
    string | null
  >(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [structurePlan, setStructurePlan] = useState<string | null>(null);

  useEffect(() => {
    if (
      globalExpandedFeatureId === null &&
      featuresGenerated &&
      Object.keys(inferredFeatures).length > 0
    ) {
      const firstPageFeatures = Object.values(inferredFeatures)[0];
      if (firstPageFeatures && firstPageFeatures.length > 0) {
        setGlobalExpandedFeatureId(firstPageFeatures[0].id);
      }
    }
  }, [featuresGenerated, inferredFeatures, globalExpandedFeatureId]);

  useEffect(() => {
    const progressLoaded = searchParams?.get("progressLoaded");
    console.log("[APP STRUCTURE] Progress loaded effect:", {
      progressLoaded,
      appStructureGenerated,
      showSuccessView,
    });
    if (progressLoaded && appStructureGenerated) {
      console.log("[APP STRUCTURE] Showing success view from progress load");
      setShowSuccessView(true);
    }
  }, [searchParams, appStructureGenerated]);

  useEffect(() => {
    console.log("[APP STRUCTURE] Normal success view effect:", {
      appStructureGenerated,
      showSuccessView,
    });
    if (appStructureGenerated && !showSuccessView) {
      console.log("[APP STRUCTURE] Showing success view from normal flow");
      setShowSuccessView(true);
    }
  }, [appStructureGenerated, showSuccessView]);

  const handleAddFeature = useCallback(
    (pageId: string) => {
      const newFeature: InferredFeature = {
        id: generateId(),
        pageId: pageId,
        title: "New Feature",
        description: "",
      };

      setInferredFeatures({
        ...inferredFeatures,
        [pageId]: [...(inferredFeatures[pageId] || []), newFeature],
      });
      setGlobalExpandedFeatureId(newFeature.id);
    },
    [inferredFeatures, setInferredFeatures]
  );

  const handleDeleteFeature = useCallback(
    (featureId: string) => {
      const updatedFeatures = { ...inferredFeatures };

      for (const pageId in updatedFeatures) {
        updatedFeatures[pageId] = updatedFeatures[pageId].filter(
          (f) => f.id !== featureId
        );
      }

      setInferredFeatures(updatedFeatures);

      if (globalExpandedFeatureId === featureId) {
        setGlobalExpandedFeatureId(null);
      }
    },
    [inferredFeatures, setInferredFeatures, globalExpandedFeatureId]
  );

  useEffect(() => {}, []);

  const { mutate: generateFeatures, isPending: isGeneratingFeatures } =
    useCodeGeneration((response) => {
      console.log("========================================");
      console.log("FEATURE GENERATION");
      console.log("========================================");
      console.log("AI OUTPUT (Raw Response):");
      console.log(response.content);
      console.log("========================================");

      try {
        const cleanResponse = response.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const parsed = JSON.parse(cleanResponse);

        const allFeatures: Record<string, InferredFeature[]> = {};
        const displayPages: Array<{
          id: string;
          name: string;
          route: string;
          description: string;
        }> = [];

        if (parsed.layouts && Array.isArray(parsed.layouts)) {
          parsed.layouts.forEach((layoutData: any) => {
            const layout = layouts.find((l) => l.name === layoutData.name);
            if (!layout) return;

            const layoutPageId = `layout-${layout.id}`;

            if (layoutData.features && Array.isArray(layoutData.features)) {
              const inferredFeatures: InferredFeature[] = layoutData.features
                .map((f: any) => ({
                  id: generateId(),
                  pageId: layoutPageId,
                  title: f.title || "Untitled Feature",
                  description: f.description || "",
                }))
                .filter(validateFeature);

              if (inferredFeatures.length > 0) {
                allFeatures[layoutPageId] = inferredFeatures;
              }
            }

            displayPages.push({
              id: layoutPageId,
              name: `${layout.name} Features`,
              route: "",
              description: formatLayoutOptions(layout),
            });
          });
        }

        if (!parsed.pages || !Array.isArray(parsed.pages)) {
          toast.error("Invalid response format from AI");
          return;
        }

        parsed.pages.forEach((pageData: any) => {
          const page = pages.find((p) => p.route === pageData.route);
          if (!page) return;

          const pageId = page.id;

          displayPages.push({
            id: pageId,
            name: page.name,
            route: page.route,
            description: page.description,
          });

          if (pageData.features && Array.isArray(pageData.features)) {
            const inferredFeatures: InferredFeature[] = pageData.features
              .map((f: any) => ({
                id: generateId(),
                pageId: pageId,
                title: f.title || "Untitled Feature",
                description: f.description || "",
              }))
              .filter(validateFeature);

            if (inferredFeatures.length > 0) {
              allFeatures[pageId] = inferredFeatures;
            }
          }
        });

        setParsedPages(displayPages);
        setInferredFeatures(allFeatures);
        setFeaturesGenerated(true);
        setAccordionValue("step-features");

        const firstPageFeatures = Object.values(allFeatures)[0];
        if (firstPageFeatures && firstPageFeatures.length > 0) {
          setGlobalExpandedFeatureId(firstPageFeatures[0].id);
        }

        const layoutCount = parsed.layouts?.length || 0;
        const pageCount = parsed.pages?.length || 0;

        console.log("PARSED PAGES:");
        console.log(JSON.stringify(displayPages, null, 2));
        console.log("========================================");
        console.log("PARSED FEATURES:");
        console.log(JSON.stringify(allFeatures, null, 2));
        console.log("========================================");
        console.log("SUMMARY:", {
          layoutCount,
          pageCount,
          totalFeatures: Object.values(allFeatures).reduce(
            (sum, features) => sum + features.length,
            0
          ),
        });
        console.log("========================================");

        toast.success(
          `Generated features for ${layoutCount} layout(s) and ${pageCount} page(s)`
        );
      } catch (error) {
        console.error("========================================");
        console.error("FEATURE GENERATION ERROR:");
        console.error(error instanceof Error ? error.message : String(error));
        console.error("========================================");
        toast.error("Failed to parse AI response. Please try again.");
      }
    });

  const { generatePlan, isGeneratingPlan, isGeneratingStructure } =
    useStructureGeneration(
      parsedPages,
      inferredFeatures,
      setStructurePlan,
      setAppStructure,
      setFeatures,
      setAppStructureGenerated,
      setShowSuccessView,
      phase1ToastIdRef
    );

  const handleGenerateFeatures = useCallback(() => {
    if (layouts.length === 0 && pages.length === 0) {
      toast.error(
        "No layouts or pages found. Please add pages in the README section first."
      );
      return;
    }

    console.log("========================================");
    console.log("FEATURE GENERATION");
    console.log("========================================");
    console.log("INPUT DATA:");
    console.log("Layouts:", JSON.stringify(layouts, null, 2));
    console.log("Pages:", JSON.stringify(pages, null, 2));
    console.log("Page Access:", JSON.stringify(pageAccess, null, 2));
    console.log("Auth Methods:", JSON.stringify(authMethods, null, 2));
    console.log("========================================");

    const combinedPrompt = buildFeatureGenerationPrompt(
      layouts,
      pages,
      pageAccess,
      authMethods
    );

    console.log("AI INPUT (Prompt):");
    console.log(combinedPrompt);
    console.log("========================================");

    generateFeatures({ prompt: combinedPrompt, maxTokens: 4500 });
  }, [layouts, pages, pageAccess, authMethods, generateFeatures]);

  const hasFeaturesChanged = useCallback(() => {
    if (!lastGeneratedForStructure) return true;
    const currentState = JSON.stringify({ parsedPages, inferredFeatures });
    return lastGeneratedForStructure !== currentState;
  }, [lastGeneratedForStructure, parsedPages, inferredFeatures]);

  const handleGenerateStructure = useCallback(() => {
    if (!parsedPages || parsedPages.length === 0) {
      toast.error("No pages found. Please generate features first.");
      return;
    }

    if (!inferredFeatures || Object.keys(inferredFeatures).length === 0) {
      toast.error("No features found. Please generate features first.");
      return;
    }

    setLastGeneratedForStructure(
      JSON.stringify({ parsedPages, inferredFeatures })
    );

    generatePlan();
  }, [
    parsedPages,
    inferredFeatures,
    generatePlan,
    setLastGeneratedForStructure,
  ]);

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  const hasLayoutsOrPages = layouts.length > 0 || pages.length > 0;
  const isPending = isGeneratingFeatures;

  const totalFeatures = Object.values(inferredFeatures).reduce(
    (sum, features) => sum + features.length,
    0
  );

  console.log("[APP STRUCTURE] Render:", {
    appStructureGenerated,
    showSuccessView,
    appStructureLength: appStructure.length,
  });

  if (
    appStructure.length === 0 ||
    !appStructureGenerated ||
    (appStructureGenerated && !showSuccessView)
  ) {
    console.log("[APP STRUCTURE] Rendering FORM VIEW");
    if (!hasLayoutsOrPages) {
      return (
        <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center theme-py-12 theme-gap-4">
            <p className="text-base font-semibold theme-text-muted-foreground text-center">
              Add pages and layouts in the{" "}
              <Link
                href="/readme"
                className="theme-text-primary hover:underline"
              >
                README
              </Link>{" "}
              section first
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col theme-gap-3">
          <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
            <FolderTree className="h-5 w-5 theme-text-primary" />
            Generate App Structure
          </h2>
          <p className="theme-text-foreground">
            Follow the steps below to define the files and folders for your app.
            <br />
            Start by defining the features for each page and layout.
          </p>

          {!featuresGenerated && (
            <Button
              onClick={handleGenerateFeatures}
              disabled={isPending}
              className="w-full theme-gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating features...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Generate Features
                </>
              )}
            </Button>
          )}
        </div>

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full"
        >
          <AccordionItem
            value="step-features"
            className={`theme-border-border ${!featuresGenerated ? "opacity-50 pointer-events-none" : ""}`}
          >
            <AccordionTrigger
              className={`hover:theme-text-primary group ${!featuresGenerated ? "cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center theme-gap-2">
                <Sparkles className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  Features
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col theme-gap-4 pt-4">
                <div className="flex flex-col theme-gap-2">
                  {parsedPages.map((page) => {
                    const features = inferredFeatures[page.id] || [];

                    return (
                      <PageFeaturesAccordionItem
                        key={page.id}
                        pageId={page.id}
                        pageName={page.name}
                        pageRoute={page.route}
                        features={features}
                        expandedFeatureId={globalExpandedFeatureId}
                        onToggleFeature={setGlobalExpandedFeatureId}
                        onUpdateFeature={updateFeature}
                        onAddFeature={handleAddFeature}
                        onDeleteFeature={handleDeleteFeature}
                        disabled={isPending}
                      />
                    );
                  })}
                </div>

                {appStructureGenerated ? (
                  <div className="flex flex-col sm:flex-row theme-gap-2">
                    <Button
                      onClick={handleGenerateStructure}
                      disabled={
                        isGeneratingPlan ||
                        isGeneratingStructure ||
                        !hasFeaturesChanged()
                      }
                      className="flex-1 theme-gap-2"
                    >
                      {isGeneratingPlan || isGeneratingStructure ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4" />
                          Regenerate App Structure
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSuccessView(true);
                      }}
                      disabled={isGeneratingStructure}
                      variant="outline"
                      className="flex-1 theme-gap-2"
                    >
                      View App Directory
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateStructure}
                    disabled={
                      isGeneratingPlan ||
                      isGeneratingStructure ||
                      !featuresGenerated
                    }
                    className="w-full theme-gap-2"
                  >
                    {isGeneratingPlan || isGeneratingStructure ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating structure...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Generate App Structure
                      </>
                    )}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  console.log("[APP STRUCTURE] Rendering SUCCESS VIEW");

  return (
    <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto relative">
      <div className="absolute top-2 right-2 flex items-center theme-gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => {
            console.log("[APP STRUCTURE] Dismissing success view");
            setShowSuccessView(false);
            setAccordionValue("step-features");
          }}
        >
          <CornerLeftUp className="h-4 w-4" />
        </Button>
        <Popover
          open={helpPopoverOpen}
          onOpenChange={(open) => {
            setHelpPopoverOpen(open);
            if (open && !appStructureHelpPopoverOpened) {
              setAppStructureHelpPopoverOpened(true);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${!appStructureHelpPopoverOpened ? "theme-bg-primary theme-text-primary-foreground hover:opacity-90" : ""}`}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="sm:w-96 theme-text-popover-foreground theme-shadow theme-font theme-tracking p-0 theme-radius max-h-[45vh] overflow-y-auto"
            style={{ borderColor: "var(--theme-primary)" }}
            align="end"
          >
            <div className="flex flex-col theme-gap-3 theme-bg-background p-4">
              <h4 className="font-semibold text-base theme-font theme-tracking">
                App Structure
              </h4>
              <div className="flex flex-col theme-gap-2 text-sm">
                <p className="theme-font theme-tracking">
                  This is your Next.js web app architecture.
                </p>
                <p className="theme-font theme-tracking">
                  <strong>Page.tsx</strong> files define pages of your app.
                </p>
                <p className="theme-font theme-tracking">
                  <strong>Layout.tsx</strong> files wrap child pages with shared
                  UI
                </p>
                <p className="theme-font theme-tracking">
                  Add <strong>Features</strong> to pages or layouts
                </p>
                <p className="theme-font theme-tracking">
                  Add <strong>hooks, actions, stores or types</strong> to
                  features
                </p>
                <p className="theme-font theme-tracking">
                  Each hook, action, store, and type is assigned to a utility
                  file in any parent directory (eg.{" "}
                  <strong>page.hooks.ts</strong>)
                </p>
                <a
                  href="https://nextjs.org/docs/app/building-your-application/routing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm theme-text-primary hover:underline theme-font theme-tracking theme-pt-2"
                >
                  Next.js App Router docs →
                </a>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col theme-gap-2 md:theme-gap-4 min-h-[calc(100vh-800px)]">
        <div className="flex flex-col flex-[2] min-h-0 overflow-hidden">
          <div className="flex items-center justify-between theme-mb-2">
            <h3 className="text-base md:text-lg font-semibold theme-text-card-foreground theme-font theme-tracking">
              App Directory
            </h3>
          </div>

          <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
            {appStructure.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                isLast={index === appStructure.length - 1}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAddFile={handleAddFile}
                onAddDirectory={handleAddDirectory}
                appStructure={appStructure}
                onAddSpecificFile={handleAddSpecificFile}
                newNodeId={newNodeId}
                qualifyingFilePaths={qualifyingFilePaths}
                expandedFileId={expandedFileId}
                setExpandedFileId={setExpandedFileId}
              />
            ))}
          </div>
        </div>

        {routes.length > 0 && (
          <div className="flex flex-col flex-[1] min-h-0 overflow-hidden">
            <h3 className="text-base md:text-lg font-semibold theme-mb-2 theme-text-card-foreground theme-font theme-tracking">
              Site Map
            </h3>

            <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
              {routes.map((route, index) => (
                <SiteMapNode
                  key={`${route.path}-${index}`}
                  route={route}
                  isLast={index === routes.length - 1}
                  appStructure={appStructure}
                  onUpdateAppStructure={handleUpdate}
                  onDeleteRoute={handleDeleteRoute}
                  onAddSegment={handleAddSegment}
                  newlyAddedSegmentPath={newlyAddedSegmentPath}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AppStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    featureFileSelection,
    selectedFilePath,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  return (
    <div className="theme-p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[calc(100vh-200px)] flex flex-col">
      <h3 className="text-lg font-semibold theme-mb-4 text-[hsl(var(--card-foreground))]">
        App Directory Structure
      </h3>

      <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
        {[...appStructure]
          .sort((a, b) => {
            if (a.type === "file" && b.type === "directory") return -1;
            if (a.type === "directory" && b.type === "file") return 1;
            return a.name.localeCompare(b.name);
          })
          .map((node, index) => (
            <TreeNode
              key={node.id}
              node={node}
              isLast={false}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddFile={handleAddFile}
              onAddDirectory={handleAddDirectory}
              appStructure={appStructure}
              onAddSpecificFile={handleAddSpecificFile}
              newNodeId={newNodeId}
              qualifyingFilePaths={qualifyingFilePaths}
              expandedFileId={expandedFileId}
              setExpandedFileId={setExpandedFileId}
            />
          ))}

        {appStructure.length === 0 && (
          <div className="text-base font-semibold text-center theme-py-8 text-[hsl(var(--muted-foreground))]">
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="theme-mt-6 theme-mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                appStructure={appStructure}
                onUpdateAppStructure={handleUpdate}
                onDeleteRoute={handleDeleteRoute}
                onAddSegment={handleAddSegment}
                newlyAddedSegmentPath={newlyAddedSegmentPath}
              />
            ))}

            <div className="theme-mt-2 flex items-center theme-gap-2 rounded dark:border-gray-700 ">
              <Input
                ref={routeInputRef}
                value={routeInputValue}
                onChange={(e) => setRouteInputValue(e.target.value)}
                onKeyDown={handleRouteKeyDown}
                onBlur={handleRouteSubmit}
                placeholder="Enter route path (e.g., /register/)"
                className="h-6 theme-px-2 theme-py-0 text-sm flex-1 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
