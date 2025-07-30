# Row Level Security (RLS) Integration Guide

## Overview

This guide explains how to integrate Row Level Security (RLS) with your existing server actions to provide database-level access control in addition to application-layer authorization.

## Setup

### 1. Apply the RLS Migration

```bash
npx prisma migrate dev
```

This will apply the `init_RLS` migration that enables RLS policies on all tables.

### 2. Verify RLS Configuration

Add this to your application startup or health check:

```typescript
import { checkRLSConfiguration } from '@/lib/rls.utils';

// In your startup code or health check
const rlsStatus = await checkRLSConfiguration();
if (!rlsStatus.isConfigured) {
  console.error('RLS Configuration Issue:', rlsStatus.error);
}
```

## Integration with Server Actions

### Option 1: Automatic RLS Context (Recommended)

Update your existing server actions to automatically set RLS context:

```typescript
// Before (existing action)
export const getContractsAction = async (userId?: string): Promise<ActionResponse<Contract[]>> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }
    
    // ... rest of action
  } catch (error) {
    return getActionResponse({ error });
  }
};

// After (with RLS integration)
import { withAuthenticatedRLS } from '@/lib/rls.utils';

export const getContractsAction = async (userId?: string): Promise<ActionResponse<Contract[]>> => {
  return withAuthenticatedRLS(
    getAuthenticatedUser,
    async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) {
          return getActionResponse({ error: "User not authenticated" });
        }
        
        // Now RLS policies will automatically enforce access control
        // Even if application logic has bugs, DB will prevent unauthorized access
        
        // ... rest of action (unchanged)
      } catch (error) {
        return getActionResponse({ error });
      }
    }
  );
};
```

### Option 2: Manual RLS Context

For more control, set RLS context manually:

```typescript
import { setRLSContext } from '@/lib/rls.utils';

export const someAction = async (): Promise<ActionResponse<SomeType>> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }
    
    // Set RLS context for this user
    await setRLSContext(user.id);
    
    // Now all subsequent DB operations will be restricted by RLS
    const data = await prisma.someTable.findMany();
    
    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

## Testing RLS Policies

### Running RLS Tests

```bash
# Run only RLS tests
npx cypress run --spec "cypress/e2e/rls.cy.ts" --env APP_ENV=test

# Run RLS tests in headed mode for debugging
npx cypress open --env APP_ENV=test
```

### RLS Test Structure

The RLS tests verify:

1. **User Isolation**: Users can only access their own data
2. **Admin Privileges**: Admins can access all data as intended
3. **Conversation Participation**: Users can only access conversations they participate in
4. **Contract Ownership**: Users can only access contracts they own
5. **Context Isolation**: User contexts don't leak between operations
6. **Privilege Escalation Prevention**: Users can't gain unauthorized access

## RLS Policy Enforcement

### What RLS Protects Against

1. **SQL Injection**: Even if malicious SQL is executed, RLS limits data access
2. **Application Bugs**: If your application logic has authorization bugs, RLS provides a safety net
3. **Direct DB Access**: If someone gains direct database access, RLS still enforces rules
4. **Privilege Escalation**: Users can't modify their role to gain admin access

### What RLS Doesn't Replace

- **Input Validation**: Still validate and sanitize all inputs
- **Authentication**: RLS requires you to set user context properly
- **Business Logic**: Complex business rules should still be in application layer
- **Rate Limiting**: Implement rate limiting at application level

## Performance Considerations

### RLS Performance Impact

- **Minimal overhead** for simple policies (user ownership checks)
- **Moderate overhead** for complex policies with joins
- **Query plan changes** may occur with RLS enabled

### Optimization Tips

1. **Index foreign keys** used in RLS policies (userId, profileId, etc.)
2. **Monitor query performance** after enabling RLS
3. **Use connection pooling** to reduce context-setting overhead
4. **Consider policy complexity** - simpler policies perform better

## Production Deployment

### Environment Variables

Ensure these are set in production:

```bash
# Database connection with proper user role
DATABASE_URL="postgresql://app_user:password@localhost:5432/prod_db"

# Application environment
APP_ENV="production"
```

### Database User Permissions

Your application database user needs:

```sql
-- Grant execute permissions on RLS functions
GRANT EXECUTE ON FUNCTION auth.current_user_id() TO app_user;
GRANT EXECUTE ON FUNCTION auth.is_admin() TO app_user;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### Monitoring

Add RLS context logging in development:

```typescript
// In development, log RLS context for debugging
if (process.env.NODE_ENV === 'development') {
  const context = await getCurrentRLSContext();
  console.log('Current RLS context:', context);
}
```

## Troubleshooting

### Common Issues

1. **"Current user not set" errors**
   - Ensure `setRLSContext()` is called before database operations
   - Check that auth functions are properly installed

2. **Unexpected access denials**
   - Verify RLS policies match your application logic
   - Check user context is set correctly
   - Test policies individually

3. **Performance degradation**
   - Add indexes on columns used in RLS policies
   - Simplify complex policies
   - Monitor query execution plans

### Debugging RLS

```typescript
// Check if RLS is working
const testUser = 'user-id-here';
await setRLSContext(testUser);

// This should only return data accessible to testUser
const data = await prisma.contract.findMany();
console.log('Accessible contracts:', data.length);
```

## Migration Strategy

### Gradual Rollout

1. **Phase 1**: Deploy RLS migration (policies created but not enforced)
2. **Phase 2**: Add RLS context setting to actions (defense in depth)
3. **Phase 3**: Monitor and tune performance
4. **Phase 4**: Full RLS enforcement in production

### Testing Strategy

1. **Unit Tests**: Test individual RLS policies
2. **Integration Tests**: Test with real application flows
3. **Performance Tests**: Verify acceptable performance impact
4. **Security Tests**: Verify unauthorized access is prevented

## Benefits

- **Defense in Depth**: Multiple layers of security
- **Compliance**: Meet data isolation requirements
- **Security Auditing**: Database logs show access attempts
- **Peace of Mind**: Even if application has bugs, data is protected

This RLS implementation provides robust database-level security while maintaining the flexibility and performance of your existing application architecture.