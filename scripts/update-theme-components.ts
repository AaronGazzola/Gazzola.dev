import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const THEME_MD_PATH = join(
  process.cwd(),
  "public/data/markdown/Start_here/2-Theme.md"
);
const COMPONENTS_DIR = join(process.cwd(), "components/editor/ui");

const START_COMMENT = "<!-- Themed components start -->";
const END_COMMENT = "<!-- Themed components end -->";

function getComponentName(filename: string): string {
  return filename
    .replace(".tsx", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function generateComponentsContent(): string {
  const files = readdirSync(COMPONENTS_DIR)
    .filter((file) => file.endsWith(".tsx"))
    .sort();

  const components = files.map((file) => {
    const componentPath = join(COMPONENTS_DIR, file);
    const content = readFileSync(componentPath, "utf-8");
    const componentName = getComponentName(file);

    return `### ${componentName}\n\n\`\`\`tsx\n${content}\n\`\`\``;
  });

  return components.join("\n\n");
}

function updateThemeMarkdown(): void {
  const themeContent = readFileSync(THEME_MD_PATH, "utf-8");

  const startIndex = themeContent.indexOf(START_COMMENT);
  const endIndex = themeContent.indexOf(END_COMMENT);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "Could not find comment markers in Theme.md file"
    );
  }

  const beforeComments = themeContent.substring(0, startIndex + START_COMMENT.length);
  const afterComments = themeContent.substring(endIndex);

  const componentsContent = generateComponentsContent();

  const updatedContent = `${beforeComments}\n\n${componentsContent}\n\n${afterComments}`;

  writeFileSync(THEME_MD_PATH, updatedContent, "utf-8");

  console.log(JSON.stringify({success:true,componentsUpdated:readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".tsx")).length}));
}

updateThemeMarkdown();
