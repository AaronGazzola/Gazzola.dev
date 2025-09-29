# Prompt commands:

The commands and numbers below are shorthand references to the corresponding prompts.

1. `_clear_logs`: "Delete all console.logs in the repo. Keep console.logs implemented via `conditionalLog`. Keep all console.warns and all console.errors"

2. `_add_logs`: "Add logging using the `conditionalLog` function exported from `lib/log.util.ts`. The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`. Add a new or existing label to `NEXT_PUBLIC_LOG_LABELS` and `LOG_LABELS` in `lib/log.util.ts`

3. `_build_plan`: "run `npm run build`, then create a plan to fix the build errors"

4. `_build_fix`: "run `npm run build` and fix the build errors"

5. `_test_plan`: "run `npx jest`, then create a plan to fix the fail cases"

6. `_test_fix`: "run `npx jest` and fix the fail cases"

7. `_test_doc`: "compare `docs/Test.md` with all tests in the repo and update the Test document to align with the actual tests."

8. `_test_doc_fix`: "compare `docs/Test.md` with all tests in the repo and update the tests to align with the `docs/Test.md` document"
