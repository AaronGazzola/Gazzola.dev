//-| File path: cypress/e2e/chat-auth.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signOut } from "../support/auth.util.cy";
import {
  clickConversationWithUnreadBadge,
  receiveMessage,
  sendMessage,
} from "../support/chat.util.cy";

describe("Auth User Chat Test", () => {
  it("should complete auth user chat flow", () => {
    const USER_EMAIL = Cypress.env("USER_EMAIL");
    const USER_PASSWORD = Cypress.env("USER_PASSWORD");

    cy.visit("/");

    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(USER_EMAIL);
    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      USER_PASSWORD
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
      timeout: 30000,
    }).should("be.visible");

    clickConversationWithUnreadBadge();

    receiveMessage("Hello from admin - initial message");

    sendMessage("Hello from auth user - response message");

    receiveMessage("Hello from admin - second message");

    signOut();
  });
});
