//-| File path: cypress/support/contract.util.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";

interface ContractData {
  title: string;
  description: string;
  startDate: string;
  targetDate: string;
  dueDate: string;
  taskTitle: string;
  taskDescription: string;
  taskPrice: string;
}

export function createContract(contractData: ContractData): void {
  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TITLE_INPUT}"]`)
    .clear()
    .type(contractData.title);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DESCRIPTION_INPUT}"]`)
    .clear()
    .type(contractData.description);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_START_DATE_INPUT}"]`)
    .clear()
    .type(contractData.startDate);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TARGET_DATE_INPUT}"]`)
    .clear()
    .type(contractData.targetDate);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_DUE_DATE_INPUT}"]`)
    .clear()
    .type(contractData.dueDate);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_ADD_TASK_BUTTON}"]`)
    .click();

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TASK_ITEM}"]`)
    .first()
    .click();

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TASK_TITLE_INPUT}"]`)
    .clear()
    .type(contractData.taskTitle);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TASK_DESCRIPTION_INPUT}"]`)
    .clear()
    .type(contractData.taskDescription);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_TASK_PRICE_INPUT}"]`)
    .clear()
    .type(contractData.taskPrice);

  cy.get(`[data-cy="${DataCyAttributes.EDIT_CONTRACT_SAVE_BUTTON}"]`)
    .click();
}

export function openContractWithBadge(): void {
  cy.get(`[data-cy="${DataCyAttributes.CONTRACT_UNAPPROVED_BADGE}"]`, { timeout: 30000 })
    .should("exist")
    .parents(`[data-cy="${DataCyAttributes.CONTRACT_ITEM}"]`)
    .click();
}
