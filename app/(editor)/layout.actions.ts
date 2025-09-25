"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";
import { MarkdownData } from "./layout.types";

const VERSION_FILE = path.join(process.cwd(), "public", "data", "content-version.json");


export const getContentVersionAction = async (): Promise<ActionResponse<number>> => {
  try {
    if (!fs.existsSync(VERSION_FILE)) {
      return getActionResponse({ data: 1 });
    }

    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
    const version = versionData.version || 1;

    return getActionResponse({ data: version });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const getMarkdownDataAction = async (): Promise<ActionResponse<MarkdownData>> => {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/data/processed-markdown.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch markdown data: ${response.status}`);
    }

    const data: MarkdownData = await response.json();
    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};