# Testing prompt:

This document contains instructions for a testing process. Refer to this document throughout the duration of the testing process and ensure that the rules and process below are consistently adhered to

## Test rules:

- All tests should identify all elements using playwright testIds (Do not identify elements using text content)
- Do not skip any tests
- Do not change the purpose or overall functionality of each test unless instructed - ie. don't simplify the test to make the test pass
- Do not continue on to the next test until each test passes
- Once each test passes in isolation, run the parent testing suite to ensure that the test passes when run with other tests
- Do not run all tests with `npm run test`
- Do not run tests in headed mode unless required

## Test process:

1. Refer to the test results provided via chat and found in `test-results/` and run each failing or skipped test individually.
2. Make fixes to the test, or to the app code (provided that the app code changes are not significant deviations in functionality)
3. Re-run the test to verify that it passes, if it fails then fix it and repeat.

## When to STOP and ask for calrification or manual testing:

- If application functionality requires significant changes
- If repeated attempts to fix the test have failed - DO NOT containue on to another test - STOP and ask for clarification or manual testing
