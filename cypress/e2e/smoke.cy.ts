//-| File path: cypress/e2e/smoke.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import {
  adminSignOut,
  signInAdmin,
  signInUser,
  signOut,
} from "../support/auth.util.cy";

describe("Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete full authentication flow with error handling and successful sign out", () => {
    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    const userEmail = Cypress.env("USER_EMAIL");
    cy.log(`Entering email: ${userEmail}`);
    cy.log(`Finding: ${DataCyAttributes.AUTH_EMAIL_INPUT}`);
    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(userEmail);
    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      "incorrect-password"
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.ERROR_AUTH_SIGN_IN}"]`).should(
      "exist"
    );
    signInUser();

    signOut();

    signInAdmin();

    cy.get(`[data-cy="${DataCyAttributes.USER_TABLE_ROW}"]`, {
      timeout: 20000,
    }).should("have.length.at.least", 1);

    adminSignOut();

    // signInNewUser();

    // signOut();
  });
});
