# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Technologies

<!-- section-1 -->

## Project Structure

<!-- component-AppStructureAscii -->

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatinate classes.

# File Organization and Naming Conventions

<!-- section-2 -->

# Hook, action, store and type patterns

<!-- section-3 -->

## Example of file patterns - [`docs/utils.md`](docs/utils.md)

Follow the examples outlined in [`docs/utils.md`](docs/utils.md) when working on hook, action, store or type files. The file also contains the `prisma-rls.ts` and `action.utils.ts` files for reference.

# Testing

<!-- section-4 -->

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`.
