# RLS (Row Level Security) Test Steps

This document outlines all the steps in the RLS test and their expected outcomes based on the Row Level Security policies defined in the database migration.

## Test Phase 1: Admin User Testing

1. Visit RLS test page (success)
2. Enter admin email (success)
3. Enter admin password (success)
4. Click sign in button (success)
5. Verify admin sign in successful (success)
6. Admin attempts to insert new user (error - no INSERT policy on user table)
7. Admin attempts to update user user (error - no UPDATE policy on user table)
8. Admin attempts to update admin user (error - no UPDATE policy on user table)
9. Admin attempts to delete user user (error - no DELETE policy on user table)
10. Admin attempts to delete admin user (error - no DELETE policy on user table)
11. Admin selects admin user (success)
12. Admin selects user user (success)
13. Admin selects other user (success - admin can see all users)
14. Admin deletes admin profile (success)
15. Admin inserts admin profile (success)
16. Admin deletes all user tasks (success)
17. Admin deletes all user messages (success)
18. Admin deletes all user conversations (success)
19. Admin deletes all user contracts (success)
20. Admin deletes user profile (success)
21. Admin signs out (success)

## Test Phase 2: Regular User Testing

22. Enter user email (success)
23. Enter user password (success)
24. Click sign in button (success)
25. Verify user sign in successful (success)
26. User attempts to insert new user (error - no INSERT policy on user table)
27. User attempts to update user user (error - no UPDATE policy on user table)
28. User attempts to update admin user (error - no UPDATE policy on user table)
29. User attempts to delete user user (error - no DELETE policy on user table)
30. User attempts to delete admin user (error - no DELETE policy on user table)
31. User selects admin user (success - users can select admin user id)
32. User selects user user (success - selecting own user)
33. User attempts to select other user (error - user can only select own user)
34. User inserts user profile (success - creating own profile)
35. User updates user profile (success - updating own profile)
36. User attempts to delete user profile (error - only admin can delete profiles)
37. User attempts to insert conversation (success)
38. User attempts to insert conversation (error - users can only insert the initial conversation)
39. User updates conversation (success - user can update conversations they participate in)
40. User attempts to delete conversation (error - only admin can delete conversations)
41. User inserts message (success - user can insert messages in conversations they participate in)
42. User attempts to update message (error - only admin can update messages)
43. User attempts to delete message (error - only admin can delete messages)
44. User creates contract (success - user can create contract for own profile)
45. User inserts task (success - user can insert task for own contract when unpaid)
46. User updates task (success - user can update task for own contract when unpaid)
47. User deletes task (success - user can delete task for own contract when unpaid)
48. User inserts task again (success - to have a task for next steps)
49. User updates contract (success - this sets isPaid to true)
50. User pays contract using secure payment processing (success)
51. User attempts to update task (error - users can't mutate tasks when contract isPaid=true)
52. User attempts to delete task (error - users can't mutate tasks when contract isPaid=true)
53. User attempts to insert new task on paid contract (error - users can't insert tasks when contract isPaid=true)
54. User attempts to update paid contract (error - user cannot update paid contract)
55. User attempts to delete contract (error - only admin can delete contracts)

## RLS Policy Summary

The test validates the following Row Level Security policies:

### User Table

- **SELECT**: Admin can select all users, regular users can only select themselves
- **INSERT/UPDATE/DELETE**: No policies defined, so all operations fail for both admin and users

### Profile Table

- **SELECT/INSERT/UPDATE**: Users can access their own profiles, admin can access all
- **DELETE**: Only admin can delete profiles

### Conversation Table

- **SELECT/UPDATE**: Participants and admin can access
- **INSERT**: Users can insert their first conversation (if they don't already have one), admin can insert any conversation
- **DELETE**: Only admin can perform these operations

### Message Table

- **SELECT/INSERT**: Conversation participants and admin can perform these
- **UPDATE/DELETE**: Only admin can perform these operations

### Contract Table

- **SELECT/INSERT**: Users can access their own contracts, admin can access all
- **UPDATE**: Users can update their own unpaid contracts, admin can update all
- **DELETE**: Only admin can delete contracts

### Task Table

- **SELECT**: Users can access tasks for their own contracts, admin can access all
- **INSERT/UPDATE/DELETE**: Users can modify tasks for their own unpaid contracts, admin can modify all
- **Paid Contract Restriction**: Users cannot modify tasks when contract isPaid=true
