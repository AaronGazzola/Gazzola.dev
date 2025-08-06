# RLS (Row Level Security) Test Steps

This document outlines all the steps in the RLS test and their expected outcomes based on the Row Level Security policies defined in the database migration.

## Test Phase 1: Admin User Testing

1. Visit RLS test page (success)
2. Enter admin email (success)
3. Enter admin password (success)
4. Click sign in button (success)
5. Verify admin sign in successful (success)
6. Admin attempts to insert new user (error)
7. Admin attempts to update user user (error)
8. Admin attempts to update admin user (error)
9. Admin attempts to delete user user (error)
10. Admin attempts to delete admin user (error)
11. Admin selects admin user (success)
12. Admin selects user user (success)
13. Admin deletes admin profile (success)
14. Admin inserts admin profile (success)
15. Admin deletes all user tasks (success)
16. Admin deletes all user messages (success)
17. Admin deletes all user conversations (success)
18. Admin deletes all user contracts (success)
19. Admin deletes user profile (success)
20. Admin inserts user conversation (success)
21. Admin inserts admin message (success)
22. Admin signs out (success)

## Test Phase 2: Regular User Testing

23. Enter user email (success)
24. Enter user password (success)
25. Click sign in button (success)
26. Verify user sign in successful (success)
27. User attempts to insert new user (error)
28. User attempts to update user user (error)
29. User attempts to update admin user (error)
30. User attempts to delete user user (error)
31. User attempts to delete admin user (error)
32. User attempts to select admin user (error)
33. User selects user user (success)
34. User inserts user profile (success)
35. User updates user profile (success)
36. User attempts to delete user profile (error)
37. User attempts to insert conversation (error)
38. User updates conversation (success)
39. User attempts to delete conversation (error)
40. User inserts message (success)
41. User attempts to update message (error)
42. User attempts to delete message (error)
43. User creates contract (success)
44. User inserts task for unpaid contract (success)
45. User updates task for unpaid contract (success)
46. User deletes task for unpaid contract (success)
47. User inserts task again for next steps (success)
48. User updates contract to set isPaid=true (success)
49. User attempts to update task on paid contract (error)
50. User attempts to delete task on paid contract (error)
51. User attempts to insert new task on paid contract (error)
52. User attempts to update paid contract (error)
53. User attempts to delete contract (error)

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
- **INSERT/DELETE**: Only admin can perform these operations

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