"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { conditionalLog } from "@/lib/log.util";
import fs from "fs";
import path from "path";
import { MarkdownData } from "./layout.types";

const OUTPUT_FILE = path.join(process.cwd(), "public", "data", "processed-markdown.json");
const VERSION_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "content-version.json"
);



export const getContentVersionAction = async (): Promise<
  ActionResponse<number>
> => {
  try {
    console.log(conditionalLog("getContentVersionAction: Starting", { label: "markdown-parse" }));

    if (!fs.existsSync(VERSION_FILE)) {
      console.log(conditionalLog("getContentVersionAction: Version file not found, returning 1", { label: "markdown-parse" }));
      return getActionResponse({ data: 1 });
    }

    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
    const version = versionData.version || 1;

    console.log(conditionalLog({ version, versionFile: VERSION_FILE }, { label: "markdown-parse" }));

    return getActionResponse({ data: version });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const parseMarkdownAction = async (): Promise<ActionResponse<MarkdownData>> => {
  try {
    console.log(conditionalLog("parseMarkdownAction: Starting", { label: "markdown-parse" }));

    if (!fs.existsSync(OUTPUT_FILE)) {
      console.log(conditionalLog({ error: "Processed markdown file not found" }, { label: "markdown-parse" }));
      return getActionResponse({ error: "Processed markdown file not found. Run 'npm run parse' first." });
    }

    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const markdownData: MarkdownData = JSON.parse(fileContent);

    console.log(conditionalLog({
      nodeCount: Object.keys(markdownData.flatIndex).length,
      contentVersion: markdownData.contentVersion
    }, { label: "markdown-parse" }));

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const parseAndGetMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(conditionalLog("parseAndGetMarkdownDataAction: Starting", { label: "markdown-parse" }));

    if (!fs.existsSync(OUTPUT_FILE)) {
      console.log(conditionalLog({ error: "Processed markdown file not found" }, { label: "markdown-parse" }));
      return getActionResponse({ error: "Processed markdown file not found. Run 'npm run parse' first." });
    }

    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const markdownData: MarkdownData = JSON.parse(fileContent);

    console.log(conditionalLog({
      nodeCount: Object.keys(markdownData.flatIndex).length,
      contentVersion: markdownData.contentVersion
    }, { label: "markdown-parse" }));

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const getMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(conditionalLog("getMarkdownDataAction: Starting", { label: "markdown-parse" }));

    if (!fs.existsSync(OUTPUT_FILE)) {
      console.log(conditionalLog({ error: "Processed markdown file not found" }, { label: "markdown-parse" }));
      return getActionResponse({ error: "Processed markdown file not found. Run 'npm run parse' first." });
    }

    console.log(conditionalLog({ message: "Reading from file", outputFile: OUTPUT_FILE }, { label: "markdown-parse" }));

    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const data: MarkdownData = JSON.parse(fileContent);

    console.log(conditionalLog({
      nodeCount: Object.keys(data.flatIndex).length,
      contentVersion: data.contentVersion
    }, { label: "markdown-parse" }));

    return getActionResponse({ data });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};
