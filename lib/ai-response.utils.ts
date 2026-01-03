import { conditionalLog, LOG_LABELS } from "./log.util";

export const extractJsonFromResponse = <T>(
  response: string,
  logLabel: (typeof LOG_LABELS)[keyof typeof LOG_LABELS]
): T | null => {
  try {
    console.log("🔍 extractJsonFromResponse - Raw response:", response);
    console.log("🔍 extractJsonFromResponse - Response length:", response.length);

    let jsonContent = response;

    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      console.log("✅ Found JSON code block");
      jsonContent = jsonBlockMatch[1];
    } else {
      const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        console.log("✅ Found generic code block");
        jsonContent = codeBlockMatch[1];
      } else {
        const jsonStartIndex = response.indexOf("{");
        const jsonEndIndex = response.lastIndexOf("}");
        console.log("🔍 JSON boundaries - start:", jsonStartIndex, "end:", jsonEndIndex);
        if (
          jsonStartIndex !== -1 &&
          jsonEndIndex !== -1 &&
          jsonEndIndex > jsonStartIndex
        ) {
          jsonContent = response.substring(jsonStartIndex, jsonEndIndex + 1);
          console.log("✅ Extracted JSON from boundaries");
        }
      }
    }

    console.log("🔍 JSON content to parse:", jsonContent);
    console.log("🔍 JSON content length:", jsonContent.length);

    const parsed = JSON.parse(jsonContent.trim());
    console.log("✅ Successfully parsed JSON:", parsed);

    return parsed as T;
  } catch (error) {
    console.error("❌ JSON parsing failed:", error);
    console.error("❌ Failed content:", response.substring(0, 1000));
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
