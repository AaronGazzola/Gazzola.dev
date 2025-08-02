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
      UNVERIFIED_USER_EMAIL: process.env.UNVERIFIED_USER_EMAIL,
      UNVERIFIED_USER_PASSWORD: process.env.UNVERIFIED_USER_PASSWORD,
      APP_ENV: process.env.APP_ENV,
    },
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    pageLoadTimeout: 180000,
    execTimeout: 180000,
    taskTimeout: 180000,
  },
});
