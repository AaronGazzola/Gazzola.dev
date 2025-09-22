import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const VERSION_FILE = path.join(process.cwd(), "data", "content-version.json");
const PARSE_SCRIPT = path.join(process.cwd(), "scripts", "parse-markdown.ts");

function incrementVersion(): void {
  try {
    let currentVersion = 1;

    if (fs.existsSync(VERSION_FILE)) {
      const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
      currentVersion = versionData.version || 1;
    }

    const newVersion = currentVersion + 1;

    fs.writeFileSync(
      VERSION_FILE,
      JSON.stringify({ version: newVersion }, null, 2),
      "utf8"
    );

    console.log(`Content version incremented: ${currentVersion} → ${newVersion}`);

    console.log("Running markdown parser...");
    execSync(`npx tsx "${PARSE_SCRIPT}"`, { stdio: "inherit" });

    console.log("✅ Version incremented and data regenerated successfully!");
  } catch (error) {
    console.error("Error during version increment:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  incrementVersion();
}