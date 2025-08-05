"use client";

import { signInAction } from "@/app/(components)/AuthDialog.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import * as actions from "@/app/test/rls/profile/page.actions";
import {
  RLSProfileTestAction,
  RLSProfileTestState,
  TestEnvironmentError,
} from "@/app/test/rls/profile/page.types";
import { Toast } from "@/components/shared/Toast";
import configuration from "@/configuration";
import { signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const actionMap = {
  select_admin_user: actions.selectAdminUserAction,
  select_regular_user: actions.selectRegularUserAction,
  select_own_user: actions.selectOwnUserAction,
  delete_admin_user: actions.deleteAdminUserAction,
  delete_regular_user: actions.deleteRegularUserAction,
  delete_own_user: actions.deleteOwnUserAction,
  select_admin_profile: actions.selectAdminProfileAction,
  select_regular_user_profile: actions.selectRegularUserProfileAction,
  select_own_profile: actions.selectOwnProfileAction,
  create_admin_profile: actions.createAdminProfileAction,
  create_regular_user_profile: actions.createRegularUserProfileAction,
  create_own_profile: actions.createOwnProfileAction,
  update_admin_profile: actions.updateAdminProfileAction,
  update_regular_user_profile: actions.updateRegularUserProfileAction,
  update_own_profile: actions.updateOwnProfileAction,
  delete_admin_profile: actions.deleteAdminProfileAction,
  delete_regular_user_profile: actions.deleteRegularUserProfileAction,
  delete_own_profile: actions.deleteOwnProfileAction,
} as const;

const testActions: RLSProfileTestAction[] = [
  "select_admin_user",
  "select_regular_user",
  "select_own_user",
  "delete_admin_user",
  "delete_regular_user",
  "delete_own_user",
  "select_admin_profile",
  "select_regular_user_profile",
  "select_own_profile",
  "create_admin_profile",
  "create_regular_user_profile",
  "create_own_profile",
  "update_admin_profile",
  "update_regular_user_profile",
  "update_own_profile",
  "delete_admin_profile",
  "delete_regular_user_profile",
  "delete_own_profile",
];

const getSuccessToastAttribute = (
  action: RLSProfileTestAction
): DataCyAttributes => {
  const actionToAttributeMap: Record<RLSProfileTestAction, DataCyAttributes> = {
    select_admin_user: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    select_regular_user: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    select_own_user: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    delete_admin_user: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    delete_regular_user: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    delete_own_user: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    select_admin_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    select_regular_user_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    select_own_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_SELECT,
    create_admin_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_INSERT,
    create_regular_user_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_INSERT,
    create_own_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_INSERT,
    update_admin_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_UPDATE,
    update_regular_user_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_UPDATE,
    update_own_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_UPDATE,
    delete_admin_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    delete_regular_user_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
    delete_own_profile: DataCyAttributes.RLS_SUCCESS_PROFILE_DELETE,
  };
  return actionToAttributeMap[action];
};

const getErrorToastAttribute = (
  action: RLSProfileTestAction
): DataCyAttributes => {
  const actionToAttributeMap: Record<RLSProfileTestAction, DataCyAttributes> = {
    select_admin_user: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    select_regular_user: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    select_own_user: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    delete_admin_user: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    delete_regular_user: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    delete_own_user: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    select_admin_profile: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    select_regular_user_profile: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    select_own_profile: DataCyAttributes.RLS_ERROR_PROFILE_SELECT,
    create_admin_profile: DataCyAttributes.RLS_ERROR_PROFILE_INSERT,
    create_regular_user_profile: DataCyAttributes.RLS_ERROR_PROFILE_INSERT,
    create_own_profile: DataCyAttributes.RLS_ERROR_PROFILE_INSERT,
    update_admin_profile: DataCyAttributes.RLS_ERROR_PROFILE_UPDATE,
    update_regular_user_profile: DataCyAttributes.RLS_ERROR_PROFILE_UPDATE,
    update_own_profile: DataCyAttributes.RLS_ERROR_PROFILE_UPDATE,
    delete_admin_profile: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    delete_regular_user_profile: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
    delete_own_profile: DataCyAttributes.RLS_ERROR_PROFILE_DELETE,
  };
  return actionToAttributeMap[action];
};

export const useRLSProfileTests = () => {
  const router = useRouter();
  const [state, setState] = useState<RLSProfileTestState>({
    isRunning: false,
    currentAction: null,
    results: {},
    userRole: null,
    error: null,
  });

  const mutation = useMutation({
    mutationFn: async (action: RLSProfileTestAction) => {
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
          message={`RLS profile test ${action} completed successfully`}
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
          message={`RLS profile test ${action} failed: ${errorMessage}`}
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
    async (action: RLSProfileTestAction) => {
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
          message={`Successfully signed in as ${isAdmin ? "admin" : "user"}`}
          data-cy={
            isAdmin
              ? DataCyAttributes.RLS_SUCCESS_SIGN_IN_ADMIN
              : DataCyAttributes.RLS_SUCCESS_SIGN_IN_USER
          }
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
      const { deleteAllDataAction } = await import(
        "@/app/test/rls/profile/page.actions"
      );
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
          message="All profile data deleted successfully"
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
