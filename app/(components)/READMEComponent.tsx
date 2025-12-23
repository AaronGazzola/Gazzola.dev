"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/editor/ui/radio-group";
import { Textarea } from "@/components/editor/ui/textarea";
import { extractJsonArrayFromResponse } from "@/lib/ai-response.utils";
import { LOG_LABELS } from "@/lib/log.util";
import {
  CheckCircle2,
  Loader2,
  MessageCircleQuestion,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";

type Stage = "initial" | "questions";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 50;

interface QuestionOption {
  id: string;
  label: string;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: QuestionOption[];
  selectedOptions: string[];
  additionalInfo: string;
}

interface READMEState {
  title: string;
  description: string;
  questions: Question[];
  stage: Stage;
}

interface QuestionAIResponse {
  question: string;
  type?: "single" | "multiple";
  options?: string[];
}

const parseQuestionsFromResponse = (response: string): Question[] => {
  const parsed = extractJsonArrayFromResponse<QuestionAIResponse>(
    response,
    LOG_LABELS.README
  );

  if (parsed) {
    return parsed.slice(0, 5).map((q, index) => {
      const questionText = typeof q === "string" ? q : q.question;
      const questionType =
        typeof q === "string" ? "single" : q.type || "single";
      const rawOptions = typeof q === "string" ? [] : q.options || [];

      return {
        id: `q-${index + 1}`,
        question: questionText,
        type: questionType,
        options: rawOptions.map((opt, optIndex) => ({
          id: `q-${index + 1}-opt-${optIndex + 1}`,
          label: opt,
        })),
        selectedOptions: [],
        additionalInfo: "",
      };
    });
  }

  const lines = response.split("\n").filter((line) => line.trim());
  const questions: Question[] = [];

  for (const line of lines) {
    const cleanedLine = line.replace(/^\d+[\.\)]\s*/, "").trim();
    if (cleanedLine.endsWith("?")) {
      questions.push({
        id: `q-${questions.length + 1}`,
        question: cleanedLine,
        type: "single",
        options: [],
        selectedOptions: [],
        additionalInfo: "",
      });
    }
  }

  return questions.slice(0, 5);
};

const QuestionAnswerItem = ({
  question,
  onOptionSelect,
  onClearSelection,
  onAdditionalInfoChange,
}: {
  question: Question;
  onOptionSelect: (
    questionId: string,
    optionId: string,
    isSelected: boolean
  ) => void;
  onClearSelection: (questionId: string) => void;
  onAdditionalInfoChange: (questionId: string, text: string) => void;
}) => {
  const hasSelection = question.selectedOptions.length > 0;

  return (
    <div className="flex flex-col theme-gap-3 theme-p-3 theme-bg-muted theme-radius">
      <div className="flex items-start justify-between theme-gap-2">
        <div className="flex items-start theme-gap-2 flex-1">
          <MessageCircleQuestion className="h-5 w-5 theme-text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-semibold theme-text-foreground">
            {question.question}
          </p>
        </div>
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClearSelection(question.id)}
            className="h-6 px-2 theme-text-muted-foreground hover:theme-text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {question.options.length > 0 && (
        <div className="pl-7">
          {question.type === "single" ? (
            <RadioGroup
              value={question.selectedOptions[0] || ""}
              onValueChange={(value) =>
                onOptionSelect(question.id, value, true)
              }
              className="flex flex-col theme-gap-2"
            >
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center theme-gap-2 cursor-pointer"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span className="text-sm theme-text-foreground">
                    {option.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex flex-col theme-gap-2">
              {question.options.map((option) => {
                const isChecked = question.selectedOptions.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex items-center theme-gap-2 cursor-pointer"
                  >
                    <Checkbox
                      id={option.id}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        onOptionSelect(question.id, option.id, checked === true)
                      }
                    />
                    <span className="text-sm theme-text-foreground">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="pl-7">
        <label className="text-xs theme-text-muted-foreground font-semibold block mb-1">
          Additional details (optional)
        </label>
        <Textarea
          value={question.additionalInfo}
          onChange={(e) => onAdditionalInfoChange(question.id, e.target.value)}
          placeholder="Add any extra context..."
          className="theme-shadow min-h-[60px] text-sm"
        />
      </div>
    </div>
  );
};

const initialState: READMEState = {
  title: "",
  description: "",
  questions: [],
  stage: "initial",
};

export const READMEComponent = () => {
  const { setContent, readmeGenerated, setReadmeGenerated, forceRefresh } =
    useEditorStore();

  const [state, setState] = useState<READMEState>(initialState);

  const { mutate: generateQuestions, isPending: isGeneratingQuestions } =
    useCodeGeneration((response) => {
      const questions = parseQuestionsFromResponse(response.content);
      setState((prev) => ({
        ...prev,
        questions,
        stage: "questions",
      }));
    });

  const { mutate: generateReadme, isPending: isGeneratingReadme } =
    useCodeGeneration((response) => {
      const generatedContent = response.content;
      setContent(
        "readme",
        `<!-- component-READMEComponent -->\n\n${generatedContent}`
      );
      setReadmeGenerated(true);
      forceRefresh();
    });

  const handleSubmitInitial = useCallback(() => {
    const prompt = `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with [ end with ]

App Title: ${state.title}
App Description: ${state.description}

Generate 3-5 clarifying questions about the application. Each question should have multiple choice options.
Topics to cover:
- Main pages/screens of the application
- Primary user workflows and interactions
- Key components and their functionality
- Target audience and their goals
- Unique features or user experience elements

JSON Format (array of question objects with options):
[
  {"question": "What type of authentication will users need?", "type": "single", "options": ["Email/Password", "Social Login", "Magic Link", "No authentication"]},
  {"question": "Which main pages will your app have?", "type": "multiple", "options": ["Dashboard", "User Profile", "Settings", "Landing Page", "Admin Panel"]},
  {"question": "Who is the primary target audience?", "type": "single", "options": ["Consumers/General public", "Business professionals", "Developers", "Students/Educators"]}
]

Rules:
- Use "single" type when user should pick exactly one option
- Use "multiple" type when user can select several options
- Provide 3-6 relevant options per question
- Options should be concise (1-4 words each)`;

    generateQuestions({ prompt, maxTokens: 1000 });
  }, [state.title, state.description, generateQuestions]);

  const handleSubmitAnswers = useCallback(() => {
    const qaPairs = state.questions
      .map((q) => {
        const selectedLabels = q.selectedOptions
          .map((optId) => q.options.find((opt) => opt.id === optId)?.label)
          .filter(Boolean)
          .join(", ");

        const selected = selectedLabels || "Not answered";
        const additional = q.additionalInfo.trim()
          ? `\nAdditional: ${q.additionalInfo.trim()}`
          : "";

        return `Q: ${q.question}\nSelected: ${selected}${additional}`;
      })
      .join("\n\n");

    const prompt = `Generate a detailed, professional README.md for a web application based on the following information:

App Title: ${state.title}
Initial Description: ${state.description}

Additional Details from Q&A:
${qaPairs}

Requirements:
- Write in a friendly, professional tone for end users
- Focus entirely on what the app DOES for users and how they interact with it
- Describe each page/screen of the application with its primary components and functionality
- Explain the user experience pathway - how users navigate through the app
- Include sections: Overview, Pages & Features (describe each page), User Workflow, Getting Started (from a user perspective)
- Be detailed about functionality and UX, but do NOT include any technical implementation details
- Do NOT mention databases, APIs, frameworks, programming languages, or any development tools
- Do NOT include installation instructions for developers
- Use markdown formatting with headers, bullet points, and clear organization
- Write 400-600 words`;

    generateReadme({ prompt, maxTokens: 3000 });
  }, [state, generateReadme]);

  const handleOptionSelect = useCallback(
    (questionId: string, optionId: string, isSelected: boolean) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== questionId) return q;

          if (q.type === "single") {
            return { ...q, selectedOptions: isSelected ? [optionId] : [] };
          }

          const newSelected = isSelected
            ? [...q.selectedOptions, optionId]
            : q.selectedOptions.filter((id) => id !== optionId);

          return { ...q, selectedOptions: newSelected };
        }),
      }));
    },
    []
  );

  const handleClearSelection = useCallback((questionId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, selectedOptions: [] } : q
      ),
    }));
  }, []);

  const handleAdditionalInfoChange = useCallback(
    (questionId: string, text: string) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, additionalInfo: text } : q
        ),
      }));
    },
    []
  );

  if (readmeGenerated) {
    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col theme-gap-3 items-center text-center">
          <CheckCircle2 className="h-12 w-12 theme-text-primary" />
          <div className="flex flex-col theme-gap-2">
            <h3 className="text-lg font-bold theme-text-foreground">
              README Generated Successfully
            </h3>
            <p className="text-sm theme-text-muted-foreground">
              Your README file has been created and is now available for editing.
              You can modify it directly to better describe your application.
            </p>
            <p className="text-sm theme-text-foreground font-semibold mt-2">
              This README will be used in the next step to generate your app
              directory structure and initial database configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPending = isGeneratingQuestions || isGeneratingReadme;
  const isTitleValid = state.title.trim().length >= MIN_TITLE_LENGTH;
  const isDescriptionValid =
    state.description.trim().length >= MIN_DESCRIPTION_LENGTH;
  const canSubmitInitial = isTitleValid && isDescriptionValid;
  const canSubmitAnswers = state.questions.length > 0;

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      {state.stage === "initial" && (
        <>
          <div className="flex flex-col theme-gap-2 mb-4">
            <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
              <Sparkles className="h-5 w-5 theme-text-primary" />
              Generate your custom Next.js web app!
            </h2>
            <p className="theme-text-foreground">
              Enter a title and description to generate your README file, then
              click &quot;Next&quot; to continue.
              <br />
              This is the first step in a process that will generate a starter
              kit for your custom Next.js web app.
            </p>
          </div>

          <div className="flex flex-col theme-gap-2">
            <label className="font-semibold">App Title</label>
            <Input
              value={state.title}
              onChange={(e) =>
                setState((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="My Awesome App"
              className="theme-shadow"
              disabled={isPending}
            />
            <p className="text-xs theme-text-muted-foreground font-semibold">
              Minimum {MIN_TITLE_LENGTH} characters
              {state.title.length > 0 &&
                ` (${state.title.trim().length}/${MIN_TITLE_LENGTH})`}
            </p>
          </div>

          <div className="flex flex-col theme-gap-2">
            <label className="font-semibold">App Description</label>
            <Textarea
              value={state.description}
              onChange={(e) =>
                setState((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what your app does, who it's for, and the main features users will interact with..."
              className="theme-shadow min-h-[120px]"
              disabled={isPending}
            />
            <p className="text-xs theme-text-muted-foreground font-semibold">
              Minimum {MIN_DESCRIPTION_LENGTH} characters
              {state.description.length > 0 &&
                ` (${state.description.trim().length}/${MIN_DESCRIPTION_LENGTH})`}
            </p>
          </div>

          <Button
            onClick={handleSubmitInitial}
            disabled={isPending || !canSubmitInitial}
            className="w-full theme-gap-2"
          >
            {isGeneratingQuestions ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating questions...
              </>
            ) : (
              <>
                <MessageCircleQuestion className="h-4 w-4" />
                Continue
              </>
            )}
          </Button>
        </>
      )}

      {state.stage === "questions" && (
        <>
          <div className="flex flex-col theme-gap-1">
            <h3 className="font-semibold text-lg">
              Help us understand your app better
            </h3>
            <p className="text-sm theme-text-muted-foreground font-semibold">
              Answer these questions to generate a detailed README
            </p>
          </div>

          <div className="flex flex-col theme-gap-3">
            {state.questions.map((question) => (
              <QuestionAnswerItem
                key={question.id}
                question={question}
                onOptionSelect={handleOptionSelect}
                onClearSelection={handleClearSelection}
                onAdditionalInfoChange={handleAdditionalInfoChange}
              />
            ))}
          </div>

          <Button
            onClick={handleSubmitAnswers}
            disabled={isPending || !canSubmitAnswers}
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
                Generate README
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
};
