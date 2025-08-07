import { DataCyAttributes } from "../../types/cypress.types";
import { signUpUnverifiedUser } from "../support/auth.util.cy";

// Helper function to sign up or sign in a user with complete onboarding
const signUpOrSignInWithOnboarding = (
  credentials: { email: string; password: string },
  onboardingData: {
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
  },
  isAdmin: boolean = false
) => {
  cy.log(`=== Attempting to sign up or sign in for ${credentials.email} ===`);

  // Navigate to sign up first
  cy.get(`[data-cy="${DataCyAttributes.SIGN_IN_BUTTON}"]`).click();
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

  // Fill in signup form
  cy.get(`[data-cy="${DataCyAttributes.AUTH_EMAIL_INPUT}"]`)
    .clear()
    .type(credentials.email);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_PASSWORD_INPUT}"]`)
    .clear()
    .type(credentials.password);
  cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

  // Check if signup succeeded or failed
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_UP}"]`)
        .length > 0
    ) {
      // Sign up succeeded
      cy.log("Sign up succeeded, proceeding with verification and onboarding");

      // Verify account in test mode
      cy.get(`[data-cy="${DataCyAttributes.VERIFY_ACCOUNT_BUTTON}"]`).click();
      cy.get(`[data-cy="${DataCyAttributes.SUCCESS_VERIFY_ACCOUNT}"]`, {
        timeout: 30000,
      }).should("exist");
    } else {
      // Sign up failed, try sign in instead
      cy.log("Sign up failed, attempting sign in");

      // Wait for error message to appear and be handled
      cy.get(`[data-cy="${DataCyAttributes.ERROR_AUTH_SIGN_UP}"]`, {
        timeout: 30000,
      }).should("exist");

      // Switch to sign in mode
      cy.get(`[data-cy="${DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}"]`).click();

      // Submit sign in form (credentials are already filled)
      cy.get(`[data-cy="${DataCyAttributes.AUTH_SUBMIT_BUTTON}"]`).click();

      // Wait for sign in success
      cy.get(`[data-cy="${DataCyAttributes.SUCCESS_AUTH_SIGN_IN}"]`, {
        timeout: 30000,
      }).should("exist");

      cy.log("Sign up succeeded, proceeding with verification and onboarding");

      // Verify account in test mode
      cy.get(`[data-cy="${DataCyAttributes.VERIFY_ACCOUNT_BUTTON}"]`).click();
      cy.get(`[data-cy="${DataCyAttributes.SUCCESS_VERIFY_ACCOUNT}"]`, {
        timeout: 30000,
      }).should("exist");
    }
  });

  // Complete onboarding (this should appear regardless of sign up/sign in)
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_DIALOG}"]`).should(
    "be.visible"
  );

  // Step 1: Fill in first and last name
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_FIRST_NAME_INPUT}"]`).type(
    onboardingData.firstName
  );
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_LAST_NAME_INPUT}"]`).type(
    onboardingData.lastName
  );
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_NEXT_BUTTON}"]`).click();

  // Step 2: Fill in company and phone
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_COMPANY_INPUT}"]`).type(
    onboardingData.company
  );
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_PHONE_INPUT}"]`).type(
    onboardingData.phone
  );
  cy.get(`[data-cy="${DataCyAttributes.ONBOARDING_SAVE_BUTTON}"]`).click();

  // Wait for onboarding to complete
  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ONBOARDING_SAVE}"]`, {
    timeout: 10000,
  }).should("exist");

  // Sign out user
  if (isAdmin) {
    cy.get(`[data-cy="${DataCyAttributes.ADMIN_SIGN_OUT_BUTTON}"]`).click();
  } else {
    cy.get(`[data-cy="${DataCyAttributes.PROFILE_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_BUTTON}"]`).click();
  }
  cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_CONFIRM_BUTTON}"]`).click();
  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
    timeout: 10000,
  }).should("exist");

  cy.wait(2000);
};

describe("Seed Users", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should sign up ADMIN_EMAIL and USER_EMAIL with complete onboarding, and UNVERIFIED_USER_EMAIL without onboarding", () => {
    cy.log("=== Starting User Seeding Process ===");

    // 1. Sign up or sign in and complete onboarding for ADMIN_EMAIL
    signUpOrSignInWithOnboarding(
      {
        email: Cypress.env("ADMIN_EMAIL"),
        password: Cypress.env("ADMIN_PASSWORD"),
      },
      {
        firstName: "Admin",
        lastName: "User",
        company: "Admin Company",
        phone: "555-0001",
      },
      true // isAdmin
    );

    // 2. Sign up or sign in and complete onboarding for USER_EMAIL
    signUpOrSignInWithOnboarding(
      {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD"),
      },
      {
        firstName: "Regular",
        lastName: "User",
        company: "User Company",
        phone: "555-0002",
      },
      false // isAdmin
    );

    cy.wait(2000);

    // 3. Sign up UNVERIFIED_USER_EMAIL without completing onboarding
    cy.log(
      "=== Signing up UNVERIFIED_USER_EMAIL without completing onboarding ==="
    );

    signUpUnverifiedUser();

    // Verify we're in the verification state (not completing onboarding)
    cy.get(`[data-cy="${DataCyAttributes.RESEND_EMAIL_BUTTON}"]`).should(
      "be.visible"
    );
    cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_VERIFY_BUTTON}"]`).should(
      "be.visible"
    );

    // Sign out unverified user
    cy.get(`[data-cy="${DataCyAttributes.SIGN_OUT_VERIFY_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_SIGN_OUT}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.log("=== All users have been seeded successfully ===");
  });
});
