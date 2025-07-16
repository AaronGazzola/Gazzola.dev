//-| File path: cypress/e2e/smoke.cy.ts

import { CyDataAttributes } from "../../types/cypress.types";
import { signOut } from "./auth.cy";

describe("Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete full authentication flow with error handling and successful sign out", () => {
    cy.get(`[data-cy="${CyDataAttributes.SIGN_IN_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    const adminEmail = Cypress.env("ADMIN_EMAIL");
    cy.log(`Entering email: ${adminEmail}`);
    cy.log(`Finding: ${CyDataAttributes.AUTH_EMAIL_INPUT}`);
    cy.get(`[data-cy="${CyDataAttributes.AUTH_EMAIL_INPUT}"]`).type(adminEmail);
    cy.get(`[data-cy="${CyDataAttributes.AUTH_PASSWORD_INPUT}"]`).type(
      "incorrect-password"
    );
    cy.get(`[data-cy="${CyDataAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${CyDataAttributes.ERROR_AUTH_SIGN_IN}"]`).should(
      "be.visible"
    );

    cy.get(`[data-cy="${CyDataAttributes.AUTH_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("ADMIN_PASSWORD"));
    cy.get(`[data-cy="${CyDataAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

    cy.get(`[data-cy="${CyDataAttributes.SUCCESS_AUTH_SIGN_IN}"]`).should(
      "be.visible"
    );
    cy.get(`[data-cy="${CyDataAttributes.PROFILE_BUTTON}"]`).should(
      "be.visible"
    );

    signOut();
  });
});
