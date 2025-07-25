//-| File path: cypress/e2e/chat-admin.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signOut } from "../support/auth.util.cy";
import {
  clickUserInTable,
  receiveMessage,
  sendMessage,
} from "../support/chat.util.cy";

describe("Admin User Chat Test", () => {
  it("should complete admin user chat flow", () => {
    const ADMIN_EMAIL = Cypress.env("ADMIN_EMAIL");
    const ADMIN_PASSWORD = Cypress.env("ADMIN_PASSWORD");

    cy.visit("/admin");

    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(
      ADMIN_EMAIL
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      ADMIN_PASSWORD
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
      timeout: 30000,
    }).should("be.visible");

    clickUserInTable();

    const isNewConversation = true;
    sendMessage("Hello from admin - initial message", isNewConversation);

    receiveMessage("Hello from auth user - response message");

    sendMessage("Hello from admin - second message");
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_MESSAGE_SEND}"]`, {
      timeout: 30000,
    }).should("be.visible");
    signOut();
  });
});
