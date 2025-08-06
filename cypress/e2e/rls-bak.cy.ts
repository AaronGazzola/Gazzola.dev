import configuration from "../../configuration";
import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS Policy Tests", () => {
  const testRlsPath = configuration.paths.testRls;

  it("should enforce RLS policies correctly through step-by-step workflow", () => {
    cy.visit(testRlsPath);
    cy.log("=== Starting RLS Policy Step-by-Step Tests ===");

    cy.get("body").should("contain", "RLS Policy Step-by-Step Test");

    // Setup: Fill in admin credentials for automated sign-in steps
    cy.get(`[data-cy="${DataCyAttributes.RLS_EMAIL_INPUT}"]`).type(
      Cypress.env("ADMIN_EMAIL")
    );
    cy.get(`[data-cy="${DataCyAttributes.RLS_PASSWORD_INPUT}"]`).type(
      Cypress.env("ADMIN_PASSWORD")
    );

    // Execute steps 1-31 (Admin workflow)
    cy.log("=== Admin Workflow: Steps 1-31 ===");
    for (let stepId = 1; stepId <= 31; stepId++) {
      cy.log(`Executing Step ${stepId}`);

      // Special handling for user sign-in step (32) - update credentials
      if (stepId === 32) {
        cy.get(`[data-cy="${DataCyAttributes.RLS_EMAIL_INPUT}"]`)
          .clear()
          .type(Cypress.env("USER_EMAIL"));
        cy.get(`[data-cy="${DataCyAttributes.RLS_PASSWORD_INPUT}"]`)
          .clear()
          .type(Cypress.env("USER_PASSWORD"));
      }

      // Click the execute button for this step
      cy.get(`[data-cy="rls-step-${stepId}-button"]`).click();

      // Wait for the step to complete and verify "Expected Feature" badge appears
      cy.get(`[data-cy="rls-step-${stepId}-result"]`).within(() => {
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
        ).should("be.visible");

        // Ensure no "Unexpected Bug" badge appears
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`
        ).should("not.exist");
      });

      // Brief pause between steps to allow for processing
      cy.wait(1000);
    }

    // Before step 32, update credentials for user sign-in
    cy.log("=== Setting up User Credentials for Steps 32-59 ===");
    cy.get(`[data-cy="${DataCyAttributes.RLS_EMAIL_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_EMAIL"));
    cy.get(`[data-cy="${DataCyAttributes.RLS_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_PASSWORD"));

    // Execute steps 32-62 (Regular user workflow including user table tests)
    cy.log("=== Regular User Workflow: Steps 32-62 ===");
    for (let stepId = 32; stepId <= 62; stepId++) {
      cy.log(`Executing Step ${stepId}`);

      // Click the execute button for this step
      cy.get(`[data-cy="rls-step-${stepId}-button"]`).click();

      // Wait for the step to complete and verify "Expected Feature" badge appears
      cy.get(`[data-cy="rls-step-${stepId}-result"]`).within(() => {
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`
        ).should("be.visible");

        // Ensure no "Unexpected Bug" badge appears
        cy.get(
          `[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`
        ).should("not.exist");
      });

      // Brief pause between steps to allow for processing
      cy.wait(1000);
    }

    cy.log(
      "=== All 62 RLS policy step-by-step tests completed successfully ==="
    );
  });
});
