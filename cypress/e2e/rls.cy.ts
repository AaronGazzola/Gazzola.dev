import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS (Row Level Security) Test", () => {
  it("should test RLS policies with admin and user roles", () => {
    // Visit the RLS test page
    cy.visit("/test/rls");

    // Step 1-11: Sign in as admin
    cy.get(`[data-cy="${DataCyAttributes.RLS_EMAIL_INPUT}"]`).type(
      Cypress.env("ADMIN_EMAIL")
    );
    cy.get(`[data-cy="${DataCyAttributes.RLS_PASSWORD_INPUT}"]`).type(
      Cypress.env("ADMIN_PASSWORD")
    );
    cy.get(`[data-cy="${DataCyAttributes.RLS_SIGN_IN_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SIGN_IN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 12: Insert new user (should fail - no INSERT policy on user table, even for admin)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_NEW_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_INSERT_NEW_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 13: Update user user (should fail - no UPDATE policy on user table, even for admin)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 14: Update admin user (should fail - no UPDATE policy on user table, even for admin)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 15: Delete user user (should fail - no DELETE policy on user table, even for admin)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 16: Delete admin user (should fail - no DELETE policy on user table, even for admin)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 17: Select admin user
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 18: Select user user
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 19: Delete admin profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_DELETE_ADMIN_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 20: Insert admin profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_ADMIN_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_INSERT_ADMIN_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 21: Delete all user tasks
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_TASKS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 22: Delete all user messages
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_MESSAGES_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 23: Delete all user conversations
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_CONVERSATIONS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 24: Delete all user contracts
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_CONTRACTS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 25: Delete user profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_DELETE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 26: Insert user conversation
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");
    // Step 26b: Insert user conversation
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_ADMIN_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 27: Insert admin message
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_ADMIN_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 28: Sign out
    cy.get(`[data-cy="${DataCyAttributes.RLS_SIGN_OUT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SIGN_OUT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 29-34: Sign in as user
    cy.get(`[data-cy="${DataCyAttributes.RLS_EMAIL_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_EMAIL"));
    cy.get(`[data-cy="${DataCyAttributes.RLS_PASSWORD_INPUT}"]`)
      .clear()
      .type(Cypress.env("USER_PASSWORD"));
    cy.get(`[data-cy="${DataCyAttributes.RLS_SIGN_IN_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SIGN_IN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 35: Insert new user (should fail - no INSERT policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_NEW_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_INSERT_NEW_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 36: Update user user (should fail - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 37: Update admin user (should fail - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 38: Delete user user (should fail - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 39: Delete admin user (should fail - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 40: Select admin user (should fail - user can only select own user)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_SELECT_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 41: Select user user (should succeed - selecting own user)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 42: Insert user profile (should succeed - creating own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_INSERT_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 43: Update user profile (should succeed - updating own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_UPDATE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 44: Delete user profile (should fail - only admin can delete profiles)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 45: Insert conversation (should fail - only admin can insert conversations)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 46: Update conversation (should succeed - user can update conversations they participate in)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 47: Delete conversation (should fail - only admin can delete conversations)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 48: Insert message (should succeed - user can insert messages in conversations they participate in)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 49: Update message (should fail - only admin can update messages, per migration line 100-101)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_MESSAGE_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 50: Delete message (should fail - only admin can delete messages, per migration line 103-104)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 51: Create contract (should succeed - user can create contract for own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 52: Insert task (should succeed - user can insert task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 53: Update task (should succeed - user can update task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 54: Delete task (should succeed - user can delete task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 55: Insert task again (to have a task for the next steps)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 56: Update contract (this sets isPaid to true, affecting subsequent task operations)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 56.5: Pay contract using secure payment processing (should succeed)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_PAY_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_PAY_USER_CONTRACT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 57: Update task (should fail - users can't mutate tasks when contract isPaid=true, per migration line 166-176)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 58: Delete task (should fail - users can't mutate tasks when contract isPaid=true, per migration line 178-188)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 58.5: Try to insert new task on paid contract (should fail - users can't insert tasks when contract isPaid=true, per migration line 154-164)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 59: Update contract (should fail - user cannot update paid contract per migration line 127-137)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 60: Delete contract (should fail - only admin can delete contracts)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");
  });
});
