import configuration from "../../configuration";
import { DataCyAttributes } from "../../types/cypress.types";
import {
  adminSignOut,
  signInAdmin,
  signInUser,
  signOut,
} from "../support/auth.util.cy";

describe("RLS Policy Tests", () => {
  const testRlsPath = configuration.paths.testRls;

  beforeEach(() => {
    cy.visit("/");
  });

  it("should enforce RLS policies correctly for both auth and admin users", () => {
    cy.log("=== Testing RLS policies for regular user ===");

    signInUser();

    // sendMessage("RLS test message from user");

    // Visit the RLS test page directly
    cy.visit(testRlsPath);

    cy.url().should("include", testRlsPath);

    cy.get("body").should("contain", "RLS Policy Test Results");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    // Test for expected feature badges (green)
    cy.get(`[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`, {
      timeout: 30000,
    })
      .should("have.length.greaterThan", 0)
      .and("be.visible")
      .and("contain", "expected feature");

    // Test for unexpected bug badges (red)
    cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`, {
      timeout: 30000,
    })
      .should("have.length.greaterThan", 0)
      .and("be.visible")
      .and("contain", "unexpected bug");

    cy.log("=== Regular user tests completed ===");

    signOut();

    cy.log("=== Testing RLS policies for admin user ===");

    signInAdmin();

    cy.visit(testRlsPath);

    cy.url().should("include", testRlsPath);

    cy.get("body").should("contain", "RLS Policy Test Results");

    // Wait for tests to complete (they run sequentially)
    cy.get("body", { timeout: 180000 }).should("not.contain", "Running...");
    cy.get("body", { timeout: 180000 }).should("not.contain", "Waiting...");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PROFILE_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_FILE_UPLOAD_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_SELECT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✓ Success");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_INSERT}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_UPDATE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    cy.get(`[data-cy="${DataCyAttributes.RLS_TEST_PAYMENT_DELETE}"]`, {
      timeout: 30000,
    })
      .should("be.visible")
      .and("contain", "✗ Failed");

    // Test for expected feature badges (green) in admin context
    cy.get(`[data-cy="${DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE}"]`, {
      timeout: 30000,
    })
      .should("have.length.greaterThan", 0)
      .and("be.visible")
      .and("contain", "expected feature");

    // Test for unexpected bug badges (red) in admin context
    cy.get(`[data-cy="${DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE}"]`, {
      timeout: 30000,
    })
      .should("have.length.greaterThan", 0)
      .and("be.visible")
      .and("contain", "unexpected bug");

    cy.log("=== Admin user tests completed ===");

    adminSignOut();

    cy.log("=== All RLS policy tests completed successfully ===");
  });
});
