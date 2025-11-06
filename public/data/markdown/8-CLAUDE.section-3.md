<!-- option-1 -->
**Client-side only (No database)**

Component <-> hook <-> store

- React Query hooks fetch data from external APIs or manage client-side state.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
<!-- /option-1 -->

<!-- option-2 -->
**NeonDB + Better Auth + Prisma**

DB <-> Action <-> hook <-> store

- Better-auth client methods are called directly in react-query hooks.
- Prisma client queries are called in actions via getAuthenticatedClient.
- Actions are called via react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `"@prisma/client"`
<!-- /option-2 -->

<!-- option-3 -->
**Supabase + Better Auth + Prisma**

DB <-> Action <-> hook <-> store

- Better-auth client methods are called directly in react-query hooks.
- Prisma client queries are called in actions via getAuthenticatedClient.
- Actions are called via react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `"@prisma/client"`
<!-- /option-3 -->

<!-- option-4 -->
**Supabase only (Supabase Auth)**

DB <-> Supabase Client <-> hook <-> store

- Supabase client queries are called directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `@/integrations/supabase/types`.
<!-- /option-4 -->
