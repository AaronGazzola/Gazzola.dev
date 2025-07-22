//-| File path: cypress/e2e/profile.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInNewUser, signUpNewUser } from "../support/auth.util.cy";

describe("Onboarding Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete onboarding, edit profile, reset profile, delete account, verify profile menu visibility, and confirm sign-in error after deletion", () => {
    const newUserEmail = Cypress.env("NEW_USER_EMAIL");

    cy.get("body").then(($body) => {
      if (
        $body.find(`[data-cy="${DataCyAttributes.AUTH_DIALOG}"]`).length === 0
      ) {
        cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();
      }
    });

    cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
      .clear()
      .type(newUserEmail);

    cy.get(
      `[data-cy="${DataCyAttributes.AUTH_DELETE_ACCOUNT_BUTTON}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_DELETE_ACCOUNT}"]`, {
      timeout: 10000,
    }).should("exist");

    signUpNewUser();

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    cy.get(`[data-cy="${DataCyAttributes.VERIFY_ACCOUNT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_VERIFY_ACCOUNT}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_FIRST_NAME_INPUT}"]`)
      .clear()
      .type("John");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_LAST_NAME_INPUT}"]`)
      .clear()
      .type("Doe");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_NEXT_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_COMPANY_INPUT}"]`)
      .clear()
      .type("Test Company");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_PHONE_INPUT}"]`)
      .clear()
      .type("555-123-4567");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_SAVE_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ONBOARDING_SAVE}"]`, {
      timeout: 10000,
    }).should("exist");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`).should(
      "not.exist"
    );

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_MENU_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`).should(
      "have.value",
      "John"
    );
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`).should(
      "have.value",
      "Doe"
    );
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`).should(
      "have.value",
      "Test Company"
    );

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`)
      .clear()
      .type("Jane");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`)
      .clear()
      .type("Smith");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`)
      .clear()
      .type("Updated Company");

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_SAVE_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_PROFILE_UPDATE}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_MENU_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`).should(
      "have.value",
      "Jane"
    );
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`).should(
      "have.value",
      "Smith"
    );
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`).should(
      "have.value",
      "Updated Company"
    );

    cy.get(
      `[data-cy="${DataCyAttributes.PROFILE_DELETE_ACCOUNT_BUTTON}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_DELETE_CONFIRM_INPUT}"]`).type(
      "delete my account"
    );

    cy.get(
      `[data-cy="${DataCyAttributes.PROFILE_DELETE_CONFIRM_BUTTON}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ACCOUNT_DELETE}"]`, {
      timeout: 10000,
    }).should("exist");
    signInNewUser(false);
  });
});
