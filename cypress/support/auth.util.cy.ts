//-| File path: cypress/support/auth.util.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";

export function signIn(isAdmin = false): void {
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`, {
    timeout: 10000,
  }).click();

  const email = isAdmin
    ? Cypress.env("ADMIN_EMAIL")
    : Cypress.env("USER_EMAIL");

  const password = isAdmin
    ? Cypress.env("ADMIN_PASSWORD")
    : Cypress.env("USER_PASSWORD");

  cy.log(`Entering email: ${email}`);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(password);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}

export function signOut(): void {
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_CONFIRM_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
    timeout: 20000,
  }).should("be.visible");
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("not.exist");
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).should("be.visible");
}

export function signUp(isAdmin = false): void {
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`, {
    timeout: 10000,
  }).click();

  cy.get(`[data-cy="${DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}"]`).click();
  const email = isAdmin
    ? Cypress.env("ADMIN_EMAIL")
    : Cypress.env("USER_EMAIL");

  const password = isAdmin
    ? Cypress.env("ADMIN_PASSWORD")
    : Cypress.env("USER_PASSWORD");

  cy.log(`Entering email: ${email}`);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`).type(email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`).type(password);

  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_UP}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}
