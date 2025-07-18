//-| File path: cypress/support/auth.util.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";

interface SignInCredentials {
  email: string;
  password: string;
}

export function signIn(credentials: SignInCredentials): void {
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).length === 0
    ) {
      cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();
    }
  });

  cy.log(`Entering email: ${credentials.email}`);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
    .clear()
    .type(credentials.email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
    .clear()
    .type(credentials.password);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}

export function signInAdmin(): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("ADMIN_EMAIL"),
    password: Cypress.env("ADMIN_PASSWORD"),
  };
  signIn(credentials);
}

export function signInUser(): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("USER_EMAIL"),
    password: Cypress.env("USER_PASSWORD"),
  };
  signIn(credentials);
}

export function signInNewUser(): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("NEW_USER_EMAIL"),
    password: Cypress.env("NEW_USER_PASSWORD"),
  };
  signIn(credentials);
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

export function adminSignOut(): void {
  cy.get(`[data-cy="${DataCyAttributes.ADMIN_SIGN_OUT_BUTTON}"]`).click();
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
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
    .clear()
    .type(email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
    .clear()
    .type(password);

  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_UP}"]`).should(
    "be.visible"
  );
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("be.visible");
}
