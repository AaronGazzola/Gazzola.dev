<!-- option-1 -->
All tests should be performed with Playwright and documented in the `Tests.md` document. For complete testing instructions, patterns, and documentation format, refer to [`docs/Testing.md`](docs/Testing.md).

**Test rules:**

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.
<!-- /option-1 -->

<!-- option-2 -->
All tests should be performed with Playwright or Cypress and documented in the `Tests.md` document. For complete testing instructions, patterns, and documentation format, refer to [`docs/Testing.md`](docs/Testing.md).

**Test rules:**

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.
<!-- /option-2 -->
