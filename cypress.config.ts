//-| File path: cypress.config.ts
import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { rlsTasks } from "./cypress/support/rls-tasks";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    setupNodeEvents(on, config): void {
      // Register RLS testing tasks
      on('task', {
        ...rlsTasks
      });
    },
    env: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      USER_EMAIL: process.env.USER_EMAIL,
      USER_PASSWORD: process.env.USER_PASSWORD,
      NEW_USER_EMAIL: process.env.NEW_USER_EMAIL,
      NEW_USER_PASSWORD: process.env.NEW_USER_PASSWORD,
      UNVERIFIED_USER_EMAIL: process.env.UNVERIFIED_USER_EMAIL,
      UNVERIFIED_USER_PASSWORD: process.env.UNVERIFIED_USER_PASSWORD,
      APP_ENV: process.env.APP_ENV,
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    execTimeout: 60000,
    taskTimeout: 60000,
  },
});
