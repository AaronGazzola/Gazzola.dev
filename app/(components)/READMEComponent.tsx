"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  BookText,
  CheckCircle2,
  Copy,
  Database,
  Download,
  Loader2,
  Plus,
  Shield,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiApple, SiGithub, SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { useREADMEStore } from "./READMEComponent.stores";
import {
  DatabaseTable,
  generateId,
  PageInput,
  Stage,
} from "./READMEComponent.types";
import {
  generateAuthPrompt,
  generateDatabasePrompt,
  generateFinalReadmePrompt,
  generatePagesPrompt,
  parseAuthFromResponse,
  parseDatabaseFromResponse,
  parsePagesFromResponse,
} from "./READMEComponent.utils";
import { DatabaseTableAccordionItem } from "./READMEComponent/DatabaseTableAccordionItem";
import { PageAccordionItem } from "./READMEComponent/PageAccordionItem";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 50;
const MIN_PASTED_README_LENGTH = 50;
const MIN_PAGE_NAME_LENGTH = 2;
const MIN_PAGE_DESCRIPTION_LENGTH = 20;
const MIN_TABLE_NAME_LENGTH = 2;
const MIN_TABLE_DESCRIPTION_LENGTH = 20;

export const READMEComponent = () => {
  const {
    setContent,
    readmeGenerated,
    setReadmeGenerated,
    readmeWasPasted,
    setReadmeWasPasted,
    forceRefresh,
    getNode,
  } = useEditorStore();

  const {
    title,
    description,
    pastedReadme,
    showPasteSection,
    stage,
    pages,
    authMethods,
    pageAccess,
    databaseTables,
    setTitle,
    setDescription,
    setPastedReadme,
    setShowPasteSection,
    setStage,
    setPages,
    addPage,
    updatePage,
    deletePage,
    setAuthMethods,
    toggleAuthMethod,
    setPageAccess,
    updatePageAccess,
    setDatabaseTables,
    addDatabaseTable,
    updateDatabaseTable,
    deleteDatabaseTable,
  } = useREADMEStore();

  const [accordionValue, setAccordionValue] =
    useState<string>("step-1-description");
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null);
  const [expandedTableId, setExpandedTableId] = useState<string | null>(null);
  const hasAutoExpandedRef = useRef(false);

  useEffect(() => {
    const accordionMap: Record<Stage, string> = {
      description: "step-1-description",
      pages: "step-2-pages",
      auth: "step-3-auth",
      database: "step-4-database",
    };
    setAccordionValue(accordionMap[stage]);
  }, [stage]);

  useEffect(() => {
    if (pages.length > 0 && !hasAutoExpandedRef.current) {
      setExpandedPageId(pages[0].id);
      hasAutoExpandedRef.current = true;
    }
  }, [pages]);

  const handleAccordionChange = useCallback(
    (value: string) => {
      const accordionMap: Record<string, Stage> = {
        "step-1-description": "description",
        "step-2-pages": "pages",
        "step-3-auth": "auth",
        "step-4-database": "database",
      };

      const targetStage = accordionMap[value];

      if (!targetStage) {
        setAccordionValue(value);
        return;
      }

      const stageIndexMap: Record<Stage, number> = {
        description: 0,
        pages: 1,
        auth: 2,
        database: 3,
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

  const { mutate: generateAuth, isPending: isGeneratingAuth } =
    useCodeGeneration((response) => {
      const parsed = parseAuthFromResponse(response.content, pages);
      if (parsed) {
        setAuthMethods(parsed.authMethods);
        setPageAccess(parsed.pageAccess);
        setStage("auth");
      }
    });

  const { mutate: generateDatabase, isPending: isGeneratingDatabase } =
    useCodeGeneration((response) => {
      const parsed = parseDatabaseFromResponse(response.content);
      if (parsed && parsed.length > 0) {
        setDatabaseTables(parsed);
        setStage("database");
      } else {
        const fallbackTables: DatabaseTable[] = [
          { id: generateId(), name: "users", description: "" },
        ];
        setDatabaseTables(fallbackTables);
        setStage("database");
        toast.warning(
          "Could not generate tables automatically. Default table added.",
          {
            duration: 5000,
          }
        );
      }
    });

  const { mutate: generateReadme, isPending: isGeneratingReadme } =
    useCodeGeneration((response) => {
      setContent(
        "readme",
        `<!-- component-READMEComponent -->\n\n${response.content}`
      );
      setReadmeGenerated(true);
      forceRefresh();
    });

  const { mutate: generatePages, isPending: isGeneratingPages } =
    useCodeGeneration((response) => {
      const parsedPages = parsePagesFromResponse(response.content);

      if (parsedPages && parsedPages.length > 0) {
        setPages(parsedPages);
        setStage("pages");
      } else {
        const fallbackPages: PageInput[] = [
          { id: generateId(), name: "Home", route: "/", description: "" },
          {
            id: generateId(),
            name: "Dashboard",
            route: "/dashboard",
            description: "",
          },
        ];
        setPages(fallbackPages);
        setStage("pages");
        toast.warning(
          "Could not generate pages automatically. Default pages added.",
          {
            duration: 5000,
          }
        );
      }
    });

  const handleSubmitInitial = useCallback(() => {
    if (pastedReadme.trim()) {
      setContent(
        "readme",
        `<!-- component-READMEComponent -->\n\n${pastedReadme.trim()}`
      );
      setReadmeGenerated(true);
      setReadmeWasPasted(true);
      forceRefresh();
      return;
    }

    const prompt = generatePagesPrompt(title, description);
    generatePages({ prompt, maxTokens: 800 });
  }, [
    pastedReadme,
    title,
    description,
    setContent,
    setReadmeGenerated,
    setReadmeWasPasted,
    forceRefresh,
    generatePages,
  ]);

  const handleSubmitPages = useCallback(() => {
    const prompt = generateAuthPrompt(title, description, pages);
    generateAuth({ prompt, maxTokens: 1000 });
  }, [title, description, pages, generateAuth]);

  const handleSubmitAuth = useCallback(() => {
    const prompt = generateDatabasePrompt(title, description, pages);
    generateDatabase({ prompt, maxTokens: 1500 });
  }, [title, description, pages, generateDatabase]);

  const handleSubmitDatabase = useCallback(() => {
    const prompt = generateFinalReadmePrompt(
      title,
      description,
      pages,
      authMethods,
      pageAccess,
      databaseTables
    );
    generateReadme({ prompt, maxTokens: 3000 });
  }, [
    title,
    description,
    pages,
    authMethods,
    pageAccess,
    databaseTables,
    generateReadme,
  ]);

  const handleAddPage = () => {
    const newPage: PageInput = {
      id: generateId(),
      name: "",
      route: "",
      description: "",
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

  const handleAddDatabaseTable = () => {
    const newTable: DatabaseTable = {
      id: generateId(),
      name: "",
      description: "",
    };
    addDatabaseTable(newTable);
    setExpandedTableId(newTable.id);
  };

  const handleUpdateDatabaseTableLocal = (
    id: string,
    updates: Partial<DatabaseTable>
  ) => {
    updateDatabaseTable(id, updates);
  };

  const handleDeleteDatabaseTableLocal = (id: string) => {
    if (databaseTables.length === 1) return;
    deleteDatabaseTable(id);
    if (expandedTableId === id) {
      setExpandedTableId(null);
    }
  };

  const getRawReadmeContent = useCallback(() => {
    const readmeNode = getNode("readme");
    if (readmeNode && readmeNode.type === "file" && readmeNode.content) {
      const content = readmeNode.content;
      const prefix = "<!-- component-READMEComponent -->\n\n";
      if (content.startsWith(prefix)) {
        return content.slice(prefix.length);
      }
      return content;
    }
    return "";
  }, [getNode]);

  const handleCopyReadme = useCallback(() => {
    const content = getRawReadmeContent();
    if (!content) {
      toast.error("No README content to copy");
      return;
    }
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success("README copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy README to clipboard");
      }
    );
  }, [getRawReadmeContent]);

  const handleDownloadReadme = useCallback(() => {
    const content = getRawReadmeContent();
    if (!content) {
      toast.error("No README content to download");
      return;
    }
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("README downloaded!");
  }, [getRawReadmeContent]);

  if (readmeGenerated) {
    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col theme-gap-3 items-center text-center">
          <CheckCircle2 className="h-12 w-12 theme-text-primary" />
          <div className="flex flex-col theme-gap-2">
            <h3 className="text-lg font-bold theme-text-foreground">
              {readmeWasPasted
                ? "README Added Successfully"
                : "README Generated Successfully"}
            </h3>
            <p className="   theme-text-foreground font-semibold mt-2">
              This README will be used in the next step to generate your app
              directory structure and initial database configuration. You can
              edit it directly in the editor below.
            </p>
          </div>
        </div>
        <div className="flex theme-gap-2 w-full">
          <Button
            onClick={handleCopyReadme}
            variant="outline"
            className="flex-1 theme-gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy README
          </Button>
          <Button
            onClick={handleDownloadReadme}
            variant="outline"
            className="flex-1 theme-gap-2"
          >
            <Download className="h-4 w-4" />
            Download README
          </Button>
        </div>
      </div>
    );
  }

  const isPending =
    isGeneratingAuth ||
    isGeneratingDatabase ||
    isGeneratingReadme ||
    isGeneratingPages;
  const isTitleValid = title.trim().length >= MIN_TITLE_LENGTH;
  const isDescriptionValid =
    description.trim().length >= MIN_DESCRIPTION_LENGTH;
  const isPastedReadmeValid =
    pastedReadme.trim().length >= MIN_PASTED_README_LENGTH;
  const canSubmitInitial =
    isPastedReadmeValid || (isTitleValid && isDescriptionValid);

  const canSubmitPages = pages.every(
    (p) =>
      p.name.trim().length >= MIN_PAGE_NAME_LENGTH &&
      p.description.trim().length >= MIN_PAGE_DESCRIPTION_LENGTH &&
      (!p.route.trim() || /^\/[a-z0-9\-/\[\]]*$/.test(p.route))
  );

  const canSubmitAuth = true;

  const canSubmitDatabase = databaseTables.every(
    (t) =>
      t.name.trim().length >= MIN_TABLE_NAME_LENGTH &&
      t.description.trim().length >= MIN_TABLE_DESCRIPTION_LENGTH
  );

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-2">
        <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
          <BookText className="h-5 w-5 theme-text-primary" />
          Generate your custom Next.js web app!
        </h2>
        <p className="theme-text-foreground">
          Follow the steps below to create a detailed README for your app.
          <br />
          This is the first step in generating your app&apos;s codebase.
        </p>
      </div>

      <Button
        variant="link"
        onClick={() => setShowPasteSection(!showPasteSection)}
        disabled={isPending}
        className="w-fit px-0 theme-text-primary -mt-1 text-base"
      >
        {showPasteSection ? (
          <>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Generate a README instead
          </>
        ) : (
          <>
            Already have a README?
            <ArrowRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>

      {showPasteSection ? (
        <div className="flex flex-col theme-gap-4">
          <div className="flex flex-col theme-gap-2">
            <h3 className="font-semibold text-lg">Paste your README file</h3>
            <p className="theme-text-foreground font-semibold">
              Paste the contents of your README file in Markdown formatting.
              This will be used in the next step to generate your app.
            </p>
            <Textarea
              value={pastedReadme}
              onChange={(e) => setPastedReadme(e.target.value)}
              placeholder="# My App&#10;&#10;Paste your README content here..."
              className="theme-shadow min-h-[180px] font-mono   "
              disabled={isPending}
            />
            <p className="text-xs theme-text-foreground font-semibold">
              Minimum {MIN_PASTED_README_LENGTH} characters
              {pastedReadme.length > 0 &&
                ` (${pastedReadme.trim().length}/${MIN_PASTED_README_LENGTH})`}
            </p>
          </div>

          <Button
            onClick={handleSubmitInitial}
            disabled={isPending || !isPastedReadmeValid}
            className="w-full theme-gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding README...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Add README
              </>
            )}
          </Button>
        </div>
      ) : (
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

                <Button
                  onClick={handleSubmitInitial}
                  disabled={isPending || !canSubmitInitial}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingPages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating pages...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Continue to Pages
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="step-2-pages"
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
                <BookText className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  2. Pages
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col theme-gap-4 pt-4">
                <div className="flex flex-col theme-gap-1">
                  <h3 className="font-semibold text-lg">Define Your Pages</h3>
                  <p className="   theme-text-foreground font-semibold">
                    Add, edit or remove pages. Include a description of the
                    purpose and function of each page.
                  </p>
                </div>

                <div className="flex flex-col theme-gap-2">
                  {pages.map((page, index) => (
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
                    />
                  ))}
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

                <Button
                  onClick={handleSubmitPages}
                  disabled={isPending || !canSubmitPages}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingAuth ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating auth & access...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Continue to Authentication
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="step-3-auth"
            className={`theme-border-border ${
              stage !== "auth" && stage !== "database"
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <AccordionTrigger
              className={`hover:theme-text-primary group ${
                stage !== "auth" && stage !== "database"
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <div className="flex items-center theme-gap-2">
                <Shield className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  3. Authentication & Role Access
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

                <div className="flex flex-wrap theme-gap-2">
                  <Badge
                    variant={authMethods.emailPassword ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("emailPassword")}
                  >
                    Email & Password
                  </Badge>

                  <Badge
                    variant={authMethods.magicLink ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("magicLink")}
                  >
                    Magic Link
                  </Badge>

                  <Badge
                    variant={authMethods.phoneAuth ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("phoneAuth")}
                  >
                    Phone
                  </Badge>

                  <Badge
                    variant={authMethods.otp ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("otp")}
                  >
                    OTP
                  </Badge>

                  <Badge
                    variant={authMethods.googleAuth ? "default" : "outline"}
                    className="cursor-pointer flex theme-gap-1"
                    onClick={() => toggleAuthMethod("googleAuth")}
                  >
                    <SiGoogle className="h-3 w-3" />
                    Google
                  </Badge>

                  <Badge
                    variant={authMethods.githubAuth ? "default" : "outline"}
                    className="cursor-pointer flex theme-gap-1"
                    onClick={() => toggleAuthMethod("githubAuth")}
                  >
                    <SiGithub className="h-3 w-3" />
                    GitHub
                  </Badge>

                  <Badge
                    variant={authMethods.appleAuth ? "default" : "outline"}
                    className="cursor-pointer flex theme-gap-1"
                    onClick={() => toggleAuthMethod("appleAuth")}
                  >
                    <SiApple className="h-3 w-3" />
                    Apple
                  </Badge>

                  <Badge
                    variant={
                      authMethods.emailVerification ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("emailVerification")}
                  >
                    Email Verification
                  </Badge>

                  <Badge
                    variant={authMethods.mfa ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAuthMethod("mfa")}
                  >
                    MFA
                  </Badge>
                </div>

                <div className="flex flex-col theme-gap-2 theme-mt-2">
                  <h3 className="font-semibold text-lg">Page Access Levels</h3>
                  <p className="   theme-text-foreground font-semibold">
                    Define who can access each page
                  </p>
                  <div className="flex flex-col theme-gap-2">
                    {pages.map((page) => {
                      const access = pageAccess.find(
                        (pa) => pa.pageId === page.id
                      );
                      return (
                        <div
                          key={page.id}
                          className="flex items-center justify-between theme-p-2 theme-bg-muted theme-radius"
                        >
                          <div className="flex items-center theme-gap-2 flex-1">
                            <span className="text-sm font-semibold theme-text-foreground">
                              {page.name}
                            </span>
                            <span className="text-xs theme-font-mono theme-bg-secondary theme-text-secondary-foreground px-1.5 py-0.5 theme-radius">
                              {page.route}
                            </span>
                          </div>
                          <div className="flex theme-gap-1">
                            <Badge
                              variant={access?.public ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() =>
                                updatePageAccess(
                                  page.id,
                                  "public",
                                  !access?.public
                                )
                              }
                            >
                              Public
                            </Badge>
                            <Badge
                              variant={access?.user ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() =>
                                updatePageAccess(page.id, "user", !access?.user)
                              }
                            >
                              User
                            </Badge>
                            <Badge
                              variant={access?.admin ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() =>
                                updatePageAccess(
                                  page.id,
                                  "admin",
                                  !access?.admin
                                )
                              }
                            >
                              Admin
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleSubmitAuth}
                  disabled={isPending || !canSubmitAuth}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingDatabase ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating database tables...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Continue to Database
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="step-4-database"
            className={`theme-border-border ${
              stage !== "database" ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <AccordionTrigger
              className={`hover:theme-text-primary group ${
                stage !== "database" ? "cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center theme-gap-2">
                <Database className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  4. Database Tables
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col theme-gap-4 pt-4">
                <div className="flex flex-col theme-gap-1">
                  <h3 className="font-semibold text-lg">Define Your Tables</h3>
                  <p className="   theme-text-foreground font-semibold">
                    Add, edit or remove database tables. Include a description
                    of what each table stores.
                  </p>
                </div>

                <div className="flex flex-col theme-gap-2">
                  {databaseTables.map((table, index) => (
                    <DatabaseTableAccordionItem
                      key={table.id}
                      table={table}
                      index={index}
                      totalTables={databaseTables.length}
                      isExpanded={expandedTableId === table.id}
                      onToggle={() =>
                        setExpandedTableId(
                          expandedTableId === table.id ? null : table.id
                        )
                      }
                      onUpdate={handleUpdateDatabaseTableLocal}
                      onDelete={handleDeleteDatabaseTableLocal}
                      disabled={isPending}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleAddDatabaseTable}
                  disabled={isPending}
                  className="w-full theme-gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Table
                </Button>

                <Button
                  onClick={handleSubmitDatabase}
                  disabled={isPending || !canSubmitDatabase}
                  className="w-full theme-gap-2"
                >
                  {isGeneratingReadme ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating README...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Final README
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
