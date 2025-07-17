//-| File path: cypress/e2e/smoke.cy.ts

import { DataCyAttributes } from "../../types/cypress.types";
import { signOut } from "../support/auth.util.cy";

describe("Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete full authentication flow with error handling and successful sign out", () => {
    cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    const adminEmail = Cypress.env("ADMIN_EMAIL");
    cy.log(`Entering email: ${adminEmail}`);
    cy.log(`Finding: ${DataCyAttributes.AUTH_EMAIL_INPUT}`);
    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(adminEmail);
    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      "incorrect-password"
    );
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.ERROR_AUTH_SIGN_IN}"]`).should(
      "exist"
    );

    cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("ADMIN_PASSWORD"));
    cy.log("password:", Cypress.env("ADMIN_PASSWORD"));
    cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
      timeout: 20000,
    }).should("exist");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should(
      "be.visible"
    );

    signOut();
  });
});
