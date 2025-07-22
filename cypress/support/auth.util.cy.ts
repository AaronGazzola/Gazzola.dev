//-| File path: cypress/support/auth.util.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";

interface SignInCredentials {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export function signIn(
  credentials: SignInCredentials,
  expectSuccess = true,
  expectProfile = true
): void {
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).length === 0
    ) {
      cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();
    }
  });

  cy.get(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).within(() => {
    cy.get("h2").then(($title) => {
      const titleText = $title.text();
      if (titleText === "Create Account") {
        cy.get(
          `[data-cy="${DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}"]`
        ).click();
      }
    });
  });

  cy.log(`Entering email: ${credentials.email}`);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
    .clear()
    .type(credentials.email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
    .clear()
    .type(credentials.password);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  if (!expectSuccess) {
    cy.get(`[data-cy="${DataCyAttributes.ERROR_AUTH_SIGN_IN}"]`, {
      timeout: 30000,
    }).should("exist");
    return;
  }

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
    timeout: 30000,
  }).should("exist");
  if (!credentials.isAdmin && expectProfile)
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should(
      "be.visible"
    );
  if (credentials.isAdmin && expectProfile)
    cy.get(`[data-cy="${DataCyAttributes.ADMIN_SIGN_OUT_BUTTON}"]`, {
      timeout: 30000,
    }).should("be.visible");
}

export function signInAdmin(): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("ADMIN_EMAIL"),
    password: Cypress.env("ADMIN_PASSWORD"),
    isAdmin: true,
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

export function signInNewUser(expectSuccess = true): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("NEW_USER_EMAIL"),
    password: Cypress.env("NEW_USER_PASSWORD"),
  };
  signIn(credentials, expectSuccess);
}

export function signInUnverifiedUser(): void {
  const credentials: SignInCredentials = {
    email: Cypress.env("UNVERIFIED_USER_EMAIL"),
    password: Cypress.env("UNVERIFIED_USER_PASSWORD"),
  };
  const expectSuccess = true;
  const expectProfile = false;
  signIn(credentials, expectSuccess, expectProfile);
}

const signUp = (credentials: SignInCredentials): void => {
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).length === 0
    ) {
      cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();
    }
  });

  cy.get(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).within(() => {
    cy.get("h2").then(($title) => {
      const titleText = $title.text();
      if (titleText === "Sign In") {
        cy.get(
          `[data-cy="${DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}"]`
        ).click();
      }
    });
  });

  cy.log(`Entering email: ${credentials.email}`);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
    .clear()
    .type(credentials.email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
    .clear()
    .type(credentials.password);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_UP}"]`, {
    timeout: 20000,
  }).should("exist");
};

export function signUpUnverifiedUser(): void {
  const credentials = {
    email: Cypress.env("UNVERIFIED_USER_EMAIL"),
    password: Cypress.env("UNVERIFIED_USER_PASSWORD"),
  };

  signUp(credentials);
}

export function signUpNewUser(): void {
  const credentials = {
    email: Cypress.env("NEW_USER_EMAIL"),
    password: Cypress.env("NEW_USER_PASSWORD"),
  };
  signUp(credentials);
}

export function signOut(): void {
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_CONFIRM_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
    timeout: 30000,
  }).should("exist");
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("not.exist");
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).should("be.visible");
}

export function adminSignOut(): void {
  cy.get(`[data-cy="${DataCyAttributes.ADMIN_SIGN_OUT_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_CONFIRM_BUTTON}"]`).click();

  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
    timeout: 30000,
  }).should("exist");
  cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).should("not.exist");
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).should("be.visible");
}
