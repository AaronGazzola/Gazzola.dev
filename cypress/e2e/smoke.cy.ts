//-| File path: cypress/e2e/smoke.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import {
  adminSignOut,
  signInAdmin,
  signInUnverifiedUser,
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

    signInUnverifiedUser();

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    cy.get("body").type("{esc}");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`).should(
      "be.visible"
    );

    cy.get(`[data-cy="${DataCyAttributes.RESEND_EMAIL_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_RESEND_EMAIL}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_VERIFY_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`).should(
      "not.exist"
    );
    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).should(
      "be.visible"
    );

    signInAdmin();

    cy.get(`[data-cy="${DataCyAttributes.USER_TABLE_ROW}"]`, {
      timeout: 30000,
    }).should("have.length.at.least", 1);

    adminSignOut();
  });
});
