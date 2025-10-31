<!-- option-1 -->
## Serverless Deployment (Vercel)

**When to use**: Selected when "Serverless (Vercel)" deployment is chosen in InitialConfiguration

**Technologies**:
- **Vercel** for serverless deployment
- Edge Runtime support
- Automatic scaling

**Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Environment setup**:
- Set environment variables in Vercel dashboard
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Database connections should use connection pooling

**Best practices**:
- Use serverless-friendly database (NeonDB, Supabase)
- Keep function execution under 10 seconds
- Optimize bundle size for faster cold starts
<!-- /option-1 -->

<!-- option-2 -->
## Always-on Deployment (Railway)

**When to use**: Selected when "Always-on (Railway)" deployment is chosen in InitialConfiguration

**Technologies**:
- **Railway** for persistent deployment
- Long-running processes supported
- Direct database connections

**Configuration**:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Environment setup**:
- Set environment variables in Railway dashboard
- Database connections can use direct connections
- No timeout restrictions

**Best practices**:
- Suitable for WebSocket servers
- Good for background jobs and cron tasks
- Use for applications requiring persistent connections
<!-- /option-2 -->
