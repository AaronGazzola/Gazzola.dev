import { TestCase, TestSuite } from "@/app/(editor)/layout.types";

export const kebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generateTestCommand = (title: string): string => {
  return `npm run test:${kebabCase(title)}`;
};

export const generateTestsMarkdown = (testSuites: TestSuite[]): string => {
  let markdown = "# Tests Documentation\n\n";

  markdown += "## Run All Tests\n\n";
  markdown += "**Command:** `npm run test`\n";
  markdown += "✓ Runs the complete test suite across all test files\n\n";

  markdown += "## Test Index\n\n";
  testSuites.forEach((suite, index) => {
    const commandName = kebabCase(suite.name);
    markdown += `${index + 1}. [${suite.name}](#${index + 1}-${commandName}) - \`npm run test:${commandName}\`\n`;
  });
  markdown += "\n";

  testSuites.forEach((suite, index) => {
    const commandName = kebabCase(suite.name);
    markdown += `## ${index + 1}. ${suite.name}\n\n`;
    markdown += `**File:** \`__tests__/${commandName}.test.ts\`\n`;
    markdown += `**Command:** \`${suite.command}\`\n\n`;

    if (suite.description) {
      markdown += `${suite.description}\n\n`;
    }

    suite.testCases.forEach((testCase) => {
      markdown += `### ${testCase.description}\n\n`;
      markdown += `- ${testCase.description}\n`;
      markdown += `  ✓ ${testCase.passCondition}\n\n`;
    });
  });

  return markdown;
};

export const validateTestSuite = (suite: TestSuite): boolean => {
  if (!suite.name || suite.name.trim() === "") return false;
  if (!suite.command || suite.command.trim() === "") return false;
  return true;
};

export const createEmptyTestSuite = (): Omit<TestSuite, "id"> => ({
  name: "New Test Suite",
  description: "",
  command: "npm run test:new-test-suite",
  testCases: [],
});

export const createEmptyTestCase = (): Omit<TestCase, "id"> => ({
  description: "should test something",
  passCondition: "Expected behavior occurs",
});
