import { parseThemesFromJSON } from "../app/(components)/ThemeConfiguration.utils";
import { verifyThemeApplication } from "../app/(components)/ThemeConfiguration.verify";

const themes = parseThemesFromJSON();

console.log(JSON.stringify({
  action: "loaded_themes",
  count: themes.length,
  themeNames: themes.map(t => t.name)
}));

const sampleStoreTheme = {
  selectedTheme: 0,
  colors: {
    light: themes[0].light.colors,
    dark: themes[0].dark.colors,
  },
  typography: {
    light: themes[0].light.typography,
    dark: themes[0].dark.typography,
  },
  other: {
    light: themes[0].light.other,
    dark: themes[0].dark.other,
  },
};

const verification = verifyThemeApplication(sampleStoreTheme, themes[0], 0);

console.log(JSON.stringify({
  action: "perfect_match_test",
  isComplete: verification.isComplete,
  missingFields: verification.missingFields,
  mismatchedFields: verification.mismatchedFields
}));

const brokenStoreTheme = {
  selectedTheme: 0,
  colors: {
    light: { ...themes[0].light.colors, primary: "999 99% 99%" },
    dark: themes[0].dark.colors,
  },
  typography: {
    light: themes[0].light.typography,
    dark: { ...themes[0].dark.typography, fontSans: "Comic Sans" },
  },
  other: {
    light: { ...themes[0].light.other, radius: 999 },
    dark: themes[0].dark.other,
  },
};

const brokenVerification = verifyThemeApplication(brokenStoreTheme, themes[0], 0);

console.log(JSON.stringify({
  action: "broken_match_test",
  isComplete: brokenVerification.isComplete,
  missingFieldsCount: brokenVerification.missingFields.length,
  mismatchedFieldsCount: brokenVerification.mismatchedFields.length,
  mismatchedFields: brokenVerification.mismatchedFields
}));

console.log(JSON.stringify({
  action: "test_complete",
  perfectMatchPassed: verification.isComplete === true,
  brokenMatchPassed: brokenVerification.isComplete === false && brokenVerification.mismatchedFields.length === 3
}));
