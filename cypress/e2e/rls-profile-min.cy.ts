import configuration from "../../configuration";
import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS Profile Minimal Tests", () => {
  const testRlsProfilePath = `${configuration.paths.testRls}/profile`;

  it("should test minimal RLS profile workflow with expected failures", () => {
    cy.visit(testRlsProfilePath);
    cy.log("=== Starting Minimal RLS Profile Tests ===");

    cy.get("body").should("contain", "RLS Profile Policy Test");

    // Fill in admin credentials for automated sign-in
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_EMAIL_INPUT}"]`).type(
      Cypress.env("ADMIN_EMAIL")
    );
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_PASSWORD_INPUT}"]`).type(
      Cypress.env("ADMIN_PASSWORD")
    );

    // Step 1: Sign in as Admin
    cy.log("=== Step 1: Sign in as Admin ===");
    cy.get(`[data-cy="rls-profile-step-1-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-1-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 2: Delete all data
    cy.log("=== Step 2: Delete all data ===");
    cy.get(`[data-cy="rls-profile-step-2-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-2-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 8: Create admin profile
    cy.log("=== Step 8: Create admin profile ===");
    cy.get(`[data-cy="rls-profile-step-8-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-8-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 17: Sign out
    cy.log("=== Step 17: Sign out ===");
    cy.get(`[data-cy="rls-profile-step-17-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-17-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Update credentials for user sign-in
    cy.log("=== Setting up User Credentials ===");
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_EMAIL_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_EMAIL"));
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_PASSWORD"));

    // Step 18: Sign in as regular user
    cy.log("=== Step 18: Sign in as regular user ===");
    cy.get(`[data-cy="rls-profile-step-18-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-18-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 24: Check admin profile (EXPECT FAIL)
    cy.log("=== Step 24: Check admin profile (EXPECT FAIL) ===");
    cy.get(`[data-cy="rls-profile-step-24-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-24-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 20: Check admin user record (EXPECT FAIL)
    cy.log("=== Step 20: Check admin user record (EXPECT FAIL) ===");
    cy.get(`[data-cy="rls-profile-step-20-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-20-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    // Step 17: Sign out (reuse sign out step)
    cy.log("=== Final Step: Sign out ===");
    cy.get(`[data-cy="rls-profile-step-17-button"]`).click();
    cy.get(`[data-cy="rls-profile-step-17-result"]`).within(() => {
      cy.get(
        `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
      ).should("be.visible");
      cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`).should(
        "not.exist"
      );
    });

    cy.log("=== Minimal RLS Profile Tests Completed ===");
  });
});
