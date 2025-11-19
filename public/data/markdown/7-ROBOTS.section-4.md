<!-- option-1 -->
# Testing

All tests should be performed with Playwright and documented in the `Tests.md` document.

## Test rules:

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.
- Use Page Object Model pattern for complex test scenarios
- Run tests with: `npm run test:e2e`

## Example Playwright Test:

```typescript
import { test, expect } from '@playwright/test';
import { TestIds } from '@/test.types';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId(TestIds.EMAIL_INPUT).fill('user@example.com');
  await page.getByTestId(TestIds.PASSWORD_INPUT).fill('password');
  await page.getByTestId(TestIds.LOGIN_BUTTON).click();
  await expect(page).toHaveURL('/dashboard');
});
```
<!-- /option-1 -->

<!-- option-2 -->
# Testing

All tests should be performed with Cypress and documented in the `Tests.md` document.

## Test rules:

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Use custom commands for common actions
- Run E2E tests with: `npm run cypress:open`
- Run component tests with: `npm run cypress:component`

## Example Cypress Test:

```typescript
import { TestIds } from '@/test.types';

describe('Authentication', () => {
  it('allows user to login', () => {
    cy.visit('/login');
    cy.get(`[data-testid="${TestIds.EMAIL_INPUT}"]`).type('user@example.com');
    cy.get(`[data-testid="${TestIds.PASSWORD_INPUT}"]`).type('password');
    cy.get(`[data-testid="${TestIds.LOGIN_BUTTON}"]`).click();
    cy.url().should('include', '/dashboard');
  });
});
```
<!-- /option-2 -->

<!-- option-3 -->
# Testing

All tests should be performed with Jest for unit tests and Playwright for E2E tests.

## Unit Test Rules (Jest):

- Test hooks and utilities in isolation
- Mock external dependencies
- Use React Testing Library for component tests
- Run with: `npm run test:unit`

## E2E Test Rules (Playwright):

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.
- Run with: `npm run test:e2e`

## Example Jest Test:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth.store';

describe('useAuthStore', () => {
  it('sets user on login', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser({ id: '1', email: 'user@example.com' });
    });
    expect(result.current.user).toEqual({ id: '1', email: 'user@example.com' });
  });
});
```
<!-- /option-3 -->

<!-- option-4 -->
# Testing

Testing is not configured for this project. Add testing frameworks as needed based on project requirements.

## Recommended Setup:

For comprehensive testing, consider adding:
- **Playwright** for E2E testing
- **Jest** with React Testing Library for unit/component tests
- **Cypress** as an alternative E2E solution

When adding tests:
- Use data-attributes for element selection
- Create a `test.types.ts` file with TestIds enum
- Document all tests in `Tests.md`
<!-- /option-4 -->