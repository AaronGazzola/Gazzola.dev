"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { conditionalLog } from "@/lib/log.util";
import { MarkdownData } from "./layout.types";

function getAbsoluteUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  return `${baseUrl}${path}`;
}

export const getContentVersionAction = async (): Promise<
  ActionResponse<number>
> => {
  try {
    console.log(
      conditionalLog("getContentVersionAction: Starting", {
        label: "markdown-parse",
      })
    );

    const url = getAbsoluteUrl("/data/content-version.json");
    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        conditionalLog(
          "getContentVersionAction: Version file not found, returning 1",
          { label: "markdown-parse" }
        )
      );
      return getActionResponse({ data: 1 });
    }

    const versionData = await response.json();
    const version = versionData.version || 1;

    console.log(conditionalLog({ version }, { label: "markdown-parse" }));

    return getActionResponse({ data: version });
  } catch (error) {
    console.log(
      conditionalLog({ error: String(error) }, { label: "markdown-parse" })
    );
    return getActionResponse({ data: 1 });
  }
};

export const parseMarkdownAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(
      conditionalLog("parseMarkdownAction: Starting", {
        label: "markdown-parse",
      })
    );

    const url = getAbsoluteUrl("/data/processed-markdown.json");
    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        conditionalLog(
          { error: "Processed markdown file not found" },
          { label: "markdown-parse" }
        )
      );
      return getActionResponse({
        error: "Processed markdown file not found. Run 'npm run parse' first.",
      });
    }

    const markdownData: MarkdownData = await response.json();

    console.log(
      conditionalLog(
        {
          nodeCount: Object.keys(markdownData.flatIndex).length,
          contentVersion: markdownData.contentVersion,
        },
        { label: "markdown-parse" }
      )
    );

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(
      conditionalLog({ error: String(error) }, { label: "markdown-parse" })
    );
    return getActionResponse({ error });
  }
};

export const parseAndGetMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(
      conditionalLog("parseAndGetMarkdownDataAction: Starting", {
        label: "markdown-parse",
      })
    );

    const url = getAbsoluteUrl("/data/processed-markdown.json");
    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        conditionalLog(
          { error: "Processed markdown file not found" },
          { label: "markdown-parse" }
        )
      );
      return getActionResponse({
        error: "Processed markdown file not found. Run 'npm run parse' first.",
      });
    }

    const markdownData: MarkdownData = await response.json();

    console.log(
      conditionalLog(
        {
          nodeCount: Object.keys(markdownData.flatIndex).length,
          contentVersion: markdownData.contentVersion,
        },
        { label: "markdown-parse" }
      )
    );

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(
      conditionalLog({ error: String(error) }, { label: "markdown-parse" })
    );
    return getActionResponse({ error });
  }
};

export const getMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(
      conditionalLog("getMarkdownDataAction: Starting", {
        label: "markdown-parse",
      })
    );

    const url = getAbsoluteUrl("/data/processed-markdown.json");

    console.log(
      conditionalLog(
        { message: "Fetching from URL", url },
        { label: "markdown-parse" }
      )
    );

    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        conditionalLog(
          { error: "Processed markdown file not found" },
          { label: "markdown-parse" }
        )
      );
      return getActionResponse({
        error: "Processed markdown file not found. Run 'npm run parse' first.",
      });
    }

    const data: MarkdownData = await response.json();

    console.log(
      conditionalLog(
        {
          nodeCount: Object.keys(data.flatIndex).length,
          contentVersion: data.contentVersion,
        },
        { label: "markdown-parse" }
      )
    );

    return getActionResponse({ data });
  } catch (error) {
    console.log(
      conditionalLog({ error: String(error) }, { label: "markdown-parse" })
    );
    return getActionResponse({ error });
  }
};
