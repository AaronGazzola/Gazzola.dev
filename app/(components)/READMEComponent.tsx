"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { Loader2, Sparkles, MessageCircleQuestion } from "lucide-react";
import { useCallback, useState } from "react";

type Stage = "initial" | "questions";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 50;

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface READMEState {
  title: string;
  description: string;
  questions: Question[];
  stage: Stage;
}

const parseQuestionsFromResponse = (response: string): Question[] => {
  const lines = response.split("\n").filter((line) => line.trim());
  const questions: Question[] = [];

  for (const line of lines) {
    const cleanedLine = line.replace(/^\d+[\.\)]\s*/, "").trim();
    if (cleanedLine.endsWith("?")) {
      questions.push({
        id: `q-${questions.length + 1}`,
        question: cleanedLine,
        answer: "",
      });
    }
  }

  return questions.slice(0, 5);
};

const QuestionAnswerItem = ({
  question,
  onAnswerChange,
}: {
  question: Question;
  onAnswerChange: (id: string, answer: string) => void;
}) => {
  return (
    <div className="flex flex-col theme-gap-2 theme-p-3 theme-bg-muted theme-radius">
      <div className="flex items-start theme-gap-2">
        <MessageCircleQuestion className="h-5 w-5 theme-text-primary shrink-0 mt-0.5" />
        <p className="text-sm font-semibold theme-text-foreground">
          {question.question}
        </p>
      </div>
      <Textarea
        value={question.answer}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
        placeholder="Your answer..."
        className="theme-shadow min-h-[80px] text-sm"
      />
    </div>
  );
};

export const READMEComponent = () => {
  const { setContent, readmeGenerated, setReadmeGenerated, forceRefresh } =
    useEditorStore();

  const [state, setState] = useState<READMEState>({
    title: "",
    description: "",
    questions: [],
    stage: "initial",
  });

  if (readmeGenerated) {
    return null;
  }

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
        `# README\n\n<!-- component-READMEComponent -->\n\n${generatedContent}`
      );
      setReadmeGenerated(true);
      forceRefresh();
    });

  const handleSubmitInitial = useCallback(() => {
    const prompt = `You are helping a user create a README for their web application. Based on their initial description, generate 3-5 clarifying questions to better understand the functionality and user experience.

App Title: ${state.title}
App Description: ${state.description}

Generate questions that will help clarify:
- The main pages/screens of the application
- The primary user workflows and interactions
- Key components and their functionality
- The target audience and their goals
- Any unique features or user experience elements

Format: Return ONLY the questions, one per line, numbered 1-5. Each question should end with a question mark. Do not include any other text or explanations.`;

    generateQuestions({ prompt, maxTokens: 500 });
  }, [state.title, state.description, generateQuestions]);

  const handleSubmitAnswers = useCallback(() => {
    const qaPairs = state.questions
      .map((q) => `Q: ${q.question}\nA: ${q.answer || "Not answered"}`)
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

  const handleAnswerChange = useCallback((id: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, answer } : q
      ),
    }));
  }, []);

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
                onAnswerChange={handleAnswerChange}
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
