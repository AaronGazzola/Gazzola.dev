"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Textarea } from "@/components/editor/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BookText,
  Bot,
  CheckCircle2,
  CornerLeftUp,
  HelpCircle,
  Loader2,
  PackageOpen,
  Plus,
  Shield,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useReadmeGeneration } from "./READMEComponent.generation-handlers";
import { useREADMEStore } from "./READMEComponent.stores";
import {
  generateId,
  getDefaultLayoutOptions,
  LayoutInput,
  PageAccess,
  PageInput,
  Stage,
} from "./READMEComponent.types";
import {
  generateAuthPages,
  generateCompliancePages,
  generatePagesPrompt,
  parsePagesFromResponse,
} from "./READMEComponent.utils";
import { LayoutAccordionItem } from "./READMEComponent/LayoutAccordionItem";
import { PageAccordionItem } from "./READMEComponent/PageAccordionItem";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 50;
const MIN_PAGE_NAME_LENGTH = 2;
const MIN_PAGE_DESCRIPTION_LENGTH = 20;

export const READMEComponent = () => {
  const {
    setContent,
    readmeGenerated,
    setReadmeGenerated,
    readmeWasPasted,
    setReadmeWasPasted,
    forceRefresh,
  } = useEditorStore();

  const {
    title,
    description,
    stage,
    layouts,
    pages,
    authMethods,
    pageAccess,
    lastGeneratedForAuth,
    lastGeneratedForPages,
    lastGeneratedForReadme,
    setTitle,
    setDescription,
    setStage,
    setLayouts,
    addLayout,
    updateLayout,
    deleteLayout,
    setPages,
    addPage,
    updatePage,
    deletePage,
    setAuthMethods,
    toggleAuthMethod,
    setPageAccess,
    updatePageAccess,
    setLastGeneratedForAuth,
    setLastGeneratedForPages,
    setLastGeneratedForReadme,
  } = useREADMEStore();

  const [accordionValue, setAccordionValue] =
    useState<string>("step-1-description");
  const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>(null);
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null);
  const hasAutoExpandedRef = useRef(false);
  const [helpPopoverOpen, setHelpPopoverOpen] = useState(false);
  const [helpPopoverWasOpened, setHelpPopoverWasOpened] = useState(false);
  const [starterKitPopoverOpen, setStarterKitPopoverOpen] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [readmePlan, setReadmePlan] = useState<string | null>(null);
  const phase1ToastIdRef = useRef<string | number | undefined>();
  const successViewDismissedRef = useRef(false);

  useEffect(() => {
    const accordionMap: Record<Stage, string> = {
      description: "step-1-description",
      auth: "step-2-auth",
      pages: "step-3-pages",
    };
    setAccordionValue(accordionMap[stage]);
  }, [stage]);

  useEffect(() => {
    if (
      readmeGenerated &&
      !showSuccessView &&
      !successViewDismissedRef.current
    ) {
      setShowSuccessView(true);
    }
  }, [readmeGenerated, showSuccessView]);

  useEffect(() => {
    if (pages.length > 0 && !hasAutoExpandedRef.current) {
      const firstNonRequiredPage = pages.find((page) => !page.isAuthRequired);
      if (firstNonRequiredPage) {
        setExpandedPageId(firstNonRequiredPage.id);
        hasAutoExpandedRef.current = true;
      }
    }
  }, [pages]);

  const hasAuthInputChanged = useCallback(() => {
    if (!lastGeneratedForAuth) return true;
    return (
      lastGeneratedForAuth.title !== title ||
      lastGeneratedForAuth.description !== description
    );
  }, [lastGeneratedForAuth, title, description]);

  const hasPagesInputChanged = useCallback(() => {
    if (!lastGeneratedForPages) return true;
    return (
      JSON.stringify(lastGeneratedForPages) !== JSON.stringify(authMethods)
    );
  }, [lastGeneratedForPages, authMethods]);

  const hasReadmeInputChanged = useCallback(() => {
    if (!lastGeneratedForReadme) return true;
    return (
      lastGeneratedForReadme.title !== title ||
      lastGeneratedForReadme.description !== description ||
      JSON.stringify(lastGeneratedForReadme.authMethods) !==
        JSON.stringify(authMethods) ||
      JSON.stringify(lastGeneratedForReadme.layouts) !==
        JSON.stringify(layouts) ||
      JSON.stringify(lastGeneratedForReadme.pages) !== JSON.stringify(pages)
    );
  }, [lastGeneratedForReadme, title, description, authMethods, layouts, pages]);

  const hasAnyInputChanged = useCallback(() => {
    return (
      hasAuthInputChanged() || hasPagesInputChanged() || hasReadmeInputChanged()
    );
  }, [hasAuthInputChanged, hasPagesInputChanged, hasReadmeInputChanged]);

  const handleAccordionChange = useCallback(
    (value: string) => {
      const accordionMap: Record<string, Stage> = {
        "step-1-description": "description",
        "step-2-auth": "auth",
        "step-3-pages": "pages",
      };

      const targetStage = accordionMap[value];

      if (!targetStage) {
        setAccordionValue(value);
        return;
      }

      const stageIndexMap: Record<Stage, number> = {
        description: 0,
        auth: 1,
        pages: 2,
      };

      const currentStageIndex = stageIndexMap[stage];
      const targetStageIndex = stageIndexMap[targetStage];

      if (targetStageIndex > currentStageIndex) {
        return;
      }

      setAccordionValue(value);
    },
    [stage]
  );

  const {
    generatePlan,
    generateReadmeWithBatching,
    isGeneratingPlan,
    isGeneratingReadme,
    isBatchGenerating,
  } = useReadmeGeneration(
    title,
    description,
    layouts,
    pages,
    authMethods,
    pageAccess,
    setReadmePlan,
    setContent,
    setReadmeGenerated,
    forceRefresh,
    phase1ToastIdRef
  );

  const { mutate: generatePages, isPending: isGeneratingPages } =
    useCodeGeneration((response) => {
      const authPagesData = generateAuthPages(authMethods);
      const compliancePagesData = generateCompliancePages();
      const parsed = parsePagesFromResponse(response.content);

      if (parsed && parsed.pages.length > 0) {
        if (parsed.layouts && parsed.layouts.length > 0) {
          setLayouts(parsed.layouts);
          if (parsed.layouts.length > 0) {
            setExpandedLayoutId(parsed.layouts[0].id);
          }
        }

        const finalPages = [
          ...authPagesData.pages,
          ...parsed.pages,
          ...compliancePagesData.pages,
        ];
        const finalPageAccess = [
          ...authPagesData.pageAccess,
          ...parsed.pageAccess,
          ...compliancePagesData.pageAccess,
        ];

        setPages(finalPages);
        setPageAccess(finalPageAccess);
        setStage("pages");

        const authPageCount = authPagesData.pages.length;
        const appPageCount = parsed.pages.length;
        toast.success(
          `Generated ${authPageCount} authentication page${authPageCount !== 1 ? "s" : ""} and ${appPageCount} app page${appPageCount !== 1 ? "s" : ""}`,
          {
            duration: 5000,
          }
        );
      } else {
        const fallbackPages: PageInput[] = [
          {
            id: generateId(),
            name: "Home",
            route: "/",
            description: "Landing page for the application",
            layoutIds: [],
          },
          {
            id: generateId(),
            name: "Dashboard",
            route: "/dashboard",
            description: "Main dashboard for authenticated users",
            layoutIds: [],
          },
        ];

        const fallbackPageAccess: PageAccess[] = [
          {
            pageId: fallbackPages[0].id,
            anon: true,
            auth: true,
            admin: true,
          },
          {
            pageId: fallbackPages[1].id,
            anon: false,
            auth: true,
            admin: true,
          },
        ];

        const finalPages = [
          ...authPagesData.pages,
          ...fallbackPages,
          ...compliancePagesData.pages,
        ];
        const finalPageAccess = [
          ...authPagesData.pageAccess,
          ...fallbackPageAccess,
          ...compliancePagesData.pageAccess,
        ];

        setPages(finalPages);
        setPageAccess(finalPageAccess);
        setStage("pages");
        toast.warning(
          "Could not generate app pages. Default pages added with authentication pages.",
          {
            duration: 5000,
          }
        );
      }
    });

  const handleSubmitInitial = useCallback(() => {
    setLastGeneratedForAuth({ title, description });
    setStage("auth");
  }, [setStage, setLastGeneratedForAuth, title, description]);

  const handleSubmitAuth = useCallback(() => {
    setLastGeneratedForPages(authMethods);
    const prompt = generatePagesPrompt(title, description, authMethods);
    generatePages({ prompt, maxTokens: 2500 });
  }, [
    title,
    description,
    authMethods,
    generatePages,
    setLastGeneratedForPages,
  ]);

  const handleSubmitPages = useCallback(() => {
    if (layouts.length === 0 && pages.length === 0) {
      toast.error("No layouts or pages found. Please add pages first.");
      return;
    }

    setLastGeneratedForReadme({
      title,
      description,
      authMethods,
      layouts,
      pages,
    });

    phase1ToastIdRef.current = toast.loading("Creating README structure...", {
      description: `Processing ${layouts.length} layouts and ${pages.length} pages`,
    });

    generateReadmeWithBatching();
  }, [
    title,
    description,
    layouts,
    pages,
    authMethods,
    generateReadmeWithBatching,
    setLastGeneratedForReadme,
  ]);

  const handleAddLayout = () => {
    const newLayout: LayoutInput = {
      id: generateId(),
      name: "",
      options: getDefaultLayoutOptions(),
    };
    addLayout(newLayout);
    setExpandedLayoutId(newLayout.id);
  };

  const handleUpdateLayoutLocal = (
    id: string,
    updates: Partial<LayoutInput>
  ) => {
    updateLayout(id, updates);
  };

  const handleDeleteLayoutLocal = (id: string) => {
    if (layouts.length === 1) return;
    deleteLayout(id);
    if (expandedLayoutId === id) {
      setExpandedLayoutId(null);
    }
  };

  const handleAddPage = () => {
    const newPage: PageInput = {
      id: generateId(),
      name: "",
      route: "",
      description: "",
      layoutIds: [],
    };
    addPage(newPage);
    setExpandedPageId(newPage.id);
  };

  const handleUpdatePageLocal = (id: string, updates: Partial<PageInput>) => {
    updatePage(id, updates);
  };

  const handleDeletePageLocal = (id: string) => {
    if (pages.length === 1) return;
    deletePage(id);
    if (expandedPageId === id) {
      setExpandedPageId(null);
    }
  };

  if (readmeGenerated && showSuccessView) {
    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto relative">
        <div className="absolute top-2 right-2 flex items-center theme-gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              successViewDismissedRef.current = true;
              setShowSuccessView(false);
              setAccordionValue("step-3-pages");
            }}
          >
            <CornerLeftUp className="h-4 w-4" />
          </Button>
          <Popover
            open={helpPopoverOpen}
            onOpenChange={(open) => {
              setHelpPopoverOpen(open);
              if (open && !helpPopoverWasOpened) {
                setHelpPopoverWasOpened(true);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${!helpPopoverWasOpened ? "theme-bg-primary theme-text-primary-foreground hover:opacity-90" : ""}`}
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
                  README
                </h4>
                <div className="flex flex-col theme-gap-2 text-sm">
                  <p className="theme-font theme-tracking">
                    This README will be used in the next step to generate your
                    app directory structure and initial database configuration.
                  </p>
                  <p className="theme-font theme-tracking">
                    You can edit it directly in the editor below.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col theme-gap-3 items-center text-center">
          <CheckCircle2 className="h-12 w-12 theme-text-primary" />
          <div className="flex flex-col theme-gap-2">
            <h3 className="text-lg font-bold theme-text-foreground">
              {readmeWasPasted
                ? "README Added Successfully"
                : "README Generated Successfully"}
            </h3>
            <p>You can edit your readme directly below</p>
          </div>
        </div>
      </div>
    );
  }

  const isPending =
    isGeneratingPlan ||
    isGeneratingReadme ||
    isGeneratingPages ||
    isBatchGenerating;
  const isTitleValid = title.trim().length >= MIN_TITLE_LENGTH;
  const isDescriptionValid =
    description.trim().length >= MIN_DESCRIPTION_LENGTH;
  const canSubmitInitial = isTitleValid && isDescriptionValid;

  const MIN_LAYOUT_NAME_LENGTH = 2;

  const areLayoutsValid = layouts.every(
    (l) => l.name.trim().length >= MIN_LAYOUT_NAME_LENGTH
  );

  const canSubmitPages =
    (layouts.length === 0 || areLayoutsValid) &&
    pages.every(
      (p) =>
        p.name.trim().length >= MIN_PAGE_NAME_LENGTH &&
        p.description.trim().length >= MIN_PAGE_DESCRIPTION_LENGTH &&
        (!p.route.trim() || /^\/[a-zA-Z0-9\-/\[\]]*$/.test(p.route))
    );

  const canSubmitAuth = true;

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-2">
        <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
          <BookText className="h-5 w-5 theme-text-primary" />
          Generate your web app starter kit!
        </h2>
        <p className="theme-text-foreground">
          Follow the steps below to create a detailed README for your app.
          <br />
          This is the first step in generating a custom starter kit for your
          app&apos;s codebase.
        </p>
        <Popover
          open={starterKitPopoverOpen}
          onOpenChange={setStarterKitPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="link" className="theme-gap-2 w-fit px-0">
              What&apos;s a starter kit?
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] max-h-[500px] overflow-y-auto">
            <div className="flex flex-col theme-gap-4">
              <div className="flex items-center theme-gap-2">
                <PackageOpen className="h-5 w-5 theme-text-primary" />
                <h4 className="font-semibold text-base">Starter Kit</h4>
              </div>
              <div className="flex flex-col theme-gap-3 text-sm theme-text-foreground">
                <p>
                  A starter kit is a downloadable package containing all the
                  configuration files and documentation needed to initialize
                  your custom web application with AI assistance.
                </p>
                <p className="font-semibold">What&apos;s included:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Database schema and configuration</li>
                  <li>App directory structure with page specifications</li>
                  <li>Theme configuration (colors, fonts, components)</li>
                  <li>Step-by-step implementation plan</li>
                  <li>Code templates and patterns</li>
                  <li>Setup prompts for Claude Code</li>
                </ul>
                <p className="font-semibold">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Download your customized starter kit</li>
                  <li>Place it in your project directory</li>
                  <li>Copy and paste the provided prompt into Claude Code</li>
                  <li>
                    Claude reads your starter kit and scaffolds your entire
                    application
                  </li>
                </ol>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={handleAccordionChange}
        className="w-full"
      >
        <AccordionItem
          value="step-1-description"
          className="theme-border-border"
        >
          <AccordionTrigger className="hover:theme-text-primary group">
            <div className="flex items-center theme-gap-2">
              <Sparkles className="h-5 w-5 theme-text-primary" />
              <span className="font-semibold text-base lg:text-lg group-hover:underline">
                1. App Information
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col theme-gap-4 pt-4">
              <div className="flex flex-col theme-gap-2">
                <label className="font-semibold">App Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome App"
                  className="theme-shadow"
                  disabled={isPending}
                />
                <p className="text-xs theme-text-foreground font-semibold">
                  Minimum {MIN_TITLE_LENGTH} characters
                  {title.length > 0 &&
                    ` (${title.trim().length}/${MIN_TITLE_LENGTH})`}
                </p>
              </div>

              <div className="flex flex-col theme-gap-2">
                <label className="font-semibold">App Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Describe what your app does, who it's for, and the main features users will interact with..."
                  className="theme-shadow min-h-[120px]"
                  disabled={isPending}
                />
                <p className="text-xs theme-text-foreground font-semibold">
                  Minimum {MIN_DESCRIPTION_LENGTH} characters
                  {description.length > 0 &&
                    ` (${description.trim().length}/${MIN_DESCRIPTION_LENGTH})`}
                </p>
              </div>

              {stage !== "description" ? (
                <div className="flex flex-col sm:flex-row theme-gap-2">
                  <Button
                    onClick={handleSubmitInitial}
                    disabled={
                      isPending || !canSubmitInitial || !hasAuthInputChanged()
                    }
                    className="flex-1 theme-gap-2"
                  >
                    <Bot className="h-4 w-4" />
                    Regenerate Authentication
                  </Button>
                  <Button
                    onClick={() => setAccordionValue("step-2-auth")}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 theme-gap-2"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSubmitInitial}
                  disabled={isPending || !canSubmitInitial}
                  className="w-full theme-gap-2"
                >
                  <Bot className="h-4 w-4" />
                  Continue to Authentication
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="step-2-auth"
          className={`theme-border-border ${
            stage === "description" ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <AccordionTrigger
            className={`hover:theme-text-primary group ${
              stage === "description" ? "cursor-not-allowed" : ""
            }`}
          >
            <div className="flex items-center theme-gap-2">
              <Shield className="h-5 w-5 theme-text-primary" />
              <span className="font-semibold text-base lg:text-lg group-hover:underline">
                2. Authentication
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col theme-gap-4 pt-4">
              <div className="flex flex-col theme-gap-1">
                <h3 className="font-semibold text-lg">
                  Authentication Methods
                </h3>
                <p className="   theme-text-foreground font-semibold">
                  Select which authentication methods your app will support
                </p>
              </div>

              <div className="flex flex-col theme-gap-3">
                <div className="flex items-start theme-gap-3">
                  <Checkbox
                    id="emailPassword"
                    checked={authMethods.emailPassword}
                    onCheckedChange={() => toggleAuthMethod("emailPassword")}
                    disabled={isPending}
                  />
                  <div className="flex flex-col theme-gap-1 flex-1">
                    <div
                      className="text-sm font-semibold cursor-pointer"
                      onClick={() =>
                        !isPending && toggleAuthMethod("emailPassword")
                      }
                    >
                      Email & Password
                    </div>
                    <p
                      className="text-xs theme-text-foreground cursor-pointer"
                      onClick={() =>
                        !isPending && toggleAuthMethod("emailPassword")
                      }
                    >
                      Traditional authentication with email and password
                    </p>
                  </div>
                </div>

                <div className="flex items-start theme-gap-3">
                  <Checkbox
                    id="magicLink"
                    checked={authMethods.magicLink}
                    onCheckedChange={() => toggleAuthMethod("magicLink")}
                    disabled={isPending}
                  />
                  <div className="flex flex-col theme-gap-1 flex-1">
                    <div
                      className="text-sm font-semibold cursor-pointer"
                      onClick={() =>
                        !isPending && toggleAuthMethod("magicLink")
                      }
                    >
                      Magic Link
                    </div>
                    <p
                      className="text-xs theme-text-foreground cursor-pointer"
                      onClick={() =>
                        !isPending && toggleAuthMethod("magicLink")
                      }
                    >
                      Passwordless sign-in via a link sent to the user&apos;s
                      email
                    </p>
                  </div>
                </div>
              </div>
              <p className="italic">More options coming soon</p>
              {stage === "pages" ? (
                <div className="flex flex-col sm:flex-row theme-gap-2">
                  <Button
                    onClick={handleSubmitAuth}
                    disabled={
                      isPending || !canSubmitAuth || !hasPagesInputChanged()
                    }
                    className="flex-1 theme-gap-2"
                  >
                    {isGeneratingPages ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Regenerating pages...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Regenerate Pages
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setAccordionValue("step-3-pages")}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 theme-gap-2"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSubmitAuth}
                  disabled={isPending || !canSubmitAuth}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingPages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating pages...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      Continue to Pages
                    </>
                  )}
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="step-3-pages"
          className={`theme-border-border ${
            stage === "description" || stage === "auth"
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          <AccordionTrigger
            className={`hover:theme-text-primary group ${
              stage === "description" || stage === "auth"
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            <div className="flex items-center theme-gap-2">
              <BookText className="h-5 w-5 theme-text-primary" />
              <span className="font-semibold text-base lg:text-lg group-hover:underline">
                3. Layouts and Pages
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col theme-gap-4 pt-4">
              <div className="flex flex-col theme-gap-1">
                <h3 className="font-semibold text-lg">Define Your Layouts</h3>
                <p className="   theme-text-foreground font-semibold">
                  Layouts wrap your pages with shared UI elements. Configure
                  which components each layout includes: headers, sidebars,
                  footers, and their specific features. You can apply multiple
                  layouts to any page.
                </p>
              </div>

              {layouts.length > 0 && (
                <div className="theme-bg-card theme-radius theme-shadow overflow-auto theme-p-4">
                  <div className="flex flex-col theme-gap-2">
                    {layouts.map((layout, index) => (
                      <LayoutAccordionItem
                        key={layout.id}
                        layout={layout}
                        index={index}
                        totalLayouts={layouts.length}
                        isExpanded={expandedLayoutId === layout.id}
                        onToggle={() =>
                          setExpandedLayoutId(
                            expandedLayoutId === layout.id ? null : layout.id
                          )
                        }
                        onUpdate={handleUpdateLayoutLocal}
                        onDelete={handleDeleteLayoutLocal}
                        disabled={isPending}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handleAddLayout}
                disabled={isPending}
                className="w-full theme-gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Layout
              </Button>

              <div className="flex flex-col theme-gap-1 theme-pt-4">
                <h3 className="font-semibold text-lg">Define Your Pages</h3>
                <p className="   theme-text-foreground font-semibold">
                  Add, edit or remove pages. Include a description of the
                  purpose and function of each page.
                </p>
              </div>

              <div className="theme-bg-card theme-radius theme-shadow overflow-auto theme-p-4">
                <div className="flex flex-col theme-gap-2">
                  {pages.map((page, index) => {
                    const access = pageAccess.find(
                      (pa) => pa.pageId === page.id
                    );
                    return (
                      <PageAccordionItem
                        key={page.id}
                        page={page}
                        index={index}
                        totalPages={pages.length}
                        isExpanded={expandedPageId === page.id}
                        onToggle={() =>
                          setExpandedPageId(
                            expandedPageId === page.id ? null : page.id
                          )
                        }
                        onUpdate={handleUpdatePageLocal}
                        onDelete={handleDeletePageLocal}
                        disabled={isPending}
                        pageAccess={access}
                        onUpdateAccess={updatePageAccess}
                        layouts={layouts}
                      />
                    );
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleAddPage}
                disabled={isPending}
                className="w-full theme-gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Page
              </Button>

              {readmeGenerated ? (
                <div className="flex flex-col sm:flex-row theme-gap-2">
                  <Button
                    onClick={handleSubmitPages}
                    disabled={
                      isPending || !canSubmitPages || !hasAnyInputChanged()
                    }
                    className="flex-1 theme-gap-2"
                  >
                    {isGeneratingPlan ||
                    isGeneratingReadme ||
                    isBatchGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Regenerate README
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSuccessView(true);
                    }}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 theme-gap-2"
                  >
                    View README
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSubmitPages}
                  disabled={isPending || !canSubmitPages}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingPlan ||
                  isGeneratingReadme ||
                  isBatchGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating README...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      Generate README
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
};
