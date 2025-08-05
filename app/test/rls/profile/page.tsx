"use client";

import useIsTest from "@/app/(hooks)/useIsTest";
import { useAuthStore } from "@/app/(stores)/auth.store";
import {
  useDeleteAllData,
  useSignIn,
  useSignOut,
} from "@/app/test/rls/profile/page.hooks";
import configuration from "@/configuration";
import { DataCyAttributes } from "@/types/cypress.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RLSProfileTestPage() {
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

  // Profile-specific workflow steps
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
      name: "Check admin user exists",
      action: "select_admin_user",
      description: "Verify admin user row exists",
    },
    {
      id: 4,
      name: "Check regular user exists",
      action: "select_regular_user",
      description: "Verify regular user row exists",
    },
    {
      id: 5,
      name: "Try delete admin user",
      action: "delete_admin_user",
      description:
        "Admin should not be able to delete admin user (should fail)",
    },
    {
      id: 6,
      name: "Try delete regular user",
      action: "delete_regular_user",
      description:
        "Admin should not be able to delete regular user (should fail)",
    },
    {
      id: 7,
      name: "Check admin profile exists",
      action: "select_admin_profile",
      description: "Check if admin profile exists",
    },
    {
      id: 8,
      name: "Create admin profile",
      action: "create_admin_profile",
      description: "Admin creates own profile (should succeed)",
    },
    {
      id: 9,
      name: "Update admin profile",
      action: "update_admin_profile",
      description: "Admin updates own profile (should succeed)",
    },
    {
      id: 10,
      name: "Delete admin profile",
      action: "delete_admin_profile",
      description: "Admin deletes own profile (should succeed)",
    },
    {
      id: 11,
      name: "Create admin profile again",
      action: "create_admin_profile",
      description: "Recreate admin profile for further tests",
    },
    {
      id: 12,
      name: "Check regular user profile exists",
      action: "select_regular_user_profile",
      description: "Check if regular user profile exists",
    },
    {
      id: 13,
      name: "Create regular user profile",
      action: "create_regular_user_profile",
      description: "Admin creates regular user profile (should succeed)",
    },
    {
      id: 14,
      name: "Update regular user profile",
      action: "update_regular_user_profile",
      description: "Admin updates regular user profile (should succeed)",
    },
    {
      id: 15,
      name: "Delete regular user profile",
      action: "delete_regular_user_profile",
      description: "Admin deletes regular user profile (should succeed)",
    },
    {
      id: 16,
      name: "Create regular user profile again",
      action: "create_regular_user_profile",
      description: "Recreate regular user profile for user tests",
    },
    {
      id: 17,
      name: "Sign out",
      action: "sign_out",
      description: "Admin user signs out",
    },
    {
      id: 18,
      name: "Sign in as regular user",
      action: "sign_in_user",
      description: "Regular user signs in",
    },
    {
      id: 19,
      name: "Check own user record",
      action: "select_own_user",
      description:
        "User should be able to view own user record (should succeed)",
    },
    {
      id: 20,
      name: "Check admin user record",
      action: "select_admin_user",
      description:
        "User should not be able to view admin user record (should fail)",
    },
    {
      id: 21,
      name: "Try delete own user",
      action: "delete_own_user",
      description: "User should not be able to delete own user (should fail)",
    },
    {
      id: 22,
      name: "Try delete admin user",
      action: "delete_admin_user",
      description: "User should not be able to delete admin user (should fail)",
    },
    {
      id: 23,
      name: "Check own profile",
      action: "select_own_profile",
      description: "User should be able to view own profile (should succeed)",
    },
    {
      id: 24,
      name: "Check admin profile",
      action: "select_admin_profile",
      description:
        "User should not be able to view admin profile (should fail)",
    },
    {
      id: 25,
      name: "Update own profile",
      action: "update_own_profile",
      description: "User should be able to update own profile (should succeed)",
    },
    {
      id: 26,
      name: "Try update admin profile",
      action: "update_admin_profile",
      description:
        "User should not be able to update admin profile (should fail)",
    },
    {
      id: 27,
      name: "Try delete own profile",
      action: "delete_own_profile",
      description: "User should be able to delete own profile (should succeed)",
    },
    {
      id: 28,
      name: "Try delete admin profile",
      action: "delete_admin_profile",
      description:
        "User should not be able to delete admin profile (should fail)",
    },
    {
      id: 29,
      name: "Create own profile again",
      action: "create_own_profile",
      description: "User recreates own profile (should succeed)",
    },
    {
      id: 30,
      name: "Try create admin profile",
      action: "create_admin_profile",
      description:
        "User should not be able to create admin profile (should fail)",
    },
  ];

  const executeStep = async (stepId: number) => {
    const step = workflowSteps.find((s) => s.id === stepId);
    if (!step) return;

    try {
      switch (step.action) {
        case "sign_in_admin":
          await signInQuery.mutateAsync({
            email: email || "admin@example.com",
            password: password || "password",
          });
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
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        case "sign_out":
          await signOutQuery.mutateAsync();
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        case "delete_all_data":
          await deleteAllDataQuery.mutateAsync();
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { success: true },
          }));
          break;
        default:
          // Import and execute the specific workflow action
          const actions = await import("@/app/test/rls/profile/page.actions");
          const actionName = `${step.action.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}Action`;
          const actionFn = (actions as any)[actionName];

          if (actionFn) {
            const actionResult = await actionFn();
            const actionData = actionResult.data || actionResult;
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
    const stepExpectations: Record<
      number,
      { shouldSucceed: boolean; reason: string }
    > = {
      // Admin workflow (Steps 1-17)
      1: { shouldSucceed: true, reason: "Admin sign-in should work" },
      2: { shouldSucceed: true, reason: "Admin can delete all data" },
      3: { shouldSucceed: true, reason: "Admin can view admin user" },
      4: { shouldSucceed: true, reason: "Admin can view regular user" },
      5: { shouldSucceed: false, reason: "Users cannot be deleted" },
      6: { shouldSucceed: false, reason: "Users cannot be deleted" },
      7: { shouldSucceed: true, reason: "Admin can view profiles" },
      8: { shouldSucceed: true, reason: "Admin can create admin profile" },
      9: { shouldSucceed: true, reason: "Admin can update admin profile" },
      10: { shouldSucceed: true, reason: "Admin can delete admin profile" },
      11: { shouldSucceed: true, reason: "Admin can create admin profile" },
      12: { shouldSucceed: true, reason: "Admin can view profiles" },
      13: { shouldSucceed: true, reason: "Admin can create user profile" },
      14: { shouldSucceed: true, reason: "Admin can update user profile" },
      15: { shouldSucceed: true, reason: "Admin can delete user profile" },
      16: { shouldSucceed: true, reason: "Admin can create user profile" },
      17: { shouldSucceed: true, reason: "Admin sign-out should work" },

      // Regular user workflow (Steps 18-30)
      18: { shouldSucceed: true, reason: "User sign-in should work" },
      19: { shouldSucceed: true, reason: "Users can view own user record" },
      20: { shouldSucceed: false, reason: "Users cannot view admin user" },
      21: { shouldSucceed: false, reason: "Users cannot delete users" },
      22: { shouldSucceed: false, reason: "Users cannot delete users" },
      23: { shouldSucceed: true, reason: "Users can view own profile" },
      24: { shouldSucceed: false, reason: "Users cannot view admin profile" },
      25: { shouldSucceed: true, reason: "Users can update own profile" },
      26: { shouldSucceed: false, reason: "Users cannot update admin profile" },
      27: { shouldSucceed: true, reason: "Users can delete own profile" },
      28: { shouldSucceed: false, reason: "Users cannot delete admin profile" },
      29: { shouldSucceed: true, reason: "Users can create own profile" },
      30: { shouldSucceed: false, reason: "Users cannot create admin profile" },
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
            RLS Profile Policy Test
          </h1>
          <p className="text-white">
            Testing Row Level Security policies for User and Profile tables.
            Current user role: <strong>{user?.role || "Not signed in"}</strong>
          </p>
        </div>

        {/* Step-by-Step Workflow */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Step-by-Step Profile RLS Workflow
          </h2>
          <p className="text-white mb-4">
            Execute each step to test User and Profile RLS policies
            systematically. Each step shows &quot;Expected Feature&quot; when
            RLS works correctly.
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
                    data-cy={`rls-profile-step-${step.id}-button`}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Execute
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                <div data-cy={`rls-profile-step-${step.id}-result`}>
                  {getStepResultDisplay(step.id)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Authentication Controls */}
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
                  data-cy={DataCyAttributes.RLS_PROFILE_EMAIL_INPUT}
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
                  data-cy={DataCyAttributes.RLS_PROFILE_PASSWORD_INPUT}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleSignIn}
                disabled={signInQuery.isPending}
                data-cy={DataCyAttributes.RLS_PROFILE_SIGN_IN_BUTTON}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {signInQuery.isPending ? "Loading..." : "Sign In"}
              </button>
              <button
                onClick={handleSignOut}
                disabled={signOutQuery.isPending}
                data-cy={DataCyAttributes.RLS_PROFILE_SIGN_OUT_BUTTON}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {signOutQuery.isPending ? "Loading..." : "Sign Out"}
              </button>
              <button
                onClick={handleDeleteAllData}
                disabled={deleteAllDataQuery.isPending}
                data-cy={DataCyAttributes.RLS_PROFILE_DELETE_ALL_DATA_BUTTON}
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
