import { conditionalLog, LOG_LABELS } from "./log.util";

export const extractJsonFromResponse = <T>(
  response: string,
  logLabel: (typeof LOG_LABELS)[keyof typeof LOG_LABELS]
): T | null => {
  try {
    let jsonContent = response;

    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonContent = jsonBlockMatch[1];
    } else {
      const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1];
      } else {
        const jsonStartIndex = response.indexOf("{");
        const jsonEndIndex = response.lastIndexOf("}");
        if (
          jsonStartIndex !== -1 &&
          jsonEndIndex !== -1 &&
          jsonEndIndex > jsonStartIndex
        ) {
          jsonContent = response.substring(jsonStartIndex, jsonEndIndex + 1);
        }
      }
    }

    return JSON.parse(jsonContent.trim()) as T;
  } catch (error) {
    conditionalLog(
      {
        message: "Failed to extract JSON from AI response",
        error,
        responsePreview: response.substring(0, 500),
      },
      { label: logLabel }
    );
    return null;
  }
};

export const extractJsonArrayFromResponse = <T>(
  response: string,
  logLabel: (typeof LOG_LABELS)[keyof typeof LOG_LABELS]
): T[] | null => {
  try {
    let jsonContent = response;

    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonContent = jsonBlockMatch[1];
    } else {
      const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1];
      } else {
        const jsonStartIndex = response.indexOf("[");
        const jsonEndIndex = response.lastIndexOf("]");
        if (
          jsonStartIndex !== -1 &&
          jsonEndIndex !== -1 &&
          jsonEndIndex > jsonStartIndex
        ) {
          jsonContent = response.substring(jsonStartIndex, jsonEndIndex + 1);
        }
      }
    }

    const parsed = JSON.parse(jsonContent.trim());
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed content is not an array");
    }
    return parsed as T[];
  } catch (error) {
    conditionalLog(
      {
        message: "Failed to extract JSON array from AI response",
        error,
        responsePreview: response.substring(0, 500),
      },
      { label: logLabel }
    );
    return null;
  }
};
