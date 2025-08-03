# RLS Step-by-Step Test Workflow

All steps show "Expected Feature" when RLS policies work correctly - whether the operation succeeds or fails according to the defined security rules.

## Admin User Flow (Steps 1-30)

1. Sign in as Admin
2. Delete all data (clean slate)
3. Create admin profile with placeholder data
4. Create user profile with placeholder data
5. Select admin profile (view/read admin profile)
6. Select user profile (view/read user profile)
7. Edit admin profile (update admin profile)
8. Edit user profile (update user profile)
9. Add contract for user (create contract related to regular user)
10. Select that contract (view/read the contract)
11. Add task to contract (add task to the contract)
12. Select that task (view/read the task)
13. Update that task (update the task - first time)
14. Update contract to isPaid (mark contract as paid)
15. Update the task (update task - second time)
16. Delete the task
17. Update the contract (update contract - second time)
18. Delete the contract
19. Create conversation for user (create conversation related to regular user)
20. Add message to conversation
21. Update that message
22. Delete that message
23. Delete that conversation
24. Delete the user profile
25. Delete the admin profile
26. Insert admin profile (create admin profile - second time)
27. Insert user profile (create user profile - second time)
28. Insert contract (create contract - second time)
29. Insert conversation (create conversation - second time)
30. Insert admin message to conversation
31. Sign out

## Regular User Flow (Steps 32-61)

**Note:** All steps show "Expected Feature" because RLS blocking unauthorized operations is the expected security behavior.

32. Sign in as regular user
33. Create admin profile → **RLS blocks** (users can't create admin profiles) → Expected Feature
34. Create user profile → **RLS allows** (users can create their own profile) → Expected Feature
35. Select admin profile → **RLS blocks** (users can't view other profiles) → Expected Feature
36. Select user profile → **RLS allows** (users can view their own profile) → Expected Feature
37. Edit admin profile → **RLS blocks** (users can't edit other profiles) → Expected Feature
38. Edit user profile → **RLS allows** (users can edit their own profile) → Expected Feature
39. Add contract for user → **RLS allows** (users can create contracts for themselves) → Expected Feature
40. Select that contract → **RLS allows** (users can view their contracts) → Expected Feature
41. Add task to contract → **RLS allows** (users can add tasks to their contracts) → Expected Feature
42. Select that task → **RLS allows** (users can view tasks on their contracts) → Expected Feature
43. Update that task → **RLS allows** (users can update tasks on their contracts) → Expected Feature
44. Update contract to isPaid → **RLS allows** (users can update unpaid contracts) → Expected Feature
45. Update the task (2nd time) → **RLS allows** (users can update tasks) → Expected Feature
46. Delete the task → **RLS blocks** (only admins can delete tasks) → Expected Feature
47. Update the contract (2nd time) → **RLS blocks** (users can't update paid contracts) → Expected Feature
48. Delete the contract → **RLS blocks** (only admins can delete contracts) → Expected Feature
49. Create conversation → **RLS blocks** (only admins can create conversations) → Expected Feature
50. Add message to conversation → **RLS blocks** (no conversation exists/not participant) → Expected Feature
51. Update that message → **RLS blocks** (no message exists) → Expected Feature
52. Delete that message → **RLS blocks** (no message exists) → Expected Feature
53. Try to select admin message → **RLS blocks** (users can't view admin messages) → Expected Feature
54. Try to edit admin message → **RLS blocks** (users can't edit admin messages) → Expected Feature
55. Try to delete admin message → **RLS blocks** (users can't delete admin messages) → Expected Feature
56. Delete that conversation → **RLS blocks** (only admins can delete conversations) → Expected Feature
57. Delete the user profile → **RLS blocks** (profile deletion should be restricted) → Expected Feature
58. Delete the admin profile → **RLS blocks** (users can't delete other profiles) → Expected Feature
59. Insert user profile (2nd time) → **RLS allows** (users can create their own profile) → Expected Feature
60. Insert contract (2nd time) → **RLS allows** (users can create contracts for themselves) → Expected Feature
61. Insert conversation (2nd time) → **RLS blocks** (only admins can create conversations) → Expected Feature
