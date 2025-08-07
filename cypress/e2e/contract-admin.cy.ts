//-| File path: cypress/e2e/contract-admin.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInAdmin, signOut } from "../support/auth.util.cy";
import { clickUserInTable } from "../support/chat.util.cy";
import { createContract } from "../support/contract.util.cy";

describe("Contract Management - Admin User", () => {
  it("admin should manage contracts through the full workflow", () => {
    cy.visit("/");
    signInAdmin();
    clickUserInTable();

    cy.get(`[data-cy="${DataCyAttributes.CONTRACTS_TITLE}"]`, {
      timeout: 30000,
    }).should("be.visible");

    cy.wait(3000);

    cy.get("body").then(($body) => {
      if (
        $body.find(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`)
          .length === 0 ||
        !$body
          .find(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`)
          .is(":visible")
      ) {
        cy.get(`[data-cy="${DataCyAttributes.DELETE_CONTRACTS}"]`, {
          timeout: 30000,
        }).click();

        cy.get(`[data-cy="${DataCyAttributes.SUCCESS_DELETE_CONTRACTS}"]`, {
          timeout: 60000,
        }).should("exist");

        cy.get(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`, {
          timeout: 30000,
        }).should("be.visible");
      }
    });

    // Create initial contract
    cy.get(`[data-cy="${DataCyAttributes.CREATE_CONTRACT_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    createContract({
      title: "Admin Initial Contract",
      description: "Initial contract created by admin",
      startDate: "2025-08-01",
      targetDate: "2025-09-01",
      dueDate: "2025-09-15",
      taskTitle: "Initial Task",
      taskDescription: "Initial task description",
      taskPrice: "2000",
    });

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_CREATE}"]`, {
      timeout: 60000,
    }).should("exist");

    // Approve and submit the initial contract
    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, {
      timeout: 120000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .first()
      .click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_APPROVED_SWITCH}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_SAVE_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_UPDATE}"]`, {
      timeout: 60000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_PAID_BADGE}"]`, {
      timeout: 120000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .first()
      .click();

    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_DIALOG}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_TASK_TOGGLE_PROGRESS_BUTTON}"]`,
      { timeout: 10000 }
    )
      .first()
      .click();

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_SELECT}"]`,
      { timeout: 10000 }
    ).select("in_progress");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_SELECT}"]`,
      { timeout: 10000 }
    ).select("approved");

    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_UPDATE_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ACTIVE_CONTRACT_UPDATE}"]`, {
      timeout: 60000,
    }).should("exist");

    signOut();
  });
});
