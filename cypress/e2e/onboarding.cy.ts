//-| File path: cypress/e2e/onboarding.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInNewUser, signOut } from "../support/auth.util.cy";

describe("Onboarding Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete onboarding, edit profile, reset profile, and verify profile menu visibility", () => {
    // Sign in as NEW_USER
    signInNewUser();

    // Click the PROFILE_BUTTON and then the PROFILE_RESET_BUTTON
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_RESET_BUTTON}"]`).click();

    // Confirm success toast
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_PROFILE_RESET}"]`, {
      timeout: 10000,
    }).should("exist");

    // Sign out
    signOut();

    // Sign in as NEW_USER again
    signInNewUser();

    // Complete onboarding pathway
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    // Step 1: Fill first and last name
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_FIRST_NAME_INPUT}"]`)
      .clear()
      .type("John");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_LAST_NAME_INPUT}"]`)
      .clear()
      .type("Doe");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_NEXT_BUTTON}"]`).click();

    // Step 2: Fill company and phone
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_COMPANY_INPUT}"]`)
      .clear()
      .type("Test Company");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_PHONE_INPUT}"]`)
      .clear()
      .type("555-123-4567");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_NEXT_BUTTON}"]`).click();

    // Step 3: Skip avatar upload and save
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_SAVE_BUTTON}"]`).click();

    // Wait for success toast and onboarding to close
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ONBOARDING_SAVE}"]`, {
      timeout: 10000,
    }).should("exist");
    cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`).should("not.exist");

    // Click the PROFILE_BUTTON
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();

    // Click the PROFILE_MENU_BUTTON
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_MENU_BUTTON}"]`).click();

    // Confirm that the profile values are correct
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_DIALOG}"]`, {
      timeout: 10000,
    }).should("be.visible");

    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`).should("have.value", "John");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`).should("have.value", "Doe");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`).should("have.value", "Test Company");

    // Change each of the values
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`)
      .clear()
      .type("Jane");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`)
      .clear()
      .type("Smith");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`)
      .clear()
      .type("Updated Company");

    // Save
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_SAVE_BUTTON}"]`).click();

    // Confirm success toast
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_PROFILE_UPDATE}"]`, {
      timeout: 10000,
    }).should("exist");

    // Click the PROFILE_BUTTON and then the PROFILE_MENU_BUTTON
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_MENU_BUTTON}"]`).click();

    // Confirm that the updated profile data is correct
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_FIRST_NAME_INPUT}"]`).should("have.value", "Jane");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_LAST_NAME_INPUT}"]`).should("have.value", "Smith");
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_COMPANY_INPUT}"]`).should("have.value", "Updated Company");

    // Close the profile dialog by clicking cancel
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_CANCEL_BUTTON}"]`).click();

    // Sign out
    signOut();
  });
});