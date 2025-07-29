//-| File path: cypress/e2e/contract-admin.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInAdmin, signOut } from "../support/auth.util.cy";
import { clickUserInTable } from "../support/chat.util.cy";

describe("Contract Management - Admin User", () => {
  it("admin should manage contracts through the full workflow", () => {
    cy.visit("/");
    signInAdmin();
    clickUserInTable();

    cy.get(`[data-cy="${DataCyAttributes.DELETE_CONTRACTS}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, {
      timeout: 90000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .first()
      .click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TITLE_INPUT}"]`)
      .clear()
      .type("Updated Admin Contract Title");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DESCRIPTION_INPUT}"]`)
      .clear()
      .type("Updated admin contract description with full details");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_START_DATE_INPUT}"]`)
      .invoke("val", "2025-08-01")
      .trigger("change");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TARGET_DATE_INPUT}"]`)
      .invoke("val", "2025-09-01")
      .trigger("change");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DUE_DATE_INPUT}"]`)
      .invoke("val", "2025-09-15")
      .trigger("change");

    cy.get(
      `[data-cy="${DataCyAttributes.EDIT_CONTRACT_APPROVED_SWITCH}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_SAVE_BUTTON}"]`).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_PAID_BADGE}"]`, {
      timeout: 90000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .first()
      .click();

    cy.get(`[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_DIALOG}"]`).should(
      "exist"
    );

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_TASK_TOGGLE_PROGRESS_BUTTON}"]`
    )
      .first()
      .click();

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_SELECT}"]`
    ).select("in_progress");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_SELECT}"]`
    ).select("approved");

    cy.get(
      `[data-cy="${DataCyAttributes.ACTIVE_CONTRACT_UPDATE_BUTTON}"]`
    ).click();

    cy.get(`[data-cy="${DataCyAttributes.SUCCESS_ACTIVE_CONTRACT_UPDATE}"]`, {
      timeout: 30000,
    }).should("exist");

    signOut();
  });
});
