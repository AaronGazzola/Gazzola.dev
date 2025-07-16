//-| File path: cypress/e2e/auth.cy.ts

import { CyDataAttributes } from "../../types/cypress.types";

export function signIn(): void {
  cy.get(`[data-cy="${CyDataAttributes.SIGN_IN_BUTTON}"]`, {
    timeout: 10000,
  }).click();

  const adminEmail = Cypress.env("ADMIN_EMAIL");
  cy.log(`Entering email: ${adminEmail}`);
  cy.get(`[data-cy="${CyDataAttributes.AUTH_EMAIL_INPUT}"]`).type(adminEmail);
  cy.get(`[data-cy="${CyDataAttributes.AUTH_PASSWORD_INPUT}"]`).type(
    Cypress.env("ADMIN_PASSWORD")
  );
  cy.get(`[data-cy="${CyDataAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${CyDataAttributes.SUCCESS_AUTH_SIGN_IN}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${CyDataAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}

export function signOut(): void {
  cy.get(`[data-cy="${CyDataAttributes.PROFILE_BUTTON}"]`).click();
  cy.get(`[data-cy="${CyDataAttributes.SIGN_OUT_BUTTON}"]`).click();

  cy.get(`[data-cy="${CyDataAttributes.SUCCESS_SIGN_OUT}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${CyDataAttributes.PROFILE_BUTTON}"]`).should("not.exist");
  cy.get(`[data-cy="${CyDataAttributes.SIGN_IN_BUTTON}"]`).should("be.visible");
}

export function signUp(): void {
  cy.get(`[data-cy="${CyDataAttributes.SIGN_IN_BUTTON}"]`, {
    timeout: 10000,
  }).click();

  cy.get(`[data-cy="${CyDataAttributes.AUTH_TOGGLE_MODE_BUTTON}"]`).click();

  const userEmail = Cypress.env("USER_EMAIL");
  cy.log(`Entering email: ${userEmail}`);
  cy.get(`[data-cy="${CyDataAttributes.AUTH_EMAIL_INPUT}"]`).type(userEmail);
  cy.get(`[data-cy="${CyDataAttributes.AUTH_PASSWORD_INPUT}"]`).type(
    Cypress.env("USER_PASSWORD")
  );
  cy.get(`[data-cy="${CyDataAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${CyDataAttributes.SUCCESS_AUTH_SIGN_UP}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${CyDataAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}
