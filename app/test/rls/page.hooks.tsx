//-| File path: app/test/rls/page.hooks.tsx
"use client";

import { signInAction } from "@/app/(components)/AuthDialog.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import * as actions from "@/app/test/rls/page.actions";
import {
  RLSTestAction,
  RLSTestState,
  TestEnvironmentError,
} from "@/app/test/rls/page.types";
import configuration from "@/configuration";
import { signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Toast } from "@/components/shared/Toast";

const actionMap = {
  profile_select: actions.testProfileSelectAction,
  profile_insert: actions.testProfileInsertAction,
  profile_update: actions.testProfileUpdateAction,
  profile_delete: actions.testProfileDeleteAction,
  contract_select: actions.testContractSelectAction,
  contract_insert: actions.testContractInsertAction,
  contract_update: actions.testContractUpdateAction,
  contract_delete: actions.testContractDeleteAction,
  task_select: actions.testTaskSelectAction,
  task_insert: actions.testTaskInsertAction,
  task_update: actions.testTaskUpdateAction,
  task_delete: actions.testTaskDeleteAction,
  conversation_select: actions.testConversationSelectAction,
  conversation_insert: actions.testConversationInsertAction,
  conversation_update: actions.testConversationUpdateAction,
  conversation_delete: actions.testConversationDeleteAction,
  message_select: actions.testMessageSelectAction,
  message_insert: actions.testMessageInsertAction,
  message_update: actions.testMessageUpdateAction,
  message_delete: actions.testMessageDeleteAction,
  file_upload_select: actions.testFileUploadSelectAction,
  file_upload_insert: actions.testFileUploadInsertAction,
  file_upload_update: actions.testFileUploadUpdateAction,
  file_upload_delete: actions.testFileUploadDeleteAction,
  payment_select: actions.testPaymentSelectAction,
  payment_insert: actions.testPaymentInsertAction,
  payment_update: actions.testPaymentUpdateAction,
  payment_delete: actions.testPaymentDeleteAction,
} as const;

const testActions: RLSTestAction[] = [
  "profile_select",
  "profile_insert",
  "profile_update",
  "profile_delete",
  "contract_select",
  "contract_insert",
  "contract_update",
  "contract_delete",
  "task_select",
  "task_insert",
  "task_update",
  "task_delete",
  "conversation_select",
  "conversation_insert",
  "conversation_update",
  "conversation_delete",
  "message_select",
  "message_insert",
  "message_update",
  "message_delete",
  "file_upload_select",
  "file_upload_insert",
  "file_upload_update",
  "file_upload_delete",
  "payment_select",
  "payment_insert",
  "payment_update",
  "payment_delete",
];

const getSuccessToastAttribute = (action: RLSTestAction): DataCyAttributes => {
  const actionToAttributeMap: Record<RLSTestAction, DataCyAttributes> = {
    profile_select: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    profile_insert: DataCyAttributes.RLS_SUCCESS_PROFILE_INSERT,
    profile_update: DataCyAttributes.RLS_SUCCESS_PROFILE_UPDATE,
    profile_delete: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    contract_select: DataCyAttributes.RLS_SUCCESS_CONTRACT_SELECT,
    contract_insert: DataCyAttributes.RLS_SUCCESS_CONTRACT_INSERT,
    contract_update: DataCyAttributes.RLS_SUCCESS_CONTRACT_UPDATE,
    contract_delete: DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE,
    task_select: DataCyAttributes.RLS_SUCCESS_TASK_SELECT,
    task_insert: DataCyAttributes.RLS_SUCCESS_TASK_INSERT,
    task_update: DataCyAttributes.RLS_SUCCESS_TASK_UPDATE,
    task_delete: DataCyAttributes.RLS_SUCCESS_TASK_DELETE,
    conversation_select: DataCyAttributes.RLS_SUCCESS_CONVERSATION_SELECT,
    conversation_insert: DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT,
    conversation_update: DataCyAttributes.RLS_SUCCESS_CONVERSATION_UPDATE,
    conversation_delete: DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE,
    message_select: DataCyAttributes.RLS_SUCCESS_MESSAGE_SELECT,
    message_insert: DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT,
    message_update: DataCyAttributes.RLS_SUCCESS_MESSAGE_UPDATE,
    message_delete: DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE,
    file_upload_select: DataCyAttributes.RLS_SUCCESS_FILE_UPLOAD_SELECT,
    file_upload_insert: DataCyAttributes.RLS_SUCCESS_FILE_UPLOAD_INSERT,
    file_upload_update: DataCyAttributes.RLS_SUCCESS_FILE_UPLOAD_UPDATE,
    file_upload_delete: DataCyAttributes.RLS_SUCCESS_FILE_UPLOAD_DELETE,
    payment_select: DataCyAttributes.RLS_SUCCESS_PAYMENT_SELECT,
    payment_insert: DataCyAttributes.RLS_SUCCESS_PAYMENT_INSERT,
    payment_update: DataCyAttributes.RLS_SUCCESS_PAYMENT_UPDATE,
    payment_delete: DataCyAttributes.RLS_SUCCESS_PAYMENT_DELETE,
  };
  return actionToAttributeMap[action];
};

const getErrorToastAttribute = (action: RLSTestAction): DataCyAttributes => {
  const actionToAttributeMap: Record<RLSTestAction, DataCyAttributes> = {
    profile_select: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    profile_insert: DataCyAttributes.RLS_ERROR_PROFILE_INSERT,
    profile_update: DataCyAttributes.RLS_ERROR_PROFILE_UPDATE,
    profile_delete: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    contract_select: DataCyAttributes.RLS_ERROR_CONTRACT_SELECT,
    contract_insert: DataCyAttributes.RLS_ERROR_CONTRACT_INSERT,
    contract_update: DataCyAttributes.RLS_ERROR_CONTRACT_UPDATE,
    contract_delete: DataCyAttributes.RLS_ERROR_CONTRACT_DELETE,
    task_select: DataCyAttributes.RLS_ERROR_TASK_SELECT,
    task_insert: DataCyAttributes.RLS_ERROR_TASK_INSERT,
    task_update: DataCyAttributes.RLS_ERROR_TASK_UPDATE,
    task_delete: DataCyAttributes.RLS_ERROR_TASK_DELETE,
    conversation_select: DataCyAttributes.RLS_ERROR_CONVERSATION_SELECT,
    conversation_insert: DataCyAttributes.RLS_ERROR_CONVERSATION_INSERT,
    conversation_update: DataCyAttributes.RLS_ERROR_CONVERSATION_UPDATE,
    conversation_delete: DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE,
    message_select: DataCyAttributes.RLS_ERROR_MESSAGE_SELECT,
    message_insert: DataCyAttributes.RLS_ERROR_MESSAGE_INSERT,
    message_update: DataCyAttributes.RLS_ERROR_MESSAGE_UPDATE,
    message_delete: DataCyAttributes.RLS_ERROR_MESSAGE_DELETE,
    file_upload_select: DataCyAttributes.RLS_ERROR_FILE_UPLOAD_SELECT,
    file_upload_insert: DataCyAttributes.RLS_ERROR_FILE_UPLOAD_INSERT,
    file_upload_update: DataCyAttributes.RLS_ERROR_FILE_UPLOAD_UPDATE,
    file_upload_delete: DataCyAttributes.RLS_ERROR_FILE_UPLOAD_DELETE,
    payment_select: DataCyAttributes.RLS_ERROR_PAYMENT_SELECT,
    payment_insert: DataCyAttributes.RLS_ERROR_PAYMENT_INSERT,
    payment_update: DataCyAttributes.RLS_ERROR_PAYMENT_UPDATE,
    payment_delete: DataCyAttributes.RLS_ERROR_PAYMENT_DELETE,
  };
  return actionToAttributeMap[action];
};

export const useRLSTests = () => {
  const router = useRouter();
  const [state, setState] = useState<RLSTestState>({
    isRunning: false,
    currentAction: null,
    results: {},
    userRole: null,
    error: null,
  });

  const mutation = useMutation({
    mutationFn: async (action: RLSTestAction) => {
      const actionFn = actionMap[action];
      const result = await actionFn();
      return { action, result };
    },
    onSuccess: ({ action, result }) => {
      // Check for test environment error in the response
      if (result.error && result.error.startsWith("TestEnvironmentError:")) {
        router.push(configuration.paths.home);
        return;
      }

      setState((prev) => ({
        ...prev,
        results: {
          ...prev.results,
          [action]: result.data || {
            success: false,
            error: result.error || "Unknown error",
          },
        },
      }));

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message={`RLS test ${action} completed successfully`}
          data-cy={getSuccessToastAttribute(action)}
        />
      ));
    },
    onError: (error, action) => {
      if (error instanceof TestEnvironmentError) {
        router.push(configuration.paths.home);
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      setState((prev) => ({
        ...prev,
        results: {
          ...prev.results,
          [action]: {
            success: false,
            error: errorMessage,
          },
        },
      }));

      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={`RLS test ${action} failed: ${errorMessage}`}
          data-cy={getErrorToastAttribute(action)}
        />
      ));
    },
  });

  const runAllTests = useCallback(
    async (userRole: string) => {
      setState((prev) => ({
        ...prev,
        isRunning: true,
        currentAction: null,
        results: {},
        userRole,
        error: null,
      }));

      try {
        for (const action of testActions) {
          setState((prev) => ({ ...prev, currentAction: action }));
          mutation.mutate(action);

          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        if (error instanceof TestEnvironmentError) {
          router.push(configuration.paths.home);
          return;
        }
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : String(error),
        }));
      } finally {
        setState((prev) => ({
          ...prev,
          isRunning: false,
          currentAction: null,
        }));
      }
    },
    [mutation, router]
  );

  const runSingleTest = useCallback(
    async (action: RLSTestAction) => {
      setState((prev) => ({
        ...prev,
        currentAction: action,
      }));

      try {
        mutation.mutate(action);
      } catch (error) {
        // Error is already handled in mutation onError
      } finally {
        setState((prev) => ({
          ...prev,
          currentAction: null,
        }));
      }
    },
    [mutation]
  );

  return {
    state,
    runAllTests,
    runSingleTest,
    isLoading: mutation.isPending,
  };
};

export const useSignIn = () => {
  const { setUser, setIsVerified, setIsAdmin } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await signInAction({
        email,
        password,
      });

      if (error) throw new Error(error);
      if (!data) throw new Error("No user data received");

      return data;
    },
    onSuccess: (user) => {
      setUser(user);
      setIsVerified(true);
      setIsAdmin(user.role === "admin");

      const isAdmin = user.role === "admin";
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message={`Successfully signed in as ${isAdmin ? 'admin' : 'user'}`}
          data-cy={isAdmin ? DataCyAttributes.RLS_SUCCESS_SIGN_IN_ADMIN : DataCyAttributes.RLS_SUCCESS_SIGN_IN_USER}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error instanceof Error ? error.message : String(error)}
          data-cy={DataCyAttributes.RLS_ERROR_SIGN_IN_ADMIN}
        />
      ));
    },
  });
};

export const useSignOut = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const { error, data } = await signOut();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setUser(null);
      setProfile(null);
      setIsVerified(false);
      setIsAdmin(false);

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed out"
          data-cy={DataCyAttributes.RLS_SUCCESS_SIGN_OUT}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error instanceof Error ? error.message : String(error)}
          data-cy={DataCyAttributes.RLS_ERROR_SIGN_OUT}
        />
      ));
    },
  });
};

export const useDeleteAllData = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { deleteAllDataAction } = await import("@/app/test/rls/page.actions");
      const result = await deleteAllDataAction();
      if (result.error) {
        if (result.error.startsWith("TestEnvironmentError:")) {
          router.push(configuration.paths.home);
          return;
        }
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="All user data deleted successfully"
          data-cy={DataCyAttributes.RLS_SUCCESS_DELETE_ALL_DATA}
        />
      ));
    },
    onError: (error) => {
      if (error instanceof TestEnvironmentError) {
        router.push(configuration.paths.home);
        return;
      }

      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error instanceof Error ? error.message : String(error)}
          data-cy={DataCyAttributes.RLS_ERROR_DELETE_ALL_DATA}
        />
      ));
    },
  });
};

