//-| File path: cypress/e2e/contract-admin.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";
import { signInAdmin, signOut } from "../support/auth.util.cy";
import { clickUserInTable } from "../support/chat.util.cy";

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
      if ($body.find(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`).length === 0 || 
          !$body.find(`[data-cy="${DataCyAttributes.NO_CONTRACTS_YET}"]`).is(":visible")) {
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

    cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, {
      timeout: 120000,
    })
      .should("exist")
      .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
      .first()
      .click();

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TITLE_INPUT}"]`, {
      timeout: 10000,
    })
      .clear()
      .type("Updated Admin Contract Title");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DESCRIPTION_INPUT}"]`, {
      timeout: 10000,
    })
      .clear()
      .type("Updated admin contract description with full details");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_START_DATE_INPUT}"]`, {
      timeout: 10000,
    })
      .invoke("val", "2025-08-01")
      .trigger("change");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TARGET_DATE_INPUT}"]`, {
      timeout: 10000,
    })
      .invoke("val", "2025-09-01")
      .trigger("change");

    cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DUE_DATE_INPUT}"]`, {
      timeout: 10000,
    })
      .invoke("val", "2025-09-15")
      .trigger("change");

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
