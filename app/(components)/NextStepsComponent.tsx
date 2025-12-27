"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { generateAndDownloadZip } from "@/lib/download.utils";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { StepData } from "./NextStepsComponent.types";
import {
  ClaudeCodeLogo,
  FINAL_PROMPT,
  GitHubSmallLogo,
  NextJsLogo,
  NodeJsLogo,
  SETUP_PROMPT,
  SupabaseLogo,
  VercelLogo,
  VSCodeLogo,
} from "./NextStepsComponent.utils";

export const NextStepsComponent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const {
    data,
    codeFiles,
    getSectionInclude,
    getSectionContent,
    getSectionOptions,
    appStructure,
    getPlaceholderValue,
    getInitialConfiguration,
  } = useEditorStore();

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
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const steps: StepData[] = [
    {
      id: 0,
      title: "Welcome to Your Next.js Journey",
      description:
        "Let's set up your development environment step by step",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <p className="text-sm theme-text-foreground font-semibold mb-4">
              This wizard will guide you through:
            </p>
            <ul className="text-sm theme-text-foreground space-y-2">
              <li className="flex items-start theme-gap-2">
                <span className="theme-text-primary font-bold">1.</span>
                <span>Creating necessary accounts (GitHub, Claude, Supabase)</span>
              </li>
              <li className="flex items-start theme-gap-2">
                <span className="theme-text-primary font-bold">2.</span>
                <span>Installing development tools (VSCode, Claude Code)</span>
              </li>
              <li className="flex items-start theme-gap-2">
                <span className="theme-text-primary font-bold">3.</span>
                <span>Setting up your project environment</span>
              </li>
              <li className="flex items-start theme-gap-2">
                <span className="theme-text-primary font-bold">4.</span>
                <span>Downloading your custom starter kit</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4 theme-p-4 theme-bg-muted theme-radius">
            <div className="flex flex-col items-center theme-gap-2">
              <GitHubSmallLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                GitHub
              </span>
            </div>
            <div className="flex flex-col items-center theme-gap-2">
              <VSCodeLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                VS Code
              </span>
            </div>
            <div className="flex flex-col items-center theme-gap-2">
              <ClaudeCodeLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                Claude
              </span>
            </div>
            <div className="flex flex-col items-center theme-gap-2">
              <SupabaseLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                Supabase
              </span>
            </div>
            <div className="flex flex-col items-center theme-gap-2">
              <NodeJsLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                Node.js
              </span>
            </div>
            <div className="flex flex-col items-center theme-gap-2">
              <NextJsLogo className="h-12 w-12" />
              <span className="text-xs theme-text-muted-foreground text-center">
                Next.js
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Create GitHub Account & Repository",
      description: "Set up version control for your project",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="flex justify-center theme-mb-4">
            <GitHubSmallLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Step 1: Create GitHub Account
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              If you don&apos;t already have one, sign up for a free GitHub account.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
              onClick={() => window.open("https://github.com/signup", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Go to GitHub Signup
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Step 2: Create a New Private Repository
            </h4>
            <ol className="text-sm theme-text-foreground space-y-2 list-decimal list-inside">
              <li>Click the &quot;+&quot; icon in the top right → New repository</li>
              <li>Choose a repository name for your project</li>
              <li>Select &quot;Private&quot; for repository visibility</li>
              <li>Do NOT initialize with README (we&apos;ll add files later)</li>
              <li>Click &quot;Create repository&quot;</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2 mt-3"
              onClick={() =>
                window.open("https://github.com/new", "_blank")
              }
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
          <div className="flex justify-center theme-mb-4">
            <VSCodeLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Download VS Code
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Visual Studio Code is a free, open-source code editor with
              excellent support for JavaScript, TypeScript, and Next.js
              development.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
              onClick={() =>
                window.open("https://code.visualstudio.com/download", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Download VS Code
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Installation Steps
            </h4>
            <ul className="text-sm theme-text-foreground space-y-2 list-disc list-inside">
              <li>Download the installer for your operating system</li>
              <li>Run the installer and follow the setup wizard</li>
              <li>Launch VS Code after installation completes</li>
            </ul>
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
          <div className="flex justify-center theme-mb-4">
            <ClaudeCodeLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create Claude Account
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Claude is an AI assistant that will help you build your
              application.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
              onClick={() =>
                window.open("https://claude.ai/signup", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Sign Up for Claude
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Choose a Subscription
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Select a subscription tier that fits your needs. The Pro tier is
              recommended for active development.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
              onClick={() =>
                window.open("https://claude.ai/upgrade", "_blank")
              }
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
          <div className="flex justify-center theme-gap-4 theme-mb-4">
            <VSCodeLogo className="h-16 w-16" />
            <ClaudeCodeLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Install from VS Code Marketplace
            </h4>
            <ol className="text-sm theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Open Visual Studio Code</li>
              <li>Click the Extensions icon in the sidebar (or press Ctrl+Shift+X)</li>
              <li>Search for &quot;Claude Code&quot;</li>
              <li>Click &quot;Install&quot; on the official Claude Code extension</li>
              <li>Sign in with your Claude account when prompted</li>
            </ol>
            <Button
              variant="outline"
              className="theme-gap-2"
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
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="flex justify-center theme-mb-4">
            <SupabaseLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Step 1: Create Supabase Account
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Supabase provides your database and authentication services.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
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
              Step 2: Create a New Project
            </h4>
            <ol className="text-sm theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Click &quot;New Project&quot; in your dashboard</li>
              <li>Choose a project name</li>
              <li>Create a strong database password (save this!)</li>
              <li>Select a region close to your users</li>
              <li>Click &quot;Create new project&quot;</li>
            </ol>
            <p className="text-xs theme-text-muted-foreground font-semibold">
              Note: You&apos;ll need your Project URL, Anon Key, and Service Role Key
              in the next step. Find these in Project Settings → API.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Setup Your Development Environment",
      description: "Use Claude to configure everything",
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Copy this prompt to Claude Code
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Paste this prompt into Claude Code in VS Code. Claude will help you
              install Git, Node.js, Next.js, configure Supabase, set up your
              GitHub SSH keys, and push your initial commit.
            </p>
            <div className="theme-bg-card theme-radius theme-p-4 max-h-96 overflow-y-auto mb-3 border theme-border-border">
              <pre className="text-xs theme-text-foreground whitespace-pre-wrap font-mono">
                {SETUP_PROMPT}
              </pre>
            </div>
            <Button
              onClick={() => handleCopy(SETUP_PROMPT, "setup")}
              className="theme-gap-2 w-full"
            >
              {copied === "setup" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Deploy with Vercel (Optional)",
      description: "Set up automatic deployments",
      isOptional: true,
      content: (
        <div className="flex flex-col theme-gap-4">
          <div className="flex justify-center theme-mb-4">
            <VercelLogo className="h-16 w-16" />
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Create Vercel Account
            </h4>
            <p className="text-sm theme-text-foreground mb-3">
              Vercel provides free hosting and automatic deployments for your
              Next.js application.
            </p>
            <Button
              variant="outline"
              className="theme-gap-2"
              onClick={() =>
                window.open("https://vercel.com/signup", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Sign Up for Vercel
            </Button>
          </div>
          <div className="theme-bg-muted theme-radius theme-p-4">
            <h4 className="font-semibold theme-text-foreground mb-2">
              Connect Your Repository
            </h4>
            <ol className="text-sm theme-text-foreground space-y-2 list-decimal list-inside mb-3">
              <li>Click &quot;Add New Project&quot;</li>
              <li>Import your GitHub repository</li>
              <li>Configure your build settings (Next.js auto-detected)</li>
              <li>Add environment variables:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </li>
              <li>Click &quot;Deploy&quot;</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Download Your Starter Kit",
      description: "Get your custom-configured project files",
      content: (
        <div className="flex flex-col theme-gap-4">
          {!downloaded ? (
            <>
              <div className="theme-bg-muted theme-radius theme-p-4">
                <h4 className="font-semibold theme-text-foreground mb-2">
                  Download Your Starter Kit
                </h4>
                <p className="text-sm theme-text-foreground mb-3">
                  Your starter kit includes all the configured files, components,
                  and setup instructions based on your selections throughout this
                  process.
                </p>
                <Button
                  onClick={handleDownload}
                  className="theme-gap-2 w-full"
                  size="lg"
                >
                  <Download className="h-5 w-5" />
                  Download Starter Kit
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col theme-gap-4 items-center text-center">
                <CheckCircle2 className="h-16 w-16 theme-text-primary" />
                <h4 className="font-semibold text-lg theme-text-foreground">
                  Starter Kit Downloaded!
                </h4>
                <p className="text-sm theme-text-foreground">
                  Extract the ZIP file and follow the instructions below.
                </p>
              </div>
              <div className="theme-bg-muted theme-radius theme-p-4">
                <h4 className="font-semibold theme-text-foreground mb-2">
                  Next Steps with Claude
                </h4>
                <p className="text-sm theme-text-foreground mb-3">
                  Copy this prompt and paste it into Claude Code to help you set
                  up the starter kit:
                </p>
                <div className="theme-bg-card theme-radius theme-p-4 mb-3 border theme-border-border">
                  <pre className="text-xs theme-text-foreground whitespace-pre-wrap font-mono">
                    {FINAL_PROMPT}
                  </pre>
                </div>
                <Button
                  onClick={() => handleCopy(FINAL_PROMPT, "final")}
                  className="theme-gap-2 w-full"
                >
                  {copied === "final" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
              <div className="flex flex-col theme-gap-3 items-center text-center theme-p-4 theme-bg-primary theme-radius">
                <Sparkles className="h-8 w-8 theme-text-primary-foreground" />
                <p className="text-sm font-semibold theme-text-primary-foreground">
                  You&apos;re all set! Happy coding! 🎉
                </p>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <Progress value={(currentStep / (totalSteps - 1)) * 100} className="mb-2" />
      <p className="text-sm theme-text-muted-foreground text-center font-semibold">
        Step {currentStep + 1} of {totalSteps}
        {currentStepData.isOptional && (
          <Badge variant="outline" className="ml-2 text-xs">
            Optional
          </Badge>
        )}
      </p>

      <div className="flex flex-col theme-gap-2 mb-4">
        <h2 className="text-xl font-bold theme-text-foreground">
          {currentStepData.title}
        </h2>
        <p className="theme-text-muted-foreground font-semibold">
          {currentStepData.description}
        </p>
      </div>

      <div className="theme-gap-4">{currentStepData.content}</div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className="theme-gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === totalSteps - 1}
          className="theme-gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
