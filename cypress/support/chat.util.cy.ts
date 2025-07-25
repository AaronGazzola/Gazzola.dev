//-| File path: cypress/support/chat.util.cy.ts
import { DataCyAttributes } from "../../types/cypress.types";

export function clickConversationWithUnreadBadge(): void {
  cy.get(`[data-cy="${DataCyAttributes.UNREAD_BADGE}"]`, {
    timeout: 60000,
  })
    .should("be.visible")
    .parents(`[data-cy="${DataCyAttributes.CONVERSATION_ITEM}"]`)
    .first()
    .click();
}

export function sendMessage(
  messageContent: string,
  isNewConversation = false
): void {
  cy.get(`[data-cy="${DataCyAttributes.CHAT_INPUT_TEXTAREA}"]`, {
    timeout: 30000,
  }).type(messageContent);
  if (!isNewConversation)
    cy.get(`[data-cy="${DataCyAttributes.SEND_MESSAGE_BUTTON}"]`).click();
  if (isNewConversation)
    cy.get(
      `[data-cy="${DataCyAttributes.CREATE_NEW_CONVERSATION_BUTTON}"]`
    ).click();
  cy.get(`[data-cy="${DataCyAttributes.SUCCESS_MESSAGE_SEND}"]`, {
    timeout: 30000,
  }).should("be.visible");
}

export function receiveMessage(expectedContent: string): void {
  cy.get(`[data-cy="${DataCyAttributes.CHAT_WINDOW_MESSAGE}"]`, {
    timeout: 90000,
  })
    .contains(expectedContent)
    .should("be.visible");
}

export function clickUserInTable(): void {
  const USER_EMAIL = Cypress.env("USER_EMAIL");

  function searchUserInCurrentPage(): Cypress.Chainable<boolean> {
    return cy
      .get(`[data-cy="${DataCyAttributes.USER_TABLE_ROW}"]`)
      .then(($rows) => {
        const userFound = Array.from($rows).some((row) =>
          row.textContent?.includes(USER_EMAIL)
        );
        return cy.wrap(userFound);
      });
  }

  function clickUserIfFound(): void {
    cy.get(`[data-cy="${DataCyAttributes.USER_TABLE_ROW}"]`)
      .contains(USER_EMAIL)
      .click();
  }

  function searchAndClickUser(): void {
    searchUserInCurrentPage().then((found) => {
      if (found) {
        clickUserIfFound();
      } else {
        cy.get(`[data-cy="${DataCyAttributes.USER_TABLE_NEXT_BUTTON}"]`).then(
          ($button) => {
            if ($button.length > 0 && !$button.is(":disabled")) {
              cy.wrap($button).click();
              searchAndClickUser();
            } else {
              throw new Error(
                `User with email ${USER_EMAIL} not found in table`
              );
            }
          }
        );
      }
    });
  }

  searchAndClickUser();
}
