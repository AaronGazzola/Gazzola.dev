<!-- option-1 -->

DB <-> Supabase Client <-> hook <-> store

- Supabase client queries are called directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store (if applicable).
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `@/supabase/types`.

## Example of file patterns - [`util.md`](util.md)

Follow the examples outlined in [`util.md`](util.md) when working on hook, store or type files.

<!-- /option-1 -->

<!-- option-2 -->

DB <-> Action <-> hook <-> store

- Better-auth client methods are called directly in react-query hooks.
- Prisma client queries are called in actions via getAuthenticatedClient.
- Actions are called via react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `"@prisma/client"`

## Example of file patterns - [`util.md`](util.md)

Follow the examples outlined in [`util.md`](util.md) when working on hook, action, store or type files. The file also contains the `prisma-rls.ts` and `action.util.ts` files for reference.

<!-- /option-2 -->

<!-- option-3 -->

DB <-> Action/Supabase Client <-> hook <-> store

- Better-auth client methods are called directly in react-query hooks.
- Prisma client queries are called in actions via getAuthenticatedClient for NeonDB.
- Supabase client queries are called directly in react-query hooks for real-time features.
- Actions are called via react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- Database types should be defined from `"@prisma/client"` for NeonDB and `@/supabase/types` for Supabase.

<!-- /option-3 -->

<!-- option-4 -->

Component <-> hook <-> store

- No database interactions - frontend only.
- API calls (if any) are made directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All types should be defined in `.types.ts` files alongside components.

## Example of file patterns - [`util.md`](util.md)

Follow the examples outlined in [`util.md`](util.md) when working on hook, store or type files.

<!-- /option-4 -->
