"use client";

import { Button } from "@/components/editor/ui/button";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useState, useEffect } from "react";
import { verifyThemeApplication, VerificationResult } from "./ThemeConfiguration.verify";
import { loadThemesAction } from "./ThemeConfiguration.actions";
import { ParsedTheme } from "./ThemeConfiguration.types";

export const ThemeVerificationTest = () => {
  const [themes, setThemes] = useState<ParsedTheme[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    loadThemesAction().then(setThemes);
  }, []);

  const runVerification = () => {
    if (themes.length > 0 && themes[theme.selectedTheme]) {
      const verification = verifyThemeApplication(theme, themes[theme.selectedTheme], theme.selectedTheme);
      setResult(verification);
      console.log(JSON.stringify({
        action: "manual_verification",
        themeName: themes[theme.selectedTheme].name,
        result: verification
      }));
    }
  };

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Theme Verification Test</h3>
        <Button onClick={runVerification} size="sm">
          Run Verification
        </Button>
      </div>

      {result && (
        <div className="space-y-2">
          <div className={`p-3 rounded ${result.isComplete ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
            <div className="font-semibold">
              {result.isComplete ? "✓ Verification Passed" : "✗ Verification Failed"}
            </div>
            <div className="text-sm mt-1">
              Missing: {result.missingFields.length} | Mismatched: {result.mismatchedFields.length}
            </div>
          </div>

          {result.mismatchedFields.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-sm">Mismatched Fields:</div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {result.mismatchedFields.map((mismatch, idx) => (
                  <div key={idx} className="p-2 bg-red-50 rounded text-xs">
                    <div className="font-medium">{mismatch.field} ({mismatch.mode})</div>
                    <div className="mt-1 space-y-1">
                      <div>Store: <code className="bg-white px-1 py-0.5 rounded">{JSON.stringify(mismatch.storeValue)}</code></div>
                      <div>Theme: <code className="bg-white px-1 py-0.5 rounded">{JSON.stringify(mismatch.themeValue)}</code></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.missingFields.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-sm">Missing Fields:</div>
              <div className="text-xs text-red-700">
                {result.missingFields.join(", ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
