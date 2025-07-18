//-| File path: cypress.config.ts
import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    setupNodeEvents(on, config): void {},
    env: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      USER_EMAIL: process.env.USER_EMAIL,
      USER_PASSWORD: process.env.USER_PASSWORD,
      NEW_USER_EMAIL: process.env.NEW_USER_EMAIL,
      NEW_USER_PASSWORD: process.env.NEW_USER_PASSWORD,
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    execTimeout: 60000,
    taskTimeout: 60000,
  },
});