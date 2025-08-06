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
  rlsUpdateUserProfileAction
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