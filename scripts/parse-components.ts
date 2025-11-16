import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const COMPONENTS_SOURCE_DIR = join(process.cwd(), "components/editor/ui");

function generateComponentRegistry(): void {
  const files = readdirSync(COMPONENTS_SOURCE_DIR).filter((file) => file.endsWith(".tsx"));

  const registryEntries = files.map((file) => {
    const sourcePath = join(COMPONENTS_SOURCE_DIR, file);
    let content = readFileSync(sourcePath, "utf-8");
    content = content.replace(/theme-/g, "");
    content = content.replace(/@\/lib\/tailwind\.utils/g, "@/lib/utils");
    content = content.replace(/@\/components\/editor\/ui/g, "@/components/ui");

    const componentName = file.replace(".tsx", "");
    const escapedContent = JSON.stringify(content);

    return `  "${componentName}": ${escapedContent},`;
  });

  const registryContent = `export const componentFileContents: Record<string, string> = {
${registryEntries.join('\n')}
};

export const componentFileNames = Object.keys(componentFileContents);
`;

  const registryPath = join(process.cwd(), "lib", "component-files.generated.ts");
  writeFileSync(registryPath, registryContent, "utf-8");

  console.log(JSON.stringify({success:true,componentsRegistered:files.length}));
}

generateComponentRegistry();
