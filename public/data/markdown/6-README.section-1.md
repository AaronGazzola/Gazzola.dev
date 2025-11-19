## Project Structure

<!-- option-1 -->

### Base Project Files

Essential files included in every project setup:

- `globals.css` - Global application styles and Tailwind directives
- `components/ui/*` - Shadcn component library for building interfaces
- `lib/log.utils.ts` - Logging utility functions for development and debugging

<!-- /option-1 -->

<!-- option-2 -->

### Prisma Database Integration

Files for Prisma ORM and database management:

- `prisma/schema.prisma` - Database schema definition and model configuration
- `prisma/migrations/` - Database migration history
- `lib/prisma.ts` - Prisma client instance and configuration
- `prisma/.env.local` - Database connection string for local development

**Setup:**

```bash
npm install @prisma/client
npm install -D prisma
```

<!-- /option-2 -->

<!-- option-3 -->

### Supabase Integration

Files for Supabase client and database configuration:

- `lib/supabase.ts` - Supabase client initialization
- `integrations/supabase/types.ts` - Auto-generated TypeScript types
- `integrations/supabase/client.ts` - Supabase browser client
- `.env.local` - Supabase API keys and project URL

**Setup:**

```bash
npm install @supabase/supabase-js
```

<!-- /option-3 -->
