//-| File path: app/test/rls/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataCyAttributes } from "@/types/cypress.types";
import { useState } from "react";
import {
  useDeleteAdminProfile,
  useDeleteAdminUser,
  useDeleteUserProfile,
  useDeleteUserUser,
  useInsertAdminProfile,
  useInsertNewUser,
  useInsertUserProfile,
  useRLSSignIn,
  useRLSSignOut,
  useSelectAdminProfile,
  useSelectAdminUser,
  useSelectUserProfile,
  useSelectUserUser,
  useUpdateAdminProfile,
  useUpdateAdminUser,
  useUpdateUserProfile,
  useUpdateUserUser,
} from "./page.hooks";

export default function RLSTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInMutation = useRLSSignIn();
  const signOutMutation = useRLSSignOut();

  const selectAdminUserMutation = useSelectAdminUser();
  const selectUserUserMutation = useSelectUserUser();
  const updateAdminUserMutation = useUpdateAdminUser();
  const updateUserUserMutation = useUpdateUserUser();
  const deleteAdminUserMutation = useDeleteAdminUser();
  const deleteUserUserMutation = useDeleteUserUser();
  const insertNewUserMutation = useInsertNewUser();

  const deleteAdminProfileMutation = useDeleteAdminProfile();
  const deleteUserProfileMutation = useDeleteUserProfile();
  const insertAdminProfileMutation = useInsertAdminProfile();
  const insertUserProfileMutation = useInsertUserProfile();
  const selectAdminProfileMutation = useSelectAdminProfile();
  const selectUserProfileMutation = useSelectUserProfile();
  const updateAdminProfileMutation = useUpdateAdminProfile();
  const updateUserProfileMutation = useUpdateUserProfile();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    signInMutation.mutate({ email, password });
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-10 bg-black min-h-screen">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            RLS Test Page
          </h1>
          <p className="text-white">
            Test Row Level Security with simplified authentication
          </p>
        </div>

        {/* Sign-in Form */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Authentication
          </h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-cy={DataCyAttributes.RLS_EMAIL_INPUT}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-cy={DataCyAttributes.RLS_PASSWORD_INPUT}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={signInMutation.isPending || !email || !password}
                data-cy={DataCyAttributes.RLS_SIGN_IN_BUTTON}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
              >
                {signInMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                type="button"
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                data-cy={DataCyAttributes.RLS_SIGN_OUT_BUTTON}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
              >
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </form>
        </div>

        {/* User Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            User Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => selectAdminUserMutation.mutate()}
              disabled={selectAdminUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_USER_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminUserMutation.isPending
                ? "Loading..."
                : "Select Admin User"}
            </Button>
            <Button
              onClick={() => selectUserUserMutation.mutate()}
              disabled={selectUserUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_USER_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserUserMutation.isPending
                ? "Loading..."
                : "Select User User"}
            </Button>
            <Button
              onClick={() => updateAdminUserMutation.mutate()}
              disabled={updateAdminUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_USER_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminUserMutation.isPending
                ? "Loading..."
                : "Update Admin User"}
            </Button>
            <Button
              onClick={() => updateUserUserMutation.mutate()}
              disabled={updateUserUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_USER_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserUserMutation.isPending
                ? "Loading..."
                : "Update User User"}
            </Button>
            <Button
              onClick={() => deleteAdminUserMutation.mutate()}
              disabled={deleteAdminUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_USER_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminUserMutation.isPending
                ? "Loading..."
                : "Delete Admin User"}
            </Button>
            <Button
              onClick={() => deleteUserUserMutation.mutate()}
              disabled={deleteUserUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_USER_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserUserMutation.isPending
                ? "Loading..."
                : "Delete User User"}
            </Button>
            <Button
              onClick={() => insertNewUserMutation.mutate()}
              disabled={insertNewUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_NEW_USER_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertNewUserMutation.isPending
                ? "Loading..."
                : "Insert New User"}
            </Button>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Profile Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => deleteAdminProfileMutation.mutate()}
              disabled={deleteAdminProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_PROFILE_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminProfileMutation.isPending
                ? "Loading..."
                : "Delete Admin Profile"}
            </Button>
            <Button
              onClick={() => deleteUserProfileMutation.mutate()}
              disabled={deleteUserProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_PROFILE_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserProfileMutation.isPending
                ? "Loading..."
                : "Delete User Profile"}
            </Button>
            <Button
              onClick={() => insertAdminProfileMutation.mutate()}
              disabled={insertAdminProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_ADMIN_PROFILE_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertAdminProfileMutation.isPending
                ? "Loading..."
                : "Insert Admin Profile"}
            </Button>
            <Button
              onClick={() => insertUserProfileMutation.mutate()}
              disabled={insertUserProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_USER_PROFILE_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertUserProfileMutation.isPending
                ? "Loading..."
                : "Insert User Profile"}
            </Button>
            <Button
              onClick={() => selectAdminProfileMutation.mutate()}
              disabled={selectAdminProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_PROFILE_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminProfileMutation.isPending
                ? "Loading..."
                : "Select Admin Profile"}
            </Button>
            <Button
              onClick={() => selectUserProfileMutation.mutate()}
              disabled={selectUserProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_PROFILE_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserProfileMutation.isPending
                ? "Loading..."
                : "Select User Profile"}
            </Button>
            <Button
              onClick={() => updateAdminProfileMutation.mutate()}
              disabled={updateAdminProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_PROFILE_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminProfileMutation.isPending
                ? "Loading..."
                : "Update Admin Profile"}
            </Button>
            <Button
              onClick={() => updateUserProfileMutation.mutate()}
              disabled={updateUserProfileMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_PROFILE_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserProfileMutation.isPending
                ? "Loading..."
                : "Update User Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
