<!-- option-1 -->
## Testing with Jest & Playwright

**When to use**: All projects should include testing

**Technologies**:
- **Jest** for unit and integration tests
- **Playwright** for end-to-end tests

**Dependencies**:
```json
{
  "devDependencies": {
    "jest": "latest",
    "@playwright/test": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest"
  }
}
```

**Jest configuration** (`jest.config.js`):
```javascript
module.exports = {
  preset: "next",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
```

**Playwright configuration** (`playwright.config.ts`):
```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

**Test file pattern**:
```typescript
import { test, expect } from "@playwright/test";

test("should navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Home/);
});
```
<!-- /option-1 -->
