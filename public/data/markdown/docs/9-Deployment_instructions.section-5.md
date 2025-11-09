<!-- option-1 -->
### Stripe Webhook Configuration

**Create Webhook Endpoint:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

4. Copy the webhook signing secret
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

**Test Webhook:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Webhook Handler:**
Verify webhook signatures in your handler to ensure security.
<!-- /option-1 -->

<!-- option-2 -->
### PayPal Webhook Configuration

**Create Webhook:**
1. Go to PayPal Developer Dashboard
2. Select your app
3. Add webhook URL: `https://your-domain.com/api/webhooks/paypal`
4. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`

**Verify Webhooks:**
PayPal provides webhook signature verification. Implement in your handler.
<!-- /option-2 -->

<!-- option-3 -->
### Health Checks (Railway)

**Configure Health Check Endpoint:**
Create endpoint at `/health` or `/api/health`:

```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

**Railway Configuration:**
Railway automatically detects health checks. Configure in `railway.json`:

```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```
<!-- /option-3 -->

<!-- option-4 -->
### Domain and SSL Setup (Vercel)

**Add Custom Domain:**
1. Go to project settings in Vercel
2. Navigate to Domains tab
3. Add your domain

**DNS Configuration:**
Add these records to your DNS provider:
- A record: `76.76.21.21`
- AAAA record: `2606:4700:4700::1111`

Or use CNAME:
- CNAME: `cname.vercel-dns.com`

**SSL Certificate:**
- Vercel automatically provisions SSL certificates
- Certificates auto-renew
- HTTPS enforced by default

**Redirect www to apex:**
Configure in Vercel dashboard or use redirect in `vercel.json`
<!-- /option-4 -->

<!-- option-5 -->
### Domain and SSL Setup (Railway)

**Add Custom Domain:**
1. Go to your project settings
2. Click on Domains
3. Add custom domain

**DNS Configuration:**
Point your domain to Railway:
- CNAME record: `your-app.up.railway.app`
- Or use A records provided by Railway

**SSL Certificate:**
- Railway automatically provisions Let's Encrypt certificates
- Auto-renewal enabled
- HTTPS enforced

**Domain Verification:**
May require TXT record verification for some domains
<!-- /option-5 -->

<!-- option-6 -->
### Email Deliverability (Resend)

**Domain Verification:**
1. Add domain in Resend dashboard
2. Add DNS records:
   - SPF: `v=spf1 include:resend.com ~all`
   - DKIM: Provided by Resend
   - DMARC: `v=DMARC1; p=none;`

**Verification:**
- Verify domain in Resend dashboard
- Test email delivery
- Monitor bounce rates

**Best Practices:**
- Use verified domain for production
- Set up DMARC policy to `quarantine` or `reject` after testing
- Monitor email reputation
<!-- /option-6 -->

<!-- option-7 -->
### Monitoring and Logging

**Application Monitoring:**
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user analytics

**Database Monitoring:**
- Monitor connection pool usage
- Set up slow query alerts
- Track database size and growth

**Platform Monitoring:**
- Use platform-provided metrics
- Set up uptime monitoring
- Configure alerts for downtime

**Log Aggregation:**
Consider log aggregation service:
- Logtail
- Datadog
- New Relic
<!-- /option-7 -->

<!-- option-8 -->
### File Storage Setup (Supabase)

**Create Storage Buckets:**
1. Go to Supabase dashboard → Storage
2. Create new bucket
3. Configure bucket as public or private

**Bucket Policies:**
Set up access policies:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-bucket');

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');
```

**CORS Configuration:**
Configure CORS if accessing from different domain:
1. Go to Storage → Configuration
2. Add allowed origins
3. Set allowed methods

**CDN:**
Supabase Storage includes CDN. Use transformation parameters for images:
```
https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg?width=500
```
<!-- /option-8 -->

<!-- option-9 -->
### Realtime Setup (Supabase)

**Enable Replication:**
1. Go to Database → Replication
2. Enable for tables you want realtime updates
3. Configure publication settings

**Security:**
Set up RLS policies for realtime:
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their messages"
ON messages FOR SELECT
USING (auth.uid() = user_id);
```

**Client Configuration:**
Realtime subscriptions are automatic with Supabase client. Ensure proper channel naming and filtering.

**Monitoring:**
- Monitor connection count
- Check message delivery latency
- Set up alerts for connection issues
<!-- /option-9 -->

<!-- option-10 -->
### Post-Deployment Verification

**Checklist:**
- [ ] Application loads correctly at production URL
- [ ] Database migrations applied successfully
- [ ] All environment variables set correctly
- [ ] Authentication flow works (sign up, login, logout)
- [ ] Email delivery working
- [ ] Payment processing functional (if applicable)
- [ ] File uploads working (if applicable)
- [ ] API endpoints responding correctly
- [ ] SSL certificate valid and auto-renewing
- [ ] Monitoring and logging configured
- [ ] Error tracking set up
- [ ] Backups configured
- [ ] Domain DNS propagated

**Load Testing:**
Test your application under load:
```bash
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com
```

**Security Scan:**
- Run security audit: `npm audit`
- Check for exposed secrets
- Verify CORS settings
- Test rate limiting
- Verify CSP headers
<!-- /option-10 -->
