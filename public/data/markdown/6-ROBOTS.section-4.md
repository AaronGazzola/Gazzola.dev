<!-- option-1 -->
Copy the generated files to the following locations in your Next.js project:

**Root Level:**
- Copy `package.json` → Merge with existing `package.json`
- Copy `tsconfig.json` → Replace existing `tsconfig.json`
- Copy `tailwind.config.ts` → Replace existing `tailwind.config.ts`
- Copy `next.config.js` → Replace existing `next.config.js`
- Copy `.env.local` → Create new `.env.local` (fill in actual values)

**Directory Structure:**
- Copy `app/` → Merge with existing `app/` directory
- Copy `components/` → Create new `components/` directory
- Copy `lib/` → Create new `lib/` directory
- Copy `hooks/` → Create new `hooks/` directory
- Copy `types/` → Create new `types/` directory

**Testing:**
- Copy `__tests__/` → Create new `__tests__/` directory
- Copy `playwright.config.ts` → Create new file
- Copy `jest.config.js` → Create new file

**Database:**
- Copy `prisma/` → Create new `prisma/` directory (if using Prisma)
- Copy `supabase/` → Create new `supabase/` directory (if using Supabase)

After copying files:
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Configure environment variables in `.env.local`
4. Run database migrations if applicable
<!-- /option-1 -->
