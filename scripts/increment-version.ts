import fs from "fs";
import path from "path";

const VERSION_FILE = path.join(process.cwd(), "public", "data", "content-version.json");

function incrementVersion(): void {
  try {
    let currentVersion = 1;

    if (fs.existsSync(VERSION_FILE)) {
      const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
      currentVersion = versionData.version || 1;
    }

    const newVersion = currentVersion + 1;

    fs.mkdirSync(path.dirname(VERSION_FILE), { recursive: true });
    fs.writeFileSync(
      VERSION_FILE,
      JSON.stringify({ version: newVersion }, null, 2),
      "utf8"
    );

    console.log(`Content version incremented: ${currentVersion} → ${newVersion}`);
    console.log("✅ Version incremented successfully!");
  } catch (error) {
    console.error("Error during version increment:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  incrementVersion();
}