//-| File path: app/test/rls/page.hooks.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
import { RLSSignInCredentials } from "./page.types";
import { 
  rlsSignInAction, 
  rlsSignOutAction,
  rlsSelectAdminUserAction,
  rlsSelectUserUserAction,
  rlsSelectOtherUserAction,
  rlsUpdateAdminUserAction,
  rlsUpdateUserUserAction,
  rlsDeleteAdminUserAction,
  rlsDeleteUserUserAction,
  rlsInsertNewUserAction,
  rlsDeleteAdminProfileAction,
  rlsDeleteUserProfileAction,
  rlsInsertAdminProfileAction,
  rlsInsertUserProfileAction,
  rlsSelectAdminProfileAction,
  rlsSelectUserProfileAction,
  rlsUpdateAdminProfileAction,
  rlsUpdateUserProfileAction,
  rlsSelectAdminContractAction,
  rlsSelectUserContractAction,
  rlsInsertAdminContractAction,
  rlsInsertUserContractAction,
  rlsUpdateAdminContractAction,
  rlsUpdateUserContractAction,
  rlsDeleteAdminContractAction,
  rlsDeleteUserContractAction,
  rlsDeleteAllUserContractsAction,
  rlsSelectAdminTaskAction,
  rlsSelectUserTaskAction,
  rlsInsertAdminTaskAction,
  rlsInsertUserTaskAction,
  rlsUpdateAdminTaskAction,
  rlsUpdateUserTaskAction,
  rlsDeleteAdminTaskAction,
  rlsDeleteUserTaskAction,
  rlsDeleteAllUserTasksAction,
  rlsSelectAdminConversationAction,
  rlsSelectUserConversationAction,
  rlsInsertAdminConversationAction,
  rlsInsertUserConversationAction,
  rlsUpdateAdminConversationAction,
  rlsUpdateUserConversationAction,
  rlsDeleteAdminConversationAction,
  rlsDeleteUserConversationAction,
  rlsDeleteAllUserConversationsAction,
  rlsSelectAdminMessageAction,
  rlsSelectUserMessageAction,
  rlsInsertAdminMessageAction,
  rlsInsertUserMessageAction,
  rlsUpdateAdminMessageAction,
  rlsUpdateUserMessageAction,
  rlsDeleteAdminMessageAction,
  rlsDeleteUserMessageAction,
  rlsDeleteAllUserMessagesAction,
  rlsPayUserContractAction
} from "./page.actions";

export const useRLSSignIn = () => {
  return useMutation({
    mutationFn: async (credentials: RLSSignInCredentials) => {
      const { data, error } = await rlsSignInAction(credentials);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message="Successfully signed in"
            data-cy={DataCyAttributes.RLS_SUCCESS_SIGN_IN_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to sign in"}
          data-cy={DataCyAttributes.RLS_ERROR_SIGN_IN_USER}
        />
      ));
    },
  });
};

export const useRLSSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSignOutAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message="Successfully signed out"
            data-cy={DataCyAttributes.RLS_SUCCESS_SIGN_OUT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to sign out"}
          data-cy={DataCyAttributes.RLS_ERROR_SIGN_OUT}
        />
      ));
    },
  });
};

export const useSelectAdminUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin user selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_SELECT_ADMIN_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin user"}
          data-cy={DataCyAttributes.RLS_ERROR_SELECT_ADMIN_USER}
        />
      ));
    },
  });
};

export const useSelectUserUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User user selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_SELECT_USER_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user user"}
          data-cy={DataCyAttributes.RLS_ERROR_SELECT_USER_USER}
        />
      ));
    },
  });
};

export const useSelectOtherUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectOtherUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Other user selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_SELECT_OTHER_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select other user"}
          data-cy={DataCyAttributes.RLS_ERROR_SELECT_OTHER_USER}
        />
      ));
    },
  });
};

export const useUpdateAdminUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin user updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_UPDATE_ADMIN_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin user"}
          data-cy={DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_USER}
        />
      ));
    },
  });
};

export const useUpdateUserUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User user updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_UPDATE_USER_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user user"}
          data-cy={DataCyAttributes.RLS_ERROR_UPDATE_USER_USER}
        />
      ));
    },
  });
};

export const useDeleteAdminUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin user deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_DELETE_ADMIN_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin user"}
          data-cy={DataCyAttributes.RLS_ERROR_DELETE_ADMIN_USER}
        />
      ));
    },
  });
};

export const useDeleteUserUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User user deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_DELETE_USER_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user user"}
          data-cy={DataCyAttributes.RLS_ERROR_DELETE_USER_USER}
        />
      ));
    },
  });
};

export const useInsertNewUser = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertNewUserAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "New user created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_INSERT_NEW_USER}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create new user"}
          data-cy={DataCyAttributes.RLS_ERROR_INSERT_NEW_USER}
        />
      ));
    },
  });
};

export const useDeleteAdminProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin profile deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_DELETE_ADMIN_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin profile"}
          data-cy={DataCyAttributes.RLS_ERROR_DELETE_ADMIN_PROFILE}
        />
      ));
    },
  });
};

export const useDeleteUserProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User profile deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_DELETE_USER_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user profile"}
          data-cy={DataCyAttributes.RLS_ERROR_DELETE_USER_PROFILE}
        />
      ));
    },
  });
};

export const useInsertAdminProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertAdminProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin profile created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_INSERT_ADMIN_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create admin profile"}
          data-cy={DataCyAttributes.RLS_ERROR_INSERT_ADMIN_PROFILE}
        />
      ));
    },
  });
};

export const useInsertUserProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertUserProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User profile created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_INSERT_USER_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create user profile"}
          data-cy={DataCyAttributes.RLS_ERROR_INSERT_USER_PROFILE}
        />
      ));
    },
  });
};

export const useSelectAdminProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin profile selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_SELECT_ADMIN_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin profile"}
          data-cy={DataCyAttributes.RLS_ERROR_SELECT_ADMIN_PROFILE}
        />
      ));
    },
  });
};

export const useSelectUserProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User profile selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_SELECT_USER_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user profile"}
          data-cy={DataCyAttributes.RLS_ERROR_SELECT_USER_PROFILE}
        />
      ));
    },
  });
};

export const useUpdateAdminProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin profile updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_UPDATE_ADMIN_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin profile"}
          data-cy={DataCyAttributes.RLS_ERROR_UPDATE_ADMIN_PROFILE}
        />
      ));
    },
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User profile updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_UPDATE_USER_PROFILE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user profile"}
          data-cy={DataCyAttributes.RLS_ERROR_UPDATE_USER_PROFILE}
        />
      ));
    },
  });
};

// Contract hooks
export const useSelectAdminContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin contract selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_SELECT}
        />
      ));
    },
  });
};

export const useSelectUserContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User contract selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_SELECT}
        />
      ));
    },
  });
};

export const useInsertAdminContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertAdminContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin contract created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create admin contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_INSERT}
        />
      ));
    },
  });
};

export const useInsertUserContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertUserContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User contract created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create user contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_INSERT}
        />
      ));
    },
  });
};

export const useUpdateAdminContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin contract updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_UPDATE}
        />
      ));
    },
  });
};

export const useUpdateUserContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User contract updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_UPDATE}
        />
      ));
    },
  });
};

export const useDeleteAdminContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin contract deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_DELETE}
        />
      ));
    },
  });
};

export const useDeleteUserContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User contract deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user contract"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_DELETE}
        />
      ));
    },
  });
};

export const useDeleteAllUserContracts = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAllUserContractsAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "All user contracts deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONTRACT_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete all user contracts"}
          data-cy={DataCyAttributes.RLS_ERROR_CONTRACT_DELETE}
        />
      ));
    },
  });
};

// Task hooks
export const useSelectAdminTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin task selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_SELECT}
        />
      ));
    },
  });
};

export const useSelectUserTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User task selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_SELECT}
        />
      ));
    },
  });
};

export const useInsertAdminTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertAdminTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin task created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create admin task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_INSERT}
        />
      ));
    },
  });
};

export const useInsertUserTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertUserTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User task created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create user task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_INSERT}
        />
      ));
    },
  });
};

export const useUpdateAdminTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin task updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_UPDATE}
        />
      ));
    },
  });
};

export const useUpdateUserTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User task updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_UPDATE}
        />
      ));
    },
  });
};

export const useDeleteAdminTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin task deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_DELETE}
        />
      ));
    },
  });
};

export const useDeleteUserTask = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserTaskAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User task deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user task"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_DELETE}
        />
      ));
    },
  });
};

export const useDeleteAllUserTasks = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAllUserTasksAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "All user tasks deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_TASK_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete all user tasks"}
          data-cy={DataCyAttributes.RLS_ERROR_TASK_DELETE}
        />
      ));
    },
  });
};

// Conversation hooks
export const useSelectAdminConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin conversation selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_SELECT}
        />
      ));
    },
  });
};

export const useSelectUserConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User conversation selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_SELECT}
        />
      ));
    },
  });
};

export const useInsertAdminConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertAdminConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin conversation created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create admin conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_INSERT}
        />
      ));
    },
  });
};

export const useInsertUserConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertUserConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User conversation created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create user conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_INSERT}
        />
      ));
    },
  });
};

export const useUpdateAdminConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin conversation updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_UPDATE}
        />
      ));
    },
  });
};

export const useUpdateUserConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User conversation updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_UPDATE}
        />
      ));
    },
  });
};

export const useDeleteAdminConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin conversation deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE}
        />
      ));
    },
  });
};

export const useDeleteUserConversation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserConversationAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User conversation deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user conversation"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE}
        />
      ));
    },
  });
};

export const useDeleteAllUserConversations = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAllUserConversationsAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "All user conversations deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_CONVERSATION_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete all user conversations"}
          data-cy={DataCyAttributes.RLS_ERROR_CONVERSATION_DELETE}
        />
      ));
    },
  });
};

// Message hooks
export const useSelectAdminMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectAdminMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin message selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select admin message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_SELECT}
        />
      ));
    },
  });
};

export const useSelectUserMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsSelectUserMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User message selected successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_SELECT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to select user message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_SELECT}
        />
      ));
    },
  });
};

export const useInsertAdminMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertAdminMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin message created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create admin message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_INSERT}
        />
      ));
    },
  });
};

export const useInsertUserMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsInsertUserMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User message created successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_INSERT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create user message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_INSERT}
        />
      ));
    },
  });
};

export const useUpdateAdminMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateAdminMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin message updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update admin message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_UPDATE}
        />
      ));
    },
  });
};

export const useUpdateUserMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsUpdateUserMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User message updated successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_UPDATE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update user message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_UPDATE}
        />
      ));
    },
  });
};

export const useDeleteAdminMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAdminMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "Admin message deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete admin message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_DELETE}
        />
      ));
    },
  });
};

export const useDeleteUserMessage = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteUserMessageAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User message deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user message"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_DELETE}
        />
      ));
    },
  });
};

export const useDeleteAllUserMessages = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsDeleteAllUserMessagesAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "All user messages deleted successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_MESSAGE_DELETE}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete all user messages"}
          data-cy={DataCyAttributes.RLS_ERROR_MESSAGE_DELETE}
        />
      ));
    },
  });
};

// Pay User Contract hook (using secure payment processing)
export const usePayUserContract = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rlsPayUserContractAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message={data.message || "User contract payment processed successfully"}
            data-cy={DataCyAttributes.RLS_SUCCESS_PAY_USER_CONTRACT}
          />
        ));
      }
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to process user contract payment"}
          data-cy={DataCyAttributes.RLS_ERROR_PAY_USER_CONTRACT}
        />
      ));
    },
  });
};