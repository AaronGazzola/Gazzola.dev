<!-- option-1 -->
## Deployment

### Deploying to Vercel

Vercel is the recommended platform for deploying Next.js applications:

1. **Create a Vercel account**

   Visit [vercel.com](https://vercel.com) and sign up with your GitHub account.

2. **Import your project**

   - Click "New Project" in your Vercel dashboard
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings

3. **Add environment variables**

   In your project settings, add all the environment variables from your `.env.local` file.

4. **Deploy**

   Click "Deploy" and Vercel will build and publish your application.

Your application will be live at `https://your-project-name.vercel.app`

Every time you push code to your main branch, Vercel will automatically deploy the updates.
<!-- /option-1 -->

<!-- option-2 -->
### Deploying Your Database to Railway

If you're using NeonDB or need to host PostgreSQL:

1. **Create a Railway account**

   Visit [railway.app](https://railway.app) and sign up.

2. **Create a new PostgreSQL database**

   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy the connection string from the "Connect" tab

3. **Update your environment variables**

   Add the Railway database connection string to your Vercel environment variables.

4. **Run migrations**

   After deployment, run your database migrations:

   ```bash
   npx prisma migrate deploy
   ```
<!-- /option-2 -->
