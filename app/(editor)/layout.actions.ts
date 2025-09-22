"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import fs from "fs";
import path from "path";

export const getContentVersionAction = async (): Promise<ActionResponse<number>> => {
  try {
    const versionFile = path.join(process.cwd(), "data", "content-version.json");

    if (!fs.existsSync(versionFile)) {
      return getActionResponse({ data: 1 });
    }

    const versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
    const version = versionData.version || 1;

    return getActionResponse({ data: version });
  } catch (error) {
    return getActionResponse({ error });
  }
};