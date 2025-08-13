import { DataCyAttributes } from "../../types/cypress.types";

describe("RLS (Row Level Security) Test", () => {
  it("should test RLS policies with admin and user roles", () => {
    // Visit the RLS test page
    cy.visit("/test/rls");

    // Step 1-5: Sign in as admin
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

    // Step 6: Admin attempts to insert new user (error - no INSERT policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_NEW_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_INSERT_NEW_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 7: Admin attempts to update user user (error - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 8: Admin attempts to update admin user (error - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 9: Admin attempts to delete user user (error - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 10: Admin attempts to delete admin user (error - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 11: Admin selects admin user
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 12: Admin selects user user
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");


    // Step 13: Admin selects other user (success - admin can see all users)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_OTHER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_OTHER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 14: Admin deletes admin profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_DELETE_ADMIN_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 15: Admin inserts admin profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_ADMIN_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_INSERT_ADMIN_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 16: Admin deletes all user tasks
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_TASKS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 17: Admin deletes all user messages
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_MESSAGES_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 18: Admin deletes all user conversations
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_CONVERSATIONS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 19: Admin deletes all user contracts
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ALL_USER_CONTRACTS_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 20: Admin deletes user profile
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_DELETE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 21: Admin signs out
    cy.get(`[data-cy="${DataCyAttributes.RLS_SIGN_OUT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SIGN_OUT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 22: Enter user email (success)
    // Step 23: Enter user password (success)  
    // Step 24: Click sign in button (success)
    // Step 25: Verify user sign in successful (success)
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

    // Step 26: User attempts to insert new user (error - no INSERT policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_NEW_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_INSERT_NEW_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 27: User attempts to update user user (error - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 28: User attempts to update admin user (error - no UPDATE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 29: User attempts to delete user user (error - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 30: User attempts to delete admin user (error - no DELETE policy on user table)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 31: User selects admin user (success - users can select admin user id)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_ADMIN_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_ADMIN_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 32: User selects user user (success - selecting own user)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_USER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_SELECT_USER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 33: User attempts to select other user (error - user can only select own user)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_SELECT_OTHER_USER_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_SELECT_OTHER_USER}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 34: User inserts user profile (success - creating own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_INSERT_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 35: User updates user profile (success - updating own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_UPDATE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 36: User attempts to delete user profile (error - only admin can delete profiles)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_PROFILE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_DELETE_USER_PROFILE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 37: User attempts to insert conversation (success)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 38: User attempts to insert conversation (error - users can only insert the initial conversation)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONVERSATION_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 39: User updates conversation (success - user can update conversations they participate in)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONVERSATION_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 40: User attempts to delete conversation (error - only admin can delete conversations)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_CONVERSATION_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 41: User inserts message (success - user can insert messages in conversations they participate in)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 42: User attempts to update message (error - only admin can update messages)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_MESSAGE_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 43: User attempts to delete message (error - only admin can delete messages)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_MESSAGE_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_MESSAGE_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 44: User creates contract (success - user can create contract for own profile)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 45: User inserts task (success - user can insert task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 46: User updates task (success - user can update task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 47: User deletes task (success - user can delete task for own contract when unpaid)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 48: User inserts task again (success - to have a task for next steps)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 49: User updates contract (success - this sets isPaid to true)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 50: User pays contract using secure payment processing (success)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_PAY_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_SUCCESS_PAY_USER_CONTRACT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 51: User attempts to update task (error - users can't mutate tasks when contract isPaid=true)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 52: User attempts to delete task (error - users can't mutate tasks when contract isPaid=true)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 53: User attempts to insert new task on paid contract (error - users can't insert tasks when contract isPaid=true)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_TASK_INSERT}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 54: User attempts to update paid contract (error - user cannot update paid contract)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_UPDATE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    // Step 55: User attempts to delete contract (error - only admin can delete contracts)
    cy.get(
      `[data-cy="${DataCyAttributes.RLS_DELETE_USER_CONTRACT_BUTTON}"]`
    ).click();
    cy.get(`[data-cy="${DataCyAttributes.RLS_ERROR_CONTRACT_DELETE}"]`, {
      timeout: 30000,
    }).should("exist");
  });
});
