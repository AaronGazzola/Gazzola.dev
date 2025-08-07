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
    cy.visit("/");
    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(
      ADMIN_EMAIL
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      ADMIN_PASSWORD
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
      timeout: 60000,
    }).should("be.visible");

    clickUserInTable();

    cy.get("body").then(($body) => {
      if (
        $body.find(`[data-cy="${DataCyAttributes.NO_CONVERSATIONS_YET}"]`)
          .length === 0 ||
        !$body
          .find(`[data-cy="${DataCyAttributes.NO_CONVERSATIONS_YET}"]`)
          .is(":visible")
      ) {
        cy.get(`[data-cy="${DataCyAttributes.DELETE_CONVERSATIONS}"]`, {
          timeout: 30000,
        }).click();

        cy.get(`[data-cy="${DataCyAttributes.SUCCESS_DELETE_CONVERSATIONS}"]`, {
          timeout: 60000,
        }).should("exist");

        cy.get(`[data-cy="${DataCyAttributes.NO_CONVERSATIONS_YET}"]`, {
          timeout: 30000,
        }).should("be.visible");
      }
    });

    const isNewConversation = true;
    sendMessage("Hello from admin - initial message", isNewConversation);

    receiveMessage("Hello from auth user - response message", 1);

    sendMessage("Hello from admin - second message");
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_MESSAGE_SEND}"]`, {
      timeout: 60000,
    }).should("be.visible");
    signOut();
  });
});
