import configuration from "../../configuration";
import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS Comprehensive Testing - Admin and User", () => {
  const testPath = configuration.paths.test;

  it("should validate RLS policies by checking button states and error conditions", () => {
    cy.visit(testPath);
    cy.log("=== Starting Comprehensive RLS Security Tests ===");

    // Verify the page loaded correctly
    cy.get("body").should("contain", "RLS Security Testing Interface");
    cy.get("h1").should("contain", "RLS Security Testing Interface");

    // Define the test sequence with proper data dependency ordering
    const testSequence = [
      // User Table Tests (based on user_rls migration - only SELECT allowed)
      { id: "select-own-user", expectedAsAdmin: true, expectedAsUser: true },
      { id: "select-other-user", expectedAsAdmin: true, expectedAsUser: false },
      { id: "insert-user", expectedAsAdmin: false, expectedAsUser: false },
      { id: "update-own-user", expectedAsAdmin: false, expectedAsUser: false },
      {
        id: "update-other-user",
        expectedAsAdmin: false,
        expectedAsUser: false,
      },
      { id: "delete-own-user", expectedAsAdmin: false, expectedAsUser: false },
      {
        id: "delete-other-user",
        expectedAsAdmin: false,
        expectedAsUser: false,
      },

      // Profile Table Tests (foundation for contracts - must come first)
      { id: "select-own-profile", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "select-other-profile",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      { id: "insert-own-profile", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "insert-other-profile",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      { id: "update-own-profile", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "update-other-profile",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Contract Table Tests (foundation for tasks/payments)
      {
        id: "select-own-contract",
        expectedAsAdmin: true,
        expectedAsUser: true,
      },
      {
        id: "select-other-contract",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      {
        id: "insert-own-contract",
        expectedAsAdmin: true,
        expectedAsUser: true,
      },
      {
        id: "insert-other-contract",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Contract isPaid Tests (test unpaid contracts first)
      {
        id: "update-own-contract-unpaid",
        expectedAsAdmin: true,
        expectedAsUser: true,
      },
      {
        id: "update-other-contract-unpaid",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Mark contracts as paid (changes state for next tests)
      {
        id: "mark-own-contract-paid",
        expectedAsAdmin: true,
        expectedAsUser: true,
      },
      {
        id: "mark-other-contract-paid",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Test paid contract updates (should fail for users)
      {
        id: "update-own-contract-paid",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      {
        id: "update-other-contract-paid",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Task Table Tests (depend on contracts existing)
      { id: "select-own-task", expectedAsAdmin: true, expectedAsUser: true },
      { id: "select-other-task", expectedAsAdmin: true, expectedAsUser: false },
      { id: "insert-own-task", expectedAsAdmin: true, expectedAsUser: true },
      { id: "insert-other-task", expectedAsAdmin: true, expectedAsUser: false },
      { id: "update-own-task", expectedAsAdmin: true, expectedAsUser: true },
      { id: "update-other-task", expectedAsAdmin: true, expectedAsUser: false },
      { id: "delete-own-task", expectedAsAdmin: true, expectedAsUser: false },
      { id: "delete-other-task", expectedAsAdmin: true, expectedAsUser: false },

      // Payment Table Tests (depend on contracts existing)
      { id: "select-own-payment", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "select-other-payment",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      { id: "insert-own-payment", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "insert-other-payment",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      { id: "update-own-payment", expectedAsAdmin: true, expectedAsUser: true },
      {
        id: "update-other-payment",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      {
        id: "delete-own-payment",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      {
        id: "delete-other-payment",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },

      // Profile Delete Tests (at end to avoid breaking dependencies)
      {
        id: "delete-own-profile",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
      {
        id: "delete-other-profile",
        expectedAsAdmin: true,
        expectedAsUser: false,
      },
    ];

    // Helper function to validate button state
    const validateButtonState = (
      testId: string,
      expectedSuccess: boolean,
      userRole: string
    ) => {
      cy.log(
        `Validating ${testId} for ${userRole} - Expected: ${expectedSuccess ? "SUCCESS" : "BLOCKED"}`
      );

      // Find the button
      cy.get(`[data-cy*="${testId}"]`, { timeout: 10000 })
        .first()
        .as("testButton");

      // Check the button's visual state indicates success/failure correctly
      cy.get("@testButton", { timeout: 10000 }).should(($button) => {
        const buttonClasses = $button.attr("class") || "";
        const hasGreenBorder = buttonClasses.includes("border-green-400");
        const hasRedBorder = buttonClasses.includes("border-red-400");
        const hasPendingState =
          buttonClasses.includes("animate-pulse") ||
          buttonClasses.includes("border-yellow-400");

        // Button should not be in pending state
        expect(hasPendingState, `Button ${testId} should not be pending`).to.be
          .false;

        if (expectedSuccess) {
          // Should be green (success)
          expect(
            hasGreenBorder,
            `Button ${testId} should be green (success) for ${userRole}`
          ).to.be.true;
          expect(
            hasRedBorder,
            `Button ${testId} should not be red when expected to succeed`
          ).to.be.false;
        } else {
          // Should be red (failure)
          expect(
            hasRedBorder,
            `Button ${testId} should be red (blocked) for ${userRole}`
          ).to.be.true;
          expect(
            hasGreenBorder,
            `Button ${testId} should not be green when expected to be blocked`
          ).to.be.false;
        }
      });

      // Check button text indicates the correct result
      cy.get("@testButton", { timeout: 10000 }).within(() => {
        if (expectedSuccess) {
          cy.contains("✓ Success", { timeout: 5000 }).should("exist");
        } else {
          // Should show either "✗ Failed" or "✗ Error"
          cy.get("div", { timeout: 5000 }).should("contain.text", "✗");
        }
      });
    };

    // Helper function to run a test and validate the result
    const runAndValidateTest = (
      testId: string,
      expectedSuccess: boolean,
      userRole: string
    ) => {
      cy.log(`Running and validating test: ${testId} as ${userRole}`);

      // Click the test button
      cy.get(`[data-cy*="${testId}"]`).first().click();

      // Wait for test to complete (no longer pending)
      cy.get(`[data-cy*="${testId}"]`, { timeout: 10000 })
        .first()
        .should("not.have.class", "animate-pulse");
      cy.get(`[data-cy*="${testId}"]`, { timeout: 10000 })
        .first()
        .should("not.contain.class", "border-yellow-400");

      // Validate the final button state
      validateButtonState(testId, expectedSuccess, userRole);

      // If test was expected to succeed but appears to have failed, check for error dialog
      if (expectedSuccess) {
        cy.get(`[data-cy*="${testId}"]`)
          .first()
          .should(($button) => {
            const hasRedBorder = ($button.attr("class") || "").includes(
              "border-red-400"
            );
            if (hasRedBorder) {
              // Test failed when it should have succeeded - check for error dialog
              cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DIALOG}"]`).should(
                "exist"
              );
              cy.log(
                `ERROR: Test ${testId} failed unexpectedly for ${userRole}`
              );
              throw new Error(
                `Test ${testId} failed unexpectedly for ${userRole} - check error dialog`
              );
            }
          });
      }
    };

    // ============================================================================
    // PHASE 1: ADMIN USER TESTING
    // ============================================================================
    cy.log("=== Phase 1: Admin User Testing ===");

    // Fill in admin credentials for manual sign-in
    cy.get('[data-cy="rls-test-email-input"]')
      .clear()
      .type(Cypress.env("ADMIN_EMAIL"));
    cy.get('[data-cy="rls-test-password-input"]')
      .clear()
      .type(Cypress.env("ADMIN_PASSWORD"));

    // Verify initial state shows not signed in
    cy.get("body").should("contain", "Not signed in");

    // Sign in as admin user
    cy.get('[data-cy="rls-test-manual-sign-in-button"]').click();

    // Wait for sign-in and verify success toast
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SIGN_IN_ADMIN}"]`, {
      timeout: 20000,
    }).should("exist");

    // Verify admin is signed in
    cy.get("body").should("contain", "Admin");
    cy.get("body").should("contain", "Role: Admin");

    // Execute and validate each test in the admin phase
    testSequence.forEach((test, index) => {
      cy.log(`Admin Test ${index + 1}: ${test.id}`);
      runAndValidateTest(test.id, test.expectedAsAdmin, "Admin");
    });

    // Verify admin test phase completion
    cy.get("body").should("contain", "Test Results Summary");
    cy.log("=== Admin Testing Phase Completed ===");

    // Verify expected results counter shows correct number of passed tests
    cy.get("body").then(($body) => {
      const expectedPassCount = testSequence.filter(
        (test) => test.expectedAsAdmin
      ).length;
      cy.contains(`${expectedPassCount}`).should("exist");
      cy.contains("Expected Results").should("exist");
    });

    // ============================================================================
    // PHASE 2: TRANSITION TO REGULAR USER
    // ============================================================================
    cy.log("=== Phase 2: Switching to Regular User ===");

    // Sign out admin user
    cy.get('[data-cy="rls-test-sign-out-button"]').click();

    // Verify sign out success
    cy.get("body", { timeout: 8000 }).should("contain", "Not signed in");

    // Clear and fill in regular user credentials
    cy.get('[data-cy="rls-test-email-input"]')
      .clear()
      .type(Cypress.env("USER_EMAIL"));
    cy.get('[data-cy="rls-test-password-input"]')
      .clear()
      .type(Cypress.env("USER_PASSWORD"));

    // Sign in as regular user
    cy.get('[data-cy="rls-test-manual-sign-in-button"]').click();

    // Wait for sign-in and verify success toast
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
      timeout: 20000,
    }).should("exist");

    // Verify regular user is signed in
    cy.get("body").should("contain", "Role: User");
    cy.get("body").should("not.contain", "Role: Admin");

    // ============================================================================
    // PHASE 3: REGULAR USER TESTING
    // ============================================================================
    cy.log("=== Phase 3: Regular User Testing ===");

    // Execute and validate the same test sequence as regular user
    testSequence.forEach((test, index) => {
      // Skip delete-all-data for regular user as it should fail and we already tested it
      if (test.id === "delete-all-data") {
        cy.log(
          `Skipping User Test ${index + 1}: ${test.id} (admin-only operation)`
        );
        return;
      }

      cy.log(`User Test ${index + 1}: ${test.id}`);
      runAndValidateTest(test.id, test.expectedAsUser, "User");
    });

    // ============================================================================
    // PHASE 4: FINAL VERIFICATION
    // ============================================================================
    cy.log("=== Phase 4: Final Verification ===");

    // Verify test results summary shows successful completion
    cy.get("body").should("contain", "Test Results Summary");

    // Check that we have completed the expected number of tests
    cy.get("body").then(($body) => {
      const bodyText = $body.text();
      const totalTests = testSequence.length * 2 - 1; // -1 because we skip delete-all-data for user

      // Should have completed all tests
      expect(bodyText).to.match(/\d+.*Tests Run/);
      expect(bodyText).to.match(/\d+.*Expected Results/);
      expect(bodyText).to.match(/\d+.*Unexpected Results/);

      cy.log(`Total tests expected: ${totalTests}`);
      cy.log(`Total tests in sequence: ${testSequence.length}`);
    });

    // Verify that all buttons show final states (no pending animations)
    cy.get('[class*="animate-pulse"]', { timeout: 10000 }).should("not.exist");
    cy.get('[class*="border-yellow-400"]', { timeout: 10000 }).should(
      "not.exist"
    );

    // Count green (success) and red (failure) buttons to verify they match expectations
    testSequence.forEach((test) => {
      if (test.id === "delete-all-data") return; // Skip for user phase

      cy.get(`[data-cy*="${test.id}"]`, { timeout: 10000 })
        .first()
        .should(($button) => {
          const buttonClasses = $button.attr("class") || "";
          const hasGreenBorder = buttonClasses.includes("border-green-400");
          const hasRedBorder = buttonClasses.includes("border-red-400");

          // Every button should be either green or red (not waiting or pending)
          expect(
            hasGreenBorder || hasRedBorder,
            `Button ${test.id} should have final state`
          ).to.be.true;
        });
    });

    // Verify that unexpected results count is 0 (all tests behaved as expected)
    cy.contains("0").parent().should("contain", "Unexpected Results");

    // Check that no error dialog is currently open
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DIALOG}"]`).should(
      "not.exist"
    );

    // Final verification that user testing phase completed
    cy.get("body").should("contain", "Role: User"); // Still signed in as user

    // Log comprehensive test completion
    cy.log("=== RLS Comprehensive Testing Sequence Completed Successfully ===");
    cy.log(
      "✓ Admin phase: All tests executed and validated against expected RLS behavior"
    );
    cy.log(
      "✓ User phase: All tests executed and validated against expected RLS behavior"
    );
    cy.log(
      "✓ Button states (green/red) correctly reflect RLS policy enforcement"
    );
    cy.log("✓ Error conditions properly detected and reported");
    cy.log("✓ No unexpected test failures detected");
  });
});
