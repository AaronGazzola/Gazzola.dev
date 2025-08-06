# RLS Policies

## Helper Functions
- `current_user_id()` - Returns current user ID from session variable `app.current_user_id`
- `is_admin()` - Returns true if current user has role 'admin'

## Table Policies

### User
- **SELECT**: Own user or admin (`id = current_user_id() OR is_admin()`)

### Profile
- **SELECT**: Related user or admin (`userId = current_user_id() OR is_admin()`)
- **INSERT**: Related user or admin (`userId = current_user_id() OR is_admin()`)
- **UPDATE**: Related user or admin (`userId = current_user_id() OR is_admin()`)
- **DELETE**: Admin only (`is_admin()`)

### Conversation
- **SELECT**: Participant or admin (`current_user_id() = ANY(participants) OR is_admin()`)
- **UPDATE**: Participant or admin (`current_user_id() = ANY(participants) OR is_admin()`)
- **INSERT**: Admin only (`is_admin()`)
- **DELETE**: Admin only (`is_admin()`)

### Message
- **SELECT**: Conversation participant or admin (via conversation.participants)
- **INSERT**: Conversation participant or admin (via conversation.participants)
- **UPDATE**: Admin only (`is_admin()`)
- **DELETE**: Admin only (`is_admin()`)

### Contract
- **SELECT**: Admin or related to user's profile (`profile.userId = current_user_id()`)
- **INSERT**: Admin or own profile (`profile.userId = current_user_id()`)
- **UPDATE**: Admin or (own profile and `isPaid = false`)
- **DELETE**: Admin only (`is_admin()`)

### Task
- **SELECT**: Admin or related to user's contract (via contract.profileId → profile.userId)
- **INSERT**: Admin or (related to user's contract and contract `isPaid = false`)
- **UPDATE**: Admin or (related to user's contract and contract `isPaid = false`)
- **DELETE**: Admin or (related to user's contract and contract `isPaid = false`)

## Excluded Tables
- **Payment**: System-level access only (Stripe integration)
- **Auth tables** (session, account, verification): No RLS policies