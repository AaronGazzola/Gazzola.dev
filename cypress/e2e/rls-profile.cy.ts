import configuration from "../../configuration";
import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS Profile Policy Tests", () => {
  const testRlsProfilePath = configuration.paths.testRlsProfile;

  it("should enforce RLS policies correctly through step-by-step profile workflow", () => {
    cy.visit(testRlsProfilePath);
    cy.log("=== Starting RLS Profile Policy Step-by-Step Tests ===");

    cy.get("body").should("contain", "RLS Profile Policy Test");

    // Setup: Fill in admin credentials for automated sign-in steps
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_EMAIL_INPUT}"]`).type(
      Cypress.env("ADMIN_EMAIL")
    );
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_PASSWORD_INPUT}"]`).type(
      Cypress.env("ADMIN_PASSWORD")
    );

    // Execute steps 1-17 (Admin workflow)
    cy.log("=== Admin Workflow: Steps 1-17 ===");
    for (let stepId = 1; stepId <= 17; stepId++) {
      cy.log(`Executing Step ${stepId}`);

      // Click the execute button for this step
      cy.get(`[data-cy="rls-profile-step-${stepId}-button"]`).click();

      // Wait for the step to complete and verify "Expected Feature" badge appears
      cy.get(`[data-cy="rls-profile-step-${stepId}-result"]`).within(() => {
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
        ).should("be.visible");

        // Ensure no "Unexpected Bug" badge appears
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`
        ).should("not.exist");
      });

      // Longer pause between steps to allow for processing
      cy.wait(2000);
    }

    // Before step 18, update credentials for user sign-in
    cy.log("=== Setting up User Credentials for Steps 18-30 ===");
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_EMAIL_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_EMAIL"));
    cy.get(`[data-cy="${DataCyAttributes.RLS_PROFILE_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_PASSWORD"));

    // Execute steps 18-30 (Regular user workflow)
    cy.log("=== Regular User Workflow: Steps 18-30 ===");
    for (let stepId = 18; stepId <= 30; stepId++) {
      cy.log(`Executing Step ${stepId}`);

      // Click the execute button for this step
      cy.get(`[data-cy="rls-profile-step-${stepId}-button"]`).click();

      // Wait for the step to complete and verify "Expected Feature" badge appears
      cy.get(`[data-cy="rls-profile-step-${stepId}-result"]`).within(() => {
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
        ).should("be.visible");

        // Ensure no "Unexpected Bug" badge appears
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`
        ).should("not.exist");
      });

      // Longer pause between steps to allow for processing
      cy.wait(2000);
    }

    cy.log("=== All 30 RLS profile policy tests completed successfully ===");
  });
});
