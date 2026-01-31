"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useSubdomainStore } from "@/app/layout.subdomain.store";
import { Button } from "@/components/editor/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateAndDownloadZip } from "@/lib/download.utils";
import {
  ArrowRight,
  BookText,
  CheckCircle2,
  ChevronRight,
  Database,
  ExternalLink,
  FolderDown,
  FolderTree,
  Laptop,
  PackageOpen,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useNextStepsStore } from "./NextStepsComponent.stores";
import type { StepData } from "./NextStepsComponent.types";
import {
  ClaudeCodeLogo,
  generateFinalPrompt,
  GitHubSmallLogo,
  SupabaseLogo,
  VercelLogo,
  VSCodeLogo,
} from "./NextStepsComponent.utils";
import { useREADMEStore } from "./READMEComponent.stores";

export const NextStepsComponent = () => {
  const { openStep, setOpenStep, unlockedSteps, unlockStep } =
    useNextStepsStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [promptPopoverOpen, setPromptPopoverOpen] = useState(false);

  const {
    data,
    codeFiles,
    getSectionInclude,
    getSectionContent,
    getSectionOptions,
    appStructure,
    getPlaceholderValue,
    setPlaceholderValue,
    getInitialConfiguration,
    readmeGenerated,
    appStructureGenerated,
  } = useEditorStore();

  const { title: appTitle } = useREADMEStore();
  const { brand } = useSubdomainStore();

  const initialConfiguration = getInitialConfiguration();
  const isNoDatabaseSelected =
    initialConfiguration.questions.databaseProvider === "none";

  const starterKitName = `${(appTitle || "My_Project").replace(/\s+/g, "_")}_Starter_Kit`;
  const finalPrompt = generateFinalPrompt(starterKitName, brand);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const projectName = appTitle || "My_Project";
      setPlaceholderValue("projectName", projectName);

      await generateAndDownloadZip(
        data,
        codeFiles,
        getSectionInclude,
        getSectionContent,
        getSectionOptions,
        appStructure,
        getPlaceholderValue,
        getInitialConfiguration
      );
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleNext = (currentStepId: number) => {
    const nextStepId = currentStepId + 1;
    unlockStep(nextStepId);
    setOpenStep(`step-${nextStepId}`);

    const stepAfterNext = nextStepId + 1;
    if (stepAfterNext <= 8 && !unlockedSteps.has(stepAfterNext)) {
      unlockStep(stepAfterNext);
    }
  };

  const handleStepChange = (value: string) => {
    setOpenStep(value);
    if (value) {
      const stepId = parseInt(value.replace("step-", ""));
      const nextStepId = stepId + 1;
      if (nextStepId <= 8 && !unlockedSteps.has(nextStepId)) {
        unlockStep(nextStepId);
      }
    }
  };

  const steps: StepData[] = [
    {
      id: 1,
      title: "Create GitHub Account & Repository",
      description: "Set up version control for your project",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create GitHub Account
            </h4>
            <p className="theme-text-foreground mb-3">
              If you don&apos;t already have one, sign up for a free GitHub
              account.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://github.com/signup", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Go to GitHub Signup
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create a New Private Repository
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside">
              <li>Name your project</li>
              <li>Select &quot;Private&quot; for repository visibility</li>
              <li>Do NOT initialize with README</li>
              <li>Click &quot;Create repository&quot;</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2 mt-3 text-base"
              onClick={() => window.open("https://github.com/new", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Create New Repository
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Install Visual Studio Code",
      description: "Get the code editor for development",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Download VS Code
            </h4>
            <p className="theme-text-foreground mb-3">
              Visual Studio Code is a free, open-source code editor.
            </p>
            <ul className="theme-text-foreground space-y-2 list-disc list-inside">
              <li>Download the installer for your operating system</li>
              <li>Run the installer and follow the setup wizard</li>
              <li>Launch VS Code after installation completes</li>
            </ul>
            <Button
              variant="outline"
              className="theme-gap-2 mt-4 text-base"
              onClick={() =>
                window.open("https://code.visualstudio.com/download", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Download VS Code
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Create Claude Account & Subscription",
      description: "Set up AI assistance for development",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create Claude Account
            </h4>
            <p className="theme-text-foreground mb-3">
              Claude is an AI assistant that will help you build your
              application.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://claude.ai/signup", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Sign Up for Claude
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Choose a Subscription
            </h4>
            <p className="theme-text-foreground mb-3">
              Select a subscription tier that fits your needs. The Pro tier is
              recommended for active development.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://claude.ai/upgrade", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Pricing
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Install Claude Code Extension",
      description: "Add Claude to your VS Code editor",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Install from VS Code Marketplace
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Click the &quot;View in Marketplace&quot; button below</li>
              <li>Click &quot;Install&quot; on the marketplace page</li>
              <li>VS Code will automatically open and install the extension</li>
              <li>Sign in with your Claude account when prompted</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() =>
                window.open(
                  "https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code",
                  "_blank"
                )
              }
            >
              <ExternalLink className="h-4 w-4" />
              View in Marketplace
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Create Supabase Account & Project",
      description: "Set up your database and backend services",
      content: isNoDatabaseSelected ? (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              No Database Configured
            </h4>
            <p className="theme-text-foreground mb-3">
              This app is configured as a front-end only application without a
              database. If you need database functionality, you can configure it
              on the database page.
            </p>
            <Link href="/database">
              <Button variant="outline" className="theme-gap-2 text-base">
                <Database className="h-4 w-4" />
                Configure Database
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create Supabase Account
            </h4>
            <p className="theme-text-foreground mb-3">
              Supabase provides your database and authentication services.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() =>
                window.open("https://supabase.com/dashboard/sign-up", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Sign Up for Supabase
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create a New Project
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Click &quot;New Project&quot; in your dashboard</li>
              <li>Choose a project name</li>
              <li>Create a strong database password (save this!)</li>
              <li>Select a region close to your users</li>
              <li>Click &quot;Create new project&quot;</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() =>
                window.open("https://supabase.com/dashboard/new", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Clone your repository",
      description: "Connect VS Code to your GitHub repository",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Get Your Repository URL
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Navigate to your GitHub repository from step 1</li>
              <li>
                In the &quot;Quick setup&quot; section, click the
                &quot;HTTPS&quot; button
              </li>
              <li>Click the copy icon to copy the repository URL</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Go to GitHub
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Clone Repository in VS Code
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Open VS Code</li>
              <li>
                Open Command Palette (Cmd+Shift+P on Mac, Ctrl+Shift+P on
                Windows)
              </li>
              <li>Type &quot;Git: Clone&quot; and select it</li>
              <li>Paste your HTTPS repository URL</li>
              <li>Choose a folder location on your computer</li>
              <li>When prompted, sign in to GitHub through your browser</li>
              <li>Click &quot;Open&quot; to open the cloned folder</li>
            </ol>
            <p className="theme-text-foreground text-sm italic">
              Note: VS Code will authenticate with GitHub through your browser.
              This is normal and only needs to be done once.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Deploy with Vercel (Optional)",
      description: "Set up automatic deployments",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create Vercel Account
            </h4>
            <p className="theme-text-foreground mb-3">
              Vercel provides free hosting and automatic deployments for your
              Next.js application.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://vercel.com/signup", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Sign Up for Vercel
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Connect Your Repository
            </h4>
            <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Import your GitHub repository</li>
              <li>
                Add environment variables (from the process in the previous
                step)
              </li>
              <li>Click &quot;Deploy&quot;</li>
            </ol>
            <p className="theme-text-foreground mb-3">
              Your app will automatically deploy to a preview URL when you push
              a git commit to the main branch.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2 text-base"
              onClick={() => window.open("https://vercel.com/new", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Import Project to Vercel
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Download your starter kit",
      description: "Get your project documentation and templates",
      content:
        !readmeGenerated || !appStructureGenerated ? (
          <div className="flex flex-col theme-gap-4">
            <div className="theme-bg-muted theme-radius theme-p-4">
              <h4 className="font-semibold theme-text-foreground mb-2">
                Complete Configuration First
              </h4>
              <p className="theme-text-foreground mb-3">
                Before downloading your starter kit, you need to complete the
                following configuration steps:
              </p>
              <div className="flex flex-col theme-gap-2">
                {!readmeGenerated && (
                  <Link href="/readme">
                    <Button
                      variant="outline"
                      className="theme-gap-2 w-full py-3 h-auto text-base"
                    >
                      <BookText className="h-4 w-4" />
                      Generate README
                    </Button>
                  </Link>
                )}
                {!appStructureGenerated && (
                  <Link href="/app-structure">
                    <Button
                      variant="outline"
                      className="theme-gap-2 w-full py-3 h-auto text-base"
                    >
                      <FolderTree className="h-4 w-4" />
                      Generate App Structure
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col theme-gap-4">
            <div className="theme-bg-muted theme-radius theme-p-4">
              <ol className="theme-text-foreground space-y-2 list-decimal list-inside mb-3">
                <li>Download your starter kit (ZIP file)</li>
                <li>
                  Move the starter kit ZIP into the top level of your project
                  directory
                </li>
                <li>
                  Copy the prompt below and paste it into Claude Code in VS Code
                </li>
                <li className="ml-4 list-none">
                  <p className="text-sm italic mt-1">
                    Note: The prompt will guide Claude to unpack the starter kit, including moving the{" "}
                    <code className="theme-bg-card px-1 rounded">.claude</code> folder to your project root.
                    After unpacking, Claude will ask you to close the chat and start a new one to load the permissions.
                  </p>
                </li>
              </ol>
              <Popover
                open={promptPopoverOpen}
                onOpenChange={setPromptPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="link" className="theme-gap-2 w-full mb-4">
                    View prompt
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] max-h-[400px] overflow-y-auto">
                  <pre className="text-xs theme-text-foreground whitespace-pre-wrap font-mono">
                    {finalPrompt}
                  </pre>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={() => handleCopy(finalPrompt, "final")}
                className="w-full flex flex-col items-center py-6 h-auto mb-4"
              >
                {copied === "final" ? (
                  <>
                    <CheckCircle2
                      className="h-5 w-5 mr-2 flex-shrink-0"
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    <span className="text-lg">Copied!</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center theme-gap-3">
                      <ScrollText
                        className="flex-shrink-0"
                        style={{ width: "2rem", height: "2rem" }}
                      />
                      <ArrowRight
                        className="flex-shrink-0"
                        style={{ width: "1.5rem", height: "1.5rem" }}
                      />
                      <ClaudeCodeLogo
                        className="flex-shrink-0"
                        style={{ width: "2rem", height: "2rem" }}
                      />
                    </div>
                    <span className="text-lg sm:inline hidden mt-3">
                      Click here to copy the prompt
                    </span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                className="w-full flex flex-col items-center py-6 h-auto"
                size="lg"
              >
                {downloaded ? (
                  <>
                    <CheckCircle2
                      className="h-5 w-5 mr-2 flex-shrink-0"
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    <span className="text-lg sm:inline hidden">
                      Starter kit downloaded!
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center theme-gap-3">
                      <FolderDown
                        className="flex-shrink-0"
                        style={{ width: "2rem", height: "2rem" }}
                      />
                      <ArrowRight
                        className="flex-shrink-0"
                        style={{ width: "1.5rem", height: "1.5rem" }}
                      />
                      <VSCodeLogo
                        className="flex-shrink-0"
                        style={{ width: "2rem", height: "2rem" }}
                      />
                    </div>
                    <span className="text-lg sm:inline hidden mt-3">
                      Download your Starter Kit
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ),
    },
  ];

  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 1:
        return <GitHubSmallLogo className="h-5 w-5 flex-shrink-0" />;
      case 2:
        return <VSCodeLogo className="h-5 w-5 flex-shrink-0" />;
      case 3:
        return <ClaudeCodeLogo className="h-5 w-5 flex-shrink-0" />;
      case 4:
        return (
          <div className="flex flex-col sm:flex-row items-center gap-0.5 flex-shrink-0 mr-1 lg:mr-2">
            <ClaudeCodeLogo className="h-5 w-5 flex-shrink-0" />
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
            <VSCodeLogo className="h-5 w-5 flex-shrink-0" />
          </div>
        );
      case 5:
        return <SupabaseLogo className="h-5 w-5 flex-shrink-0" />;
      case 6:
        return (
          <div className="flex flex-col sm:flex-row items-center gap-0.5 flex-shrink-0 mr-1 lg:mr-2">
            <GitHubSmallLogo className="h-5 w-5 flex-shrink-0" />
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
            <VSCodeLogo className="h-5 w-5 flex-shrink-0" />
          </div>
        );
      case 7:
        return <VercelLogo className="h-5 w-5 flex-shrink-0" />;
      case 8:
        return <PackageOpen className="h-5 w-5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-2 mb-4">
        <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
          <Laptop className="h-5 w-5 flex-shrink-0 theme-text-primary" />
          Set Up Your Development Environment
        </h2>
        <p className="theme-text-foreground">
          Follow these steps start building your web app with AI.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        value={openStep}
        onValueChange={handleStepChange}
        className="w-full"
      >
        {steps.map((step, index) => {
          const isUnlocked = unlockedSteps.has(step.id);
          const isLastStep = index === steps.length - 1;

          return (
            <AccordionItem
              key={step.id}
              value={`step-${step.id}`}
              disabled={!isUnlocked}
              className="theme-border-border"
            >
              <AccordionTrigger
                className={`${
                  !isUnlocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:theme-text-primary"
                } group`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-base lg:text-lg min-w-[1.5rem] lg:min-w-[1.75rem] mr-px">
                    {step.id}
                  </span>
                  <div className="scale-100 lg:scale-125 origin-left mr-3 lg:mr-5">
                    {getStepIcon(step.id)}
                  </div>
                  <span className="font-semibold text-base lg:text-lg group-hover:underline">
                    {step.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-base flex flex-col theme-gap-4 pt-4">
                  {step.content}
                  {!isLastStep && (
                    <Button
                      onClick={() => handleNext(step.id)}
                      className="theme-gap-2 w-full"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
