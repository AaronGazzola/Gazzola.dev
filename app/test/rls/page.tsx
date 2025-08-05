"use client";

import useIsTest from "@/app/(hooks)/useIsTest";
import { useAuthStore } from "@/app/(stores)/auth.store";
import {
  useDeleteAllData,
  useSignIn,
  useSignOut,
} from "@/app/test/rls/page.hooks";
import configuration from "@/configuration";
import { DataCyAttributes } from "@/types/cypress.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RLSTestPage() {
  const { user, isAdmin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isTest = useIsTest();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<
    Record<number, { success: boolean; error?: string }>
  >({});

  const signInQuery = useSignIn();
  const signOutQuery = useSignOut();
  const deleteAllDataQuery = useDeleteAllData();

  // Redirect to home if not in test environment
  useEffect(() => {
    if (!isMounted) return setIsMounted(true);
    if (!isTest) {
      router.push(configuration.paths.home);
    }
  }, [isTest, router, isMounted]);

  // Don't render anything if not in test environment
  if (!isTest) {
    return null;
  }

  const handleSignIn = () => {
    if (!email || !password) {
      return;
    }

    signInQuery.mutate({ email, password });
  };

  const handleSignOut = () => {
    signOutQuery.mutate();
  };

  const handleDeleteAllData = () => {
    deleteAllDataQuery.mutate();
  };

  // Step-by-Step Workflow Configuration
  const workflowSteps = [
    {
      id: 1,
      name: "Sign in as Admin",
      action: "sign_in_admin",
      description: "Admin user signs in",
    },
    {
      id: 2,
      name: "Delete all data",
      action: "delete_all_data",
      description: "Clean slate for testing",
    },
    {
      id: 3,
      name: "Create admin profile",
      action: "create_admin_profile",
      description: "Create admin profile with placeholder data",
    },
    {
      id: 4,
      name: "Create user profile",
      action: "create_user_profile",
      description: "Create regular user profile with placeholder data",
    },
    {
      id: 5,
      name: "Select admin profile",
      action: "select_admin_profile",
      description: "View/read admin profile",
    },
    {
      id: 6,
      name: "Select user profile",
      action: "select_user_profile",
      description: "View/read user profile",
    },
    {
      id: 7,
      name: "Edit admin profile",
      action: "edit_admin_profile",
      description: "Update admin profile",
    },
    {
      id: 8,
      name: "Edit user profile",
      action: "edit_user_profile",
      description: "Update user profile",
    },
    {
      id: 9,
      name: "Add contract for user",
      action: "create_contract_for_user",
      description: "Create contract related to regular user",
    },
    {
      id: 10,
      name: "Select that contract",
      action: "select_contract",
      description: "View/read the contract",
    },
    {
      id: 11,
      name: "Add task to contract",
      action: "add_task_to_contract",
      description: "Add task to the contract",
    },
    {
      id: 12,
      name: "Select that task",
      action: "select_task",
      description: "View/read the task",
    },
    {
      id: 13,
      name: "Update that task",
      action: "update_task_first_time",
      description: "Update the task (first time)",
    },
    {
      id: 14,
      name: "Update contract to isPaid",
      action: "update_contract_to_paid",
      description: "Mark contract as paid",
    },
    {
      id: 15,
      name: "Update the task (2nd time)",
      action: "update_task_second_time",
      description: "Update task (second time)",
    },
    {
      id: 16,
      name: "Delete the task",
      action: "delete_task",
      description: "Delete the task",
    },
    {
      id: 17,
      name: "Update the contract (2nd time)",
      action: "update_contract_second_time",
      description: "Update contract (second time)",
    },
    {
      id: 18,
      name: "Delete the contract",
      action: "delete_contract",
      description: "Delete the contract",
    },
    {
      id: 19,
      name: "Create conversation for user",
      action: "create_conversation_for_user",
      description: "Create conversation related to regular user",
    },
    {
      id: 20,
      name: "Add message to conversation",
      action: "add_message_to_conversation",
      description: "Add message to conversation",
    },
    {
      id: 21,
      name: "Update that message",
      action: "update_message",
      description: "Update the message",
    },
    {
      id: 22,
      name: "Delete that message",
      action: "delete_message",
      description: "Delete the message",
    },
    {
      id: 23,
      name: "Delete that conversation",
      action: "delete_conversation",
      description: "Delete the conversation",
    },
    {
      id: 24,
      name: "Delete the user profile",
      action: "delete_user_profile",
      description: "Delete user profile",
    },
    {
      id: 25,
      name: "Delete the admin profile",
      action: "delete_admin_profile",
      description: "Delete admin profile",
    },
    {
      id: 26,
      name: "Insert admin profile (2nd time)",
      action: "create_admin_profile",
      description: "Create admin profile (second time)",
    },

    {
      id: 27,
      name: "Insert conversation (2nd time)",
      action: "create_conversation_for_user",
      description: "Create conversation (second time)",
    },
    {
      id: 28,
      name: "Insert admin message to conversation",
      action: "insert_admin_message_to_conversation",
      description: "Add admin message to conversation",
    },
    {
      id: 29,
      name: "Sign out",
      action: "sign_out",
      description: "Admin user signs out",
    },
    {
      id: 30,
      name: "Sign in as regular user",
      action: "sign_in_user",
      description: "Regular user signs in",
    },
    {
      id: 31,
      name: "Create admin profile",
      action: "create_admin_profile",
      description: "Try to create admin profile (should fail)",
    },
    {
      id: 32,
      name: "Create user profile",
      action: "create_user_profile",
      description: "Create own profile (should succeed)",
    },
    {
      id: 33,
      name: "Select admin profile",
      action: "select_admin_profile",
      description: "Try to view admin profile (should fail)",
    },
    {
      id: 34,
      name: "Select user profile",
      action: "select_user_profile",
      description: "View own profile (should succeed)",
    },
    {
      id: 35,
      name: "Edit admin profile",
      action: "edit_admin_profile",
      description: "Try to edit admin profile (should fail)",
    },
    {
      id: 36,
      name: "Edit user profile",
      action: "edit_user_profile",
      description: "Edit own profile (should succeed)",
    },
    {
      id: 37,
      name: "Add contract for user",
      action: "create_contract_for_user",
      description: "Create contract for self (should succeed)",
    },
    {
      id: 38,
      name: "Select that contract",
      action: "select_contract",
      description: "View own contract (should succeed)",
    },
    {
      id: 39,
      name: "Add task to contract",
      action: "add_task_to_contract",
      description: "Add task to own contract (should succeed)",
    },
    {
      id: 40,
      name: "Select that task",
      action: "select_task",
      description: "View task on own contract (should succeed)",
    },
    {
      id: 41,
      name: "Update that task",
      action: "update_task_first_time",
      description: "Update task on own contract (should succeed)",
    },
    {
      id: 42,
      name: "Update contract to isPaid",
      action: "update_contract_to_paid",
      description: "Update unpaid contract (should succeed)",
    },
    {
      id: 43,
      name: "Update the task (2nd time)",
      action: "update_task_second_time",
      description: "Update task (should succeed)",
    },
    {
      id: 44,
      name: "Delete the task",
      action: "delete_task",
      description: "Try to delete task (should fail - admin only)",
    },
    {
      id: 45,
      name: "Update the contract (2nd time)",
      action: "update_contract_second_time",
      description: "Try to update paid contract (should fail)",
    },
    {
      id: 46,
      name: "Delete the contract",
      action: "delete_contract",
      description: "Try to delete contract (should fail - admin only)",
    },
    {
      id: 47,
      name: "Create conversation",
      action: "create_conversation_for_user",
      description: "Try to create conversation (should fail - admin only)",
    },
    {
      id: 48,
      name: "Add message to conversation",
      action: "add_message_to_conversation",
      description: "Try to add message (should fail - no conversation)",
    },
    {
      id: 49,
      name: "Update that message",
      action: "update_message",
      description: "Try to update message (should fail - no message)",
    },
    {
      id: 50,
      name: "Delete that message",
      action: "delete_message",
      description: "Try to delete message (should fail - no message)",
    },
    {
      id: 51,
      name: "Try to select admin message",
      action: "try_select_admin_message",
      description: "Try to view admin message (should fail)",
    },
    {
      id: 52,
      name: "Try to edit admin message",
      action: "try_edit_admin_message",
      description: "Try to edit admin message (should fail)",
    },
    {
      id: 53,
      name: "Try to delete admin message",
      action: "try_delete_admin_message",
      description: "Try to delete admin message (should fail)",
    },
    {
      id: 54,
      name: "Delete that conversation",
      action: "delete_conversation",
      description: "Try to delete conversation (should fail - admin only)",
    },
    {
      id: 55,
      name: "Delete the user profile",
      action: "delete_user_profile",
      description: "Try to delete profile (should be restricted)",
    },
    {
      id: 56,
      name: "Delete the admin profile",
      action: "delete_admin_profile",
      description: "Try to delete admin profile (should fail)",
    },
    {
      id: 57,
      name: "Insert user profile (2nd time)",
      action: "create_user_profile",
      description: "Create own profile (should succeed)",
    },
    {
      id: 58,
      name: "Insert contract (2nd time)",
      action: "create_contract_for_user",
      description: "Create contract for self (should succeed)",
    },
    {
      id: 59,
      name: "Insert conversation (2nd time)",
      action: "create_conversation_for_user",
      description: "Try to create conversation (should fail - admin only)",
    },
  ];

  const executeStep = async (stepId: number) => {
    const step = workflowSteps.find((s) => s.id === stepId);
    if (!step) return;

    try {
      switch (step.action) {
        case "sign_in_admin":
          // Note: These values should be filled in by the test environment
          await signInQuery.mutateAsync({
            email: email || "admin@example.com",
            password: password || "password",
          });
          // Auth functions return user data, so we consider success if we get data
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        case "sign_in_user":
          await signInQuery.mutateAsync({
            email: email || "user@example.com",
            password: password || "password",
          });
          // Auth functions return user data, so we consider success if we get data
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        case "sign_out":
          await signOutQuery.mutateAsync();
          // Sign out is successful if no error is thrown
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        case "delete_all_data":
          await deleteAllDataQuery.mutateAsync();
          // Delete all data is successful if no error is thrown
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        default:
          // Import and execute the specific workflow action
          const actions = await import("@/app/test/rls/page.actions");
          const actionName = `${step.action.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}Action`;
          const actionFn = (actions as any)[actionName];

          if (actionFn) {
            const actionResult = await actionFn();
            const actionData = actionResult.data || actionResult;
            // For RLS test actions, use the actual result from the action function
            setStepResults((prev) => ({
              ...prev,
              [stepId]: actionData || { success: true },
            }));
          } else {
            throw new Error(`Action ${actionName} not found`);
          }
          break;
      }
    } catch (error) {
      setStepResults((prev) => ({
        ...prev,
        [stepId]: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      }));
    }
  };

  // Step expectations mapping based on RLS policies and step context
  const getStepExpectation = (stepId: number, _userRole: string | null) => {
    // Complete step expectations mapping
    const stepExpectations: Record<
      number,
      { shouldSucceed: boolean; reason: string }
    > = {
      // Admin workflow (Steps 1-29) - all should succeed
      1: { shouldSucceed: true, reason: "Admin sign-in should work" },
      2: { shouldSucceed: true, reason: "Admin can delete all data" },
      3: { shouldSucceed: true, reason: "Admin can create admin profiles" },
      4: { shouldSucceed: true, reason: "Admin can create user profiles" },
      5: { shouldSucceed: true, reason: "Admin can view admin profiles" },
      6: { shouldSucceed: true, reason: "Admin can view user profiles" },
      7: { shouldSucceed: true, reason: "Admin can edit admin profiles" },
      8: { shouldSucceed: true, reason: "Admin can edit user profiles" },
      9: {
        shouldSucceed: true,
        reason: "Admin can create contracts for users",
      },
      10: { shouldSucceed: true, reason: "Admin can view contracts" },
      11: { shouldSucceed: true, reason: "Admin can add tasks to contracts" },
      12: { shouldSucceed: true, reason: "Admin can view tasks" },
      13: { shouldSucceed: true, reason: "Admin can update tasks" },
      14: { shouldSucceed: true, reason: "Admin can update contracts to paid" },
      15: { shouldSucceed: true, reason: "Admin can update tasks" },
      16: { shouldSucceed: true, reason: "Admin can delete tasks" },
      17: { shouldSucceed: true, reason: "Admin can update contracts" },
      18: { shouldSucceed: true, reason: "Admin can delete contracts" },
      19: { shouldSucceed: true, reason: "Admin can create conversations" },
      20: {
        shouldSucceed: true,
        reason: "Admin can add messages to conversations",
      },
      21: { shouldSucceed: true, reason: "Admin can update messages" },
      22: { shouldSucceed: true, reason: "Admin can delete messages" },
      23: { shouldSucceed: true, reason: "Admin can delete conversations" },
      24: { shouldSucceed: true, reason: "Admin can delete user profiles" },
      25: { shouldSucceed: true, reason: "Admin can delete admin profiles" },
      26: { shouldSucceed: true, reason: "Admin can create admin profiles" },
      27: { shouldSucceed: true, reason: "Admin can create conversations" },
      28: {
        shouldSucceed: true,
        reason: "Admin can add messages to conversations",
      },
      29: { shouldSucceed: true, reason: "Admin sign-out should work" },

      // Regular user workflow (Steps 30-59)
      30: { shouldSucceed: true, reason: "User sign-in should work" },
      31: {
        shouldSucceed: false,
        reason: "Users cannot create admin profiles",
      },
      32: { shouldSucceed: true, reason: "Users can create their own profile" },
      33: { shouldSucceed: false, reason: "Users cannot view admin profiles" },
      34: { shouldSucceed: true, reason: "Users can view their own profile" },
      35: { shouldSucceed: false, reason: "Users cannot edit admin profiles" },
      36: { shouldSucceed: true, reason: "Users can edit their own profile" },
      37: {
        shouldSucceed: true,
        reason: "Users can create contracts for themselves",
      },
      38: { shouldSucceed: true, reason: "Users can view their own contracts" },
      39: {
        shouldSucceed: true,
        reason: "Users can add tasks to their contracts",
      },
      40: {
        shouldSucceed: true,
        reason: "Users can view tasks on their contracts",
      },
      41: {
        shouldSucceed: true,
        reason: "Users can update tasks on their contracts",
      },
      42: { shouldSucceed: true, reason: "Users can update unpaid contracts" },
      43: { shouldSucceed: true, reason: "Users can update tasks" },
      44: { shouldSucceed: false, reason: "Only admins can delete tasks" },
      45: {
        shouldSucceed: false,
        reason: "Users cannot update paid contracts",
      },
      46: { shouldSucceed: false, reason: "Only admins can delete contracts" },
      47: {
        shouldSucceed: false,
        reason: "Only admins can create conversations",
      },
      48: {
        shouldSucceed: false,
        reason: "No conversation exists/not participant",
      },
      49: { shouldSucceed: false, reason: "No message exists" },
      50: { shouldSucceed: false, reason: "No message exists" },
      51: { shouldSucceed: false, reason: "Users cannot view admin messages" },
      52: { shouldSucceed: false, reason: "Users cannot edit admin messages" },
      53: {
        shouldSucceed: false,
        reason: "Users cannot delete admin messages",
      },
      54: {
        shouldSucceed: false,
        reason: "Only admins can delete conversations",
      },
      55: {
        shouldSucceed: false,
        reason: "Profile deletion should be restricted",
      },
      56: {
        shouldSucceed: false,
        reason: "Users cannot delete admin profiles",
      },
      57: { shouldSucceed: true, reason: "Users can create their own profile" },
      58: {
        shouldSucceed: true,
        reason: "Users can create contracts for themselves",
      },
      59: {
        shouldSucceed: false,
        reason: "Only admins can create conversations",
      },
    };

    return (
      stepExpectations[stepId] || {
        shouldSucceed: false,
        reason: "Unknown step",
      }
    );
  };

  // Helper function to determine badge display based on expected vs actual results
  const getStepResultDisplay = (stepId: number) => {
    const result = stepResults[stepId];
    if (!result) {
      return (
        <div className="border rounded p-2 bg-black border-gray-500 relative">
          <div className="flex items-center justify-center">
            <span className="text-gray-400">No result</span>
          </div>
        </div>
      );
    }

    // Get expected behavior for this step
    const expectation = getStepExpectation(stepId, user?.role || null);
    const actualSuccess = result.success;
    const expectedSuccess = expectation.shouldSucceed;

    // Determine if the result matches expectations
    const isExpectedBehavior = actualSuccess === expectedSuccess;

    let bgColor: string;
    let textColor: string;
    let badgeColor: string;
    let badgeText: string;
    let badgeDataCy: DataCyAttributes;
    let statusText: string;

    if (isExpectedBehavior) {
      // Expected behavior - show green "Expected Feature" badge
      bgColor = "bg-black border-green-500";
      textColor = "text-green-400";
      badgeColor = "bg-green-500";
      badgeText = "expected feature";
      badgeDataCy = DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE;
      statusText = actualSuccess ? "✓ Success" : "✗ Blocked (Expected)";
    } else {
      // Unexpected behavior - show red "Unexpected Bug" badge
      bgColor = "bg-black border-red-500";
      textColor = "text-red-400";
      badgeColor = "bg-red-500";
      badgeText = "unexpected bug";
      badgeDataCy = DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE;
      statusText = actualSuccess
        ? "✓ Unexpected Success"
        : "✗ Unexpected Failure";
    }

    return (
      <div className={`border rounded p-2 ${bgColor} relative`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className={textColor}>
              {statusText}
              {result.error && ` - ${result.error}`}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              {expectation.reason}
            </div>
          </div>
          <span
            className={`inline-block px-2 py-1 text-xs text-white rounded-full ${badgeColor} whitespace-nowrap`}
            data-cy={badgeDataCy}
          >
            {badgeText}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 bg-black min-h-screen">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            RLS Policy Step-by-Step Test
          </h1>
          <p className="text-white">
            Testing Row Level Security policies systematically. Current user
            role: <strong>{user?.role || "Not signed in"}</strong>
          </p>
        </div>

        {/* Step-by-Step Workflow */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Step-by-Step RLS Workflow
          </h2>
          <p className="text-white mb-4">
            Execute each step to test RLS policies systematically. Each step
            shows &quot;Expected Feature&quot; when RLS works correctly.
          </p>

          <div className="grid gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">
                    {step.id}. {step.name}
                  </h3>
                  <button
                    onClick={() => executeStep(step.id)}
                    disabled={
                      signInQuery.isPending ||
                      signOutQuery.isPending ||
                      deleteAllDataQuery.isPending
                    }
                    data-cy={`rls-step-${step.id}-button`}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Execute
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                <div data-cy={`rls-step-${step.id}-result`}>
                  {getStepResultDisplay(step.id)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legacy Authentication Controls - Simplified */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Manual Authentication Controls (Optional)
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-cy={DataCyAttributes.RLS_EMAIL_INPUT}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-cy={DataCyAttributes.RLS_PASSWORD_INPUT}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleSignIn}
                disabled={signInQuery.isPending}
                data-cy={DataCyAttributes.RLS_SIGN_IN_BUTTON}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {signInQuery.isPending ? "Loading..." : "Sign In"}
              </button>
              <button
                onClick={handleSignOut}
                disabled={signOutQuery.isPending}
                data-cy={DataCyAttributes.RLS_SIGN_OUT_BUTTON}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {signOutQuery.isPending ? "Loading..." : "Sign Out"}
              </button>
              <button
                onClick={handleDeleteAllData}
                disabled={deleteAllDataQuery.isPending}
                data-cy={DataCyAttributes.RLS_DELETE_ALL_DATA_BUTTON}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {deleteAllDataQuery.isPending
                  ? "Loading..."
                  : "Delete All Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
