"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useRLSTests } from "@/app/test/rls/page.hooks";
import { RLSTestAction } from "@/app/test/rls/page.types";
import { DataCyAttributes } from "@/types/cypress.types";
import { useEffect, useRef } from "react";

export default function RLSTestPage() {
  const { state, runAllTests } = useRLSTests();
  const { user, isAdmin } = useAuthStore();
  const hasRunTests = useRef(false);

  useEffect(() => {
    if (user?.role && !hasRunTests.current) {
      hasRunTests.current = true;
      runAllTests(user.role);
    }
  }, [user?.role, runAllTests]);

  if (state.error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-black border border-white rounded-md p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Test Error</h2>
          <p className="text-white" data-cy={DataCyAttributes.RLS_TEST_RESULT}>
            {state.error}
          </p>
        </div>
      </div>
    );
  }

  const getResultDisplay = (
    actionName: RLSTestAction,
    expectSuccess: boolean
  ) => {
    const result = state.results[actionName];

    if (!result) {
      return (
        <div className="border rounded p-2 bg-black border-gray-500 relative">
          <div className="flex items-center justify-center">
            <span className="text-gray-400">No result</span>
          </div>
        </div>
      );
    }

    const isExpected = result.success === expectSuccess;
    const bgColor = isExpected
      ? "bg-black border-green-500"
      : "bg-black border-red-500";
    const textColor = isExpected ? "text-green-400" : "text-red-400";
    const badgeColor = isExpected ? "bg-green-500" : "bg-red-500";
    const badgeText = isExpected ? "expected feature" : "unexpected bug";
    const badgeDataCy = isExpected
      ? DataCyAttributes.RLS_EXPECTED_FEATURE_BADGE
      : DataCyAttributes.RLS_UNEXPECTED_BUG_BADGE;

    return (
      <div className={`border rounded p-2 ${bgColor} relative`}>
        <div className="flex items-start justify-between gap-2">
          <span className={textColor}>
            {result.success ? "✓ Success" : "✗ Failed"}
            {result.count !== undefined && ` (${result.count} records)`}
            {result.error && ` - ${result.error}`}
          </span>
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
            RLS Policy Test Results
          </h1>
          <p className="text-white">
            Testing Row Level Security policies for user role:{" "}
            <strong>{user?.role || state.userRole}</strong>
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Profile Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PROFILE_SELECT}>
                  {getResultDisplay("profile_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PROFILE_INSERT}>
                  {getResultDisplay("profile_insert", isAdmin)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PROFILE_UPDATE}>
                  {getResultDisplay("profile_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PROFILE_DELETE}>
                  {getResultDisplay("profile_delete", false)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Contract Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONTRACT_SELECT}>
                  {getResultDisplay("contract_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONTRACT_INSERT}>
                  {getResultDisplay("contract_insert", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONTRACT_UPDATE}>
                  {getResultDisplay("contract_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONTRACT_DELETE}>
                  {getResultDisplay("contract_delete", false)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Task Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_TASK_SELECT}>
                  {getResultDisplay("task_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_TASK_INSERT}>
                  {getResultDisplay("task_insert", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_TASK_UPDATE}>
                  {getResultDisplay("task_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_TASK_DELETE}>
                  {getResultDisplay("task_delete", false)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Conversation Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONVERSATION_SELECT}>
                  {getResultDisplay("conversation_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONVERSATION_INSERT}>
                  {getResultDisplay("conversation_insert", false)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONVERSATION_UPDATE}>
                  {getResultDisplay("conversation_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_CONVERSATION_DELETE}>
                  {getResultDisplay("conversation_delete", false)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Message Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_MESSAGE_SELECT}>
                  {getResultDisplay("message_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_MESSAGE_INSERT}>
                  {getResultDisplay("message_insert", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_MESSAGE_UPDATE}>
                  {getResultDisplay("message_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_MESSAGE_DELETE}>
                  {getResultDisplay("message_delete", true)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              File Upload Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_FILE_UPLOAD_SELECT}>
                  {getResultDisplay("file_upload_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_FILE_UPLOAD_INSERT}>
                  {getResultDisplay("file_upload_insert", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_FILE_UPLOAD_UPDATE}>
                  {getResultDisplay("file_upload_update", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_FILE_UPLOAD_DELETE}>
                  {getResultDisplay("file_upload_delete", true)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Payment Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Select</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PAYMENT_SELECT}>
                  {getResultDisplay("payment_select", true)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Insert</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PAYMENT_INSERT}>
                  {getResultDisplay("payment_insert", false)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Update</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PAYMENT_UPDATE}>
                  {getResultDisplay("payment_update", false)}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Delete</h3>
                <div data-cy={DataCyAttributes.RLS_TEST_PAYMENT_DELETE}>
                  {getResultDisplay("payment_delete", false)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
