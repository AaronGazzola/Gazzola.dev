<!-- option-1 -->
### Deploying to Vercel

**Prerequisites:**
- Vercel account
- GitHub repository connected to Vercel

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your application:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

**Configuration:**
- Vercel automatically detects Next.js projects
- Environment variables should be set in the Vercel dashboard under Settings → Environment Variables
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`

**Custom Domain:**
1. Go to your project settings in Vercel dashboard
2. Navigate to Domains
3. Add your custom domain
4. Update your DNS records as instructed

**Continuous Deployment:**
- Vercel automatically deploys on push to your main branch
- Pull requests create preview deployments
- Configure branch deployments in Settings → Git
<!-- /option-1 -->

<!-- option-2 -->
### Deploying to Railway

**Prerequisites:**
- Railway account
- GitHub repository

**Steps:**

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize your project:
```bash
railway init
```

4. Link to your Railway project:
```bash
railway link
```

5. Deploy your application:
```bash
railway up
```

**Configuration:**

Create a `railway.json` file in your project root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Environment Variables:**
- Set in Railway dashboard under Variables tab
- Or use CLI: `railway variables set KEY=value`

**Health Checks:**
Railway automatically monitors your application. Configure health check endpoint in your application:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

**Custom Domain:**
1. Go to Settings in Railway dashboard
2. Navigate to Domains
3. Add custom domain
4. Update DNS records with provided values

**Scaling:**
- Railway supports horizontal and vertical scaling
- Configure in Settings → Resources
- Adjust memory and CPU allocation as needed
<!-- /option-2 -->
