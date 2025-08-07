//-| File path: cypress/e2e/contract-auth.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInUser, signOut } from "../support/auth.util.cy";

describe("Contract Management - Auth User", () => {
  it("user should manage contract created by admin through the full workflow", () => {
    cy.visit("/");
    signInUser();
    cy.wait(5000);

    // Initially should see "no contracts yet" before admin creates contract
    cy.get(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`, {
      timeout: 90000,
    }).should("exist");

    // Wait for admin to create contract, then click on the contract with unapproved badge
    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, {
      timeout: 120000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DIALOG}"]`, {
      timeout: 10000,
    }).should("exist");

    // Update the contract with user changes
    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TITLE_INPUT}"]`, {
      timeout: 10000,
    })
      .clear()
      .type("User Updated Contract Title");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DESCRIPTION_INPUT}"]`, {
      timeout: 10000,
    })
      .clear()
      .type("User updated contract description with additional requirements");

    // Approve and submit the updated contract
    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_APPROVED_SWITCH}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_SAVE_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_UPDATE}"]`, {
      timeout: 60000,
    }).should("exist");

    // Wait for admin to make final updates, then approve and pay
    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_APPROVED_BADGE}"]`, {
      timeout: 120000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DIALOG}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_PAYMENT_BUTTON}"]`, {
      timeout: 10000,
    }).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_PAYMENT}"]`, {
      timeout: 60000,
    }).should("exist");
    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_DIALOG}"]`, {
      timeout: 60000,
    }).should("exist");

    // Verify that at least one task is in "in_progress" status
    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_TASK_TOGGLE_PROGRESS_BUTTON}"][data-progress-status="in_progress"]`,
      { timeout: 60000 }
    ).should("exist");
    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_PAID_STATUS_BADGE}"]`,
      { timeout: 60000 }
    )
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Paid");
    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_BADGE}"]`,
      { timeout: 60000 }
    )
      .should("exist")
      .and("be.visible")
      .and("contain.text", "In Progress");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_BADGE}"]`,
      { timeout: 10000 }
    )
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Approved");

    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_CLOSE_BUTTON}"]`, {
      timeout: 60000,
    }).click();

    signOut();
  });
});
