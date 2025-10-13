import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, cpSync } from "fs";
import { join } from "path";

const SOURCE_DIR = join(process.cwd(), "components/editor/ui");
const DEST_DIR = join(process.cwd(), "public/data/components/ui");

function copyComponentFiles(): void {
  if (existsSync(DEST_DIR)) {
    cpSync(DEST_DIR, DEST_DIR + "_backup", { recursive: true, force: true });
  }

  mkdirSync(DEST_DIR, { recursive: true });

  const files = readdirSync(SOURCE_DIR).filter((file) => file.endsWith(".tsx"));

  files.forEach((file) => {
    const sourcePath = join(SOURCE_DIR, file);
    const destPath = join(DEST_DIR, file);
    const content = readFileSync(sourcePath, "utf-8");
    writeFileSync(destPath, content, "utf-8");
  });

  console.log(JSON.stringify({success:true,componentsCopied:files.length}));
}

copyComponentFiles();
