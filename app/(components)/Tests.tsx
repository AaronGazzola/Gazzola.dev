"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { TestCase, TestSuite } from "@/app/(editor)/layout.types";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { cn } from "@/lib/tailwind.utils";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Edit,
  Plus,
  RefreshCw,
  Trash2,
  Download,
} from "lucide-react";
import { useState } from "react";
import {
  createEmptyTestCase,
  createEmptyTestSuite,
  generateTestsMarkdown,
} from "./Tests.utils";

const TestCaseItem = ({
  testCase,
  suiteId,
  onUpdate,
  onRemove,
}: {
  testCase: TestCase;
  suiteId: string;
  onUpdate: (updates: Partial<TestCase>) => void;
  onRemove: () => void;
}) => {
  const darkMode = useEditorStore((state) => state.darkMode);

  return (
    <div
      className={cn(
        "theme-p-2 theme-rounded theme-border",
        darkMode ? "theme-bg-muted/50" : "theme-bg-background"
      )}
    >
      <div className="flex items-start theme-gap-2">
        <span className="theme-text-muted-foreground mt-1">•</span>
        <div className="flex-1">
          {testCase.isEditing ? (
            <div className="space-y-2">
              <Input
                value={testCase.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Test description"
                className="theme-shadow"
              />
              <div className="flex items-start theme-gap-2">
                <span className="theme-text-muted-foreground mt-2">✓</span>
                <Input
                  value={testCase.passCondition}
                  onChange={(e) => onUpdate({ passCondition: e.target.value })}
                  placeholder="Pass condition"
                  className="theme-shadow"
                />
              </div>
              <div className="flex theme-gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUpdate({ isEditing: false })}
                >
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={onRemove}>
                  <Trash2 className="h-4 w-4 theme-text-destructive" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => onUpdate({ isEditing: true })}
            >
              <div className="theme-text-foreground">{testCase.description}</div>
              <div className="flex items-start theme-gap-1 theme-mt-1 theme-text-muted-foreground text-sm">
                <span>✓</span>
                <span>{testCase.passCondition}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestSuiteCard = ({
  suite,
  index,
  canMoveUp,
  canMoveDown,
}: {
  suite: TestSuite;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) => {
  const {
    updateTestSuite,
    removeTestSuite,
    reorderTestSuites,
    addTestCase,
    updateTestCase,
    removeTestCase,
  } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const darkMode = useEditorStore((state) => state.darkMode);

  const handleUpdate = (updates: Partial<TestSuite>) => {
    updateTestSuite(suite.id, updates);
  };

  const handleRemove = () => {
    removeTestSuite(suite.id);
  };

  const handleMoveUp = () => {
    if (canMoveUp) {
      reorderTestSuites(index, index - 1);
    }
  };

  const handleMoveDown = () => {
    if (canMoveDown) {
      reorderTestSuites(index, index + 1);
    }
  };

  const handleAddTestCase = () => {
    addTestCase(suite.id, createEmptyTestCase());
  };

  return (
    <div
      className={cn(
        "theme-border theme-rounded theme-p-4",
        darkMode ? "theme-bg-card" : "theme-bg-background"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center theme-gap-2">
            <span className="theme-text-muted-foreground font-mono">
              {index + 1}.
            </span>

            {suite.isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={suite.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                  placeholder="Test suite name"
                  className="theme-shadow"
                />
                <Textarea
                  value={suite.description}
                  onChange={(e) => handleUpdate({ description: e.target.value })}
                  placeholder="Description"
                  className="theme-shadow"
                  rows={2}
                />
                <Input
                  value={suite.command}
                  onChange={(e) => handleUpdate({ command: e.target.value })}
                  placeholder="Command"
                  className="theme-shadow font-mono text-sm"
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-medium theme-text-foreground">
                  {suite.name}
                </h3>
                {suite.description && (
                  <p className="theme-text-muted-foreground text-sm theme-mt-1">
                    {suite.description}
                  </p>
                )}
                <div className="theme-mt-2 text-sm theme-font-mono theme-text-muted-foreground">
                  {suite.command}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex theme-gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleUpdate({ isEditing: !suite.isEditing })}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-4 w-4 theme-text-destructive" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="theme-mt-4">
          <div className="flex items-center justify-between theme-mb-2">
            <h4 className="text-sm font-medium theme-text-foreground">
              Test Cases
            </h4>
            <Button variant="outline" size="sm" onClick={handleAddTestCase}>
              <Plus className="h-4 w-4 theme-mr-1" />
              Add Test Case
            </Button>
          </div>

          <div className="space-y-2">
            {suite.testCases.length === 0 ? (
              <p className="theme-text-muted-foreground text-sm theme-p-4 text-center">
                No test cases defined. Click &ldquo;Add Test Case&rdquo; to create one.
              </p>
            ) : (
              suite.testCases.map((testCase) => (
                <TestCaseItem
                  key={testCase.id}
                  testCase={testCase}
                  suiteId={suite.id}
                  onUpdate={(updates) =>
                    updateTestCase(suite.id, testCase.id, updates)
                  }
                  onRemove={() => removeTestCase(suite.id, testCase.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TestIndexHeader = ({
  onAddSuite,
  onReset,
  onGenerate,
  isGenerating,
}: {
  onAddSuite: () => void;
  onReset: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center theme-gap-2 flex-wrap">
      <Button variant="default" onClick={onAddSuite} className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
        <Plus className="h-3 w-3 md:h-4 md:w-4 theme-mr-1" />
        Add Test Suite
      </Button>
      <Button variant="outline" onClick={onReset} className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
        <RefreshCw className="h-3 w-3 md:h-4 md:w-4 theme-mr-1" />
        Reset from Features
      </Button>
      <Button variant="outline" onClick={onGenerate} disabled={isGenerating} className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
        <Download className="h-3 w-3 md:h-4 md:w-4 theme-mr-1" />
        {isGenerating ? "Generating..." : "Generate Markdown"}
      </Button>
    </div>
  );
};

export const Tests = () => {
  const { testSuites, addTestSuite, resetTestsFromFeatures } = useEditorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const darkMode = useEditorStore((state) => state.darkMode);

  const handleReset = () => {
    resetTestsFromFeatures();
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const markdown = generateTestsMarkdown(testSuites);

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tests.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleAddSuite = () => {
    addTestSuite(createEmptyTestSuite());
  };

  return (
    <div
      className={cn(
        "theme-p-4 theme-rounded",
        darkMode ? "theme-bg-background" : "theme-bg-card"
      )}
    >
      <TestIndexHeader
        onAddSuite={handleAddSuite}
        onReset={handleReset}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      <div className="theme-mt-4 space-y-4">
        {testSuites.map((suite, index) => (
          <TestSuiteCard
            key={suite.id}
            suite={suite}
            index={index}
            canMoveUp={index > 0}
            canMoveDown={index < testSuites.length - 1}
          />
        ))}
      </div>

      {testSuites.length === 0 && (
        <div className="theme-p-8 text-center theme-text-muted-foreground">
          No test suites defined. Click &ldquo;Reset from Features&rdquo; to generate test
          suites from your app features, or &ldquo;Add Test Suite&rdquo; to create one
          manually.
        </div>
      )}
    </div>
  );
};
