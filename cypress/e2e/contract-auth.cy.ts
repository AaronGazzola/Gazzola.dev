//-| File path: cypress/e2e/contract-auth.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInUser, signOut } from "../support/auth.util.cy";
import { createContract } from "../support/contract.util.cy";

describe("Contract Management - Auth User", () => {
  it("user should create and manage contract through the full workflow", () => {
    cy.visit("/");
    signInUser();
    cy.wait(3000);
    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`, {
      timeout: 60000,
    }).should("not.exist");

    cy.get(`[data-cy="${DataCyAttributes.CREATE_CONTRACT_BUTTON}"]`).click();

    createContract({
      title: "Web Development Project",
      description: "Complete website development with modern design",
      startDate: "2025-08-01",
      targetDate: "2025-09-01",
      dueDate: "2025-09-15",
      taskTitle: "Frontend Development",
      taskDescription: "Build responsive React frontend",
      taskPrice: "2500",
    });

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_CREATE}"]`, {
      timeout: 30000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, {
      timeout: 60000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .click();

    cy.get(
      `[data-cy="${DataCyAttributes.EDIT_CONTRACT_APPROVED_SWITCH}"]`
    ).click();

    cy.get(
      `[data-cy="${DataCyAttributes.EDIT_CONTRACT_PAYMENT_BUTTON}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_PAYMENT}"]`, {
      timeout: 30000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_DIALOG}"]`).should(
      "exist"
    );

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_BADGE}"]`
    )
      .should("exist")
      .and("be.visible")
      .and("contain.text", "In Progress");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_BADGE}"]`
    )
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Approved");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_TASK_TOGGLE_PROGRESS_BUTTON}"]`
    ).should("have.attr", "data-progress-status", "in_progress");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_CLOSE_BUTTON}"]`
    ).click();

    signOut();
  });
});
