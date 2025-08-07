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
  useSelectOtherUser,
  useSelectUserProfile,
  useSelectUserUser,
  useUpdateAdminProfile,
  useUpdateAdminUser,
  useUpdateUserProfile,
  useUpdateUserUser,
  useSelectAdminContract,
  useSelectUserContract,
  useInsertAdminContract,
  useInsertUserContract,
  useUpdateAdminContract,
  useUpdateUserContract,
  useDeleteAdminContract,
  useDeleteUserContract,
  useDeleteAllUserContracts,
  useSelectAdminTask,
  useSelectUserTask,
  useInsertAdminTask,
  useInsertUserTask,
  useUpdateAdminTask,
  useUpdateUserTask,
  useDeleteAdminTask,
  useDeleteUserTask,
  useDeleteAllUserTasks,
  useSelectAdminConversation,
  useSelectUserConversation,
  useInsertAdminConversation,
  useInsertUserConversation,
  useUpdateAdminConversation,
  useUpdateUserConversation,
  useDeleteAdminConversation,
  useDeleteUserConversation,
  useDeleteAllUserConversations,
  useSelectAdminMessage,
  useSelectUserMessage,
  useInsertAdminMessage,
  useInsertUserMessage,
  useUpdateAdminMessage,
  useUpdateUserMessage,
  useDeleteAdminMessage,
  useDeleteUserMessage,
  useDeleteAllUserMessages,
  usePayUserContract,
} from "./page.hooks";

export default function RLSTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInMutation = useRLSSignIn();
  const signOutMutation = useRLSSignOut();

  const selectAdminUserMutation = useSelectAdminUser();
  const selectUserUserMutation = useSelectUserUser();
  const selectOtherUserMutation = useSelectOtherUser();
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

  const selectAdminContractMutation = useSelectAdminContract();
  const selectUserContractMutation = useSelectUserContract();
  const insertAdminContractMutation = useInsertAdminContract();
  const insertUserContractMutation = useInsertUserContract();
  const updateAdminContractMutation = useUpdateAdminContract();
  const updateUserContractMutation = useUpdateUserContract();
  const deleteAdminContractMutation = useDeleteAdminContract();
  const deleteUserContractMutation = useDeleteUserContract();
  const deleteAllUserContractsMutation = useDeleteAllUserContracts();

  const selectAdminTaskMutation = useSelectAdminTask();
  const selectUserTaskMutation = useSelectUserTask();
  const insertAdminTaskMutation = useInsertAdminTask();
  const insertUserTaskMutation = useInsertUserTask();
  const updateAdminTaskMutation = useUpdateAdminTask();
  const updateUserTaskMutation = useUpdateUserTask();
  const deleteAdminTaskMutation = useDeleteAdminTask();
  const deleteUserTaskMutation = useDeleteUserTask();
  const deleteAllUserTasksMutation = useDeleteAllUserTasks();

  const selectAdminConversationMutation = useSelectAdminConversation();
  const selectUserConversationMutation = useSelectUserConversation();
  const insertAdminConversationMutation = useInsertAdminConversation();
  const insertUserConversationMutation = useInsertUserConversation();
  const updateAdminConversationMutation = useUpdateAdminConversation();
  const updateUserConversationMutation = useUpdateUserConversation();
  const deleteAdminConversationMutation = useDeleteAdminConversation();
  const deleteUserConversationMutation = useDeleteUserConversation();
  const deleteAllUserConversationsMutation = useDeleteAllUserConversations();

  const selectAdminMessageMutation = useSelectAdminMessage();
  const selectUserMessageMutation = useSelectUserMessage();
  const insertAdminMessageMutation = useInsertAdminMessage();
  const insertUserMessageMutation = useInsertUserMessage();
  const updateAdminMessageMutation = useUpdateAdminMessage();
  const updateUserMessageMutation = useUpdateUserMessage();
  const deleteAdminMessageMutation = useDeleteAdminMessage();
  const deleteUserMessageMutation = useDeleteUserMessage();
  const deleteAllUserMessagesMutation = useDeleteAllUserMessages();

  const payUserContractMutation = usePayUserContract();


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
              onClick={() => selectOtherUserMutation.mutate()}
              disabled={selectOtherUserMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_OTHER_USER_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectOtherUserMutation.isPending
                ? "Loading..."
                : "Select Other User"}
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

        {/* Contract Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Contract Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => selectAdminContractMutation.mutate()}
              disabled={selectAdminContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_CONTRACT_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminContractMutation.isPending
                ? "Loading..."
                : "Select Admin Contract"}
            </Button>
            <Button
              onClick={() => selectUserContractMutation.mutate()}
              disabled={selectUserContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_CONTRACT_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserContractMutation.isPending
                ? "Loading..."
                : "Select User Contract"}
            </Button>
            <Button
              onClick={() => insertAdminContractMutation.mutate()}
              disabled={insertAdminContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_ADMIN_CONTRACT_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertAdminContractMutation.isPending
                ? "Loading..."
                : "Insert Admin Contract"}
            </Button>
            <Button
              onClick={() => insertUserContractMutation.mutate()}
              disabled={insertUserContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_USER_CONTRACT_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertUserContractMutation.isPending
                ? "Loading..."
                : "Insert User Contract"}
            </Button>
            <Button
              onClick={() => updateAdminContractMutation.mutate()}
              disabled={updateAdminContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_CONTRACT_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminContractMutation.isPending
                ? "Loading..."
                : "Update Admin Contract"}
            </Button>
            <Button
              onClick={() => updateUserContractMutation.mutate()}
              disabled={updateUserContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_CONTRACT_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserContractMutation.isPending
                ? "Loading..."
                : "Update User Contract"}
            </Button>
            <Button
              onClick={() => deleteAdminContractMutation.mutate()}
              disabled={deleteAdminContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_CONTRACT_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminContractMutation.isPending
                ? "Loading..."
                : "Delete Admin Contract"}
            </Button>
            <Button
              onClick={() => deleteUserContractMutation.mutate()}
              disabled={deleteUserContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_CONTRACT_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserContractMutation.isPending
                ? "Loading..."
                : "Delete User Contract"}
            </Button>
            <Button
              onClick={() => deleteAllUserContractsMutation.mutate()}
              disabled={deleteAllUserContractsMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ALL_USER_CONTRACTS_BUTTON}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
            >
              {deleteAllUserContractsMutation.isPending
                ? "Loading..."
                : "Delete All User Contracts"}
            </Button>
            <Button
              onClick={() => payUserContractMutation.mutate()}
              disabled={payUserContractMutation.isPending}
              data-cy={DataCyAttributes.RLS_PAY_USER_CONTRACT_BUTTON}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600"
            >
              {payUserContractMutation.isPending
                ? "Loading..."
                : "Pay for Contract"}
            </Button>
          </div>
        </div>

        {/* Task Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Task Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => selectAdminTaskMutation.mutate()}
              disabled={selectAdminTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_TASK_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminTaskMutation.isPending
                ? "Loading..."
                : "Select Admin Task"}
            </Button>
            <Button
              onClick={() => selectUserTaskMutation.mutate()}
              disabled={selectUserTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_TASK_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserTaskMutation.isPending
                ? "Loading..."
                : "Select User Task"}
            </Button>
            <Button
              onClick={() => insertAdminTaskMutation.mutate()}
              disabled={insertAdminTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_ADMIN_TASK_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertAdminTaskMutation.isPending
                ? "Loading..."
                : "Insert Admin Task"}
            </Button>
            <Button
              onClick={() => insertUserTaskMutation.mutate()}
              disabled={insertUserTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_USER_TASK_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertUserTaskMutation.isPending
                ? "Loading..."
                : "Insert User Task"}
            </Button>
            <Button
              onClick={() => updateAdminTaskMutation.mutate()}
              disabled={updateAdminTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_TASK_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminTaskMutation.isPending
                ? "Loading..."
                : "Update Admin Task"}
            </Button>
            <Button
              onClick={() => updateUserTaskMutation.mutate()}
              disabled={updateUserTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_TASK_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserTaskMutation.isPending
                ? "Loading..."
                : "Update User Task"}
            </Button>
            <Button
              onClick={() => deleteAdminTaskMutation.mutate()}
              disabled={deleteAdminTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_TASK_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminTaskMutation.isPending
                ? "Loading..."
                : "Delete Admin Task"}
            </Button>
            <Button
              onClick={() => deleteUserTaskMutation.mutate()}
              disabled={deleteUserTaskMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_TASK_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserTaskMutation.isPending
                ? "Loading..."
                : "Delete User Task"}
            </Button>
            <Button
              onClick={() => deleteAllUserTasksMutation.mutate()}
              disabled={deleteAllUserTasksMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ALL_USER_TASKS_BUTTON}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
            >
              {deleteAllUserTasksMutation.isPending
                ? "Loading..."
                : "Delete All User Tasks"}
            </Button>
          </div>
        </div>

        {/* Conversation Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Conversation Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => selectAdminConversationMutation.mutate()}
              disabled={selectAdminConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_CONVERSATION_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminConversationMutation.isPending
                ? "Loading..."
                : "Select Admin Conversation"}
            </Button>
            <Button
              onClick={() => selectUserConversationMutation.mutate()}
              disabled={selectUserConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_CONVERSATION_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserConversationMutation.isPending
                ? "Loading..."
                : "Select User Conversation"}
            </Button>
            <Button
              onClick={() => insertAdminConversationMutation.mutate()}
              disabled={insertAdminConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_ADMIN_CONVERSATION_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertAdminConversationMutation.isPending
                ? "Loading..."
                : "Insert Admin Conversation"}
            </Button>
            <Button
              onClick={() => insertUserConversationMutation.mutate()}
              disabled={insertUserConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_USER_CONVERSATION_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertUserConversationMutation.isPending
                ? "Loading..."
                : "Insert User Conversation"}
            </Button>
            <Button
              onClick={() => updateAdminConversationMutation.mutate()}
              disabled={updateAdminConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_CONVERSATION_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminConversationMutation.isPending
                ? "Loading..."
                : "Update Admin Conversation"}
            </Button>
            <Button
              onClick={() => updateUserConversationMutation.mutate()}
              disabled={updateUserConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_CONVERSATION_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserConversationMutation.isPending
                ? "Loading..."
                : "Update User Conversation"}
            </Button>
            <Button
              onClick={() => deleteAdminConversationMutation.mutate()}
              disabled={deleteAdminConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_CONVERSATION_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminConversationMutation.isPending
                ? "Loading..."
                : "Delete Admin Conversation"}
            </Button>
            <Button
              onClick={() => deleteUserConversationMutation.mutate()}
              disabled={deleteUserConversationMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_CONVERSATION_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserConversationMutation.isPending
                ? "Loading..."
                : "Delete User Conversation"}
            </Button>
            <Button
              onClick={() => deleteAllUserConversationsMutation.mutate()}
              disabled={deleteAllUserConversationsMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ALL_USER_CONVERSATIONS_BUTTON}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
            >
              {deleteAllUserConversationsMutation.isPending
                ? "Loading..."
                : "Delete All User Conversations"}
            </Button>
          </div>
        </div>

        {/* Message Actions */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Message Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => selectAdminMessageMutation.mutate()}
              disabled={selectAdminMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_ADMIN_MESSAGE_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectAdminMessageMutation.isPending
                ? "Loading..."
                : "Select Admin Message"}
            </Button>
            <Button
              onClick={() => selectUserMessageMutation.mutate()}
              disabled={selectUserMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_SELECT_USER_MESSAGE_BUTTON}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {selectUserMessageMutation.isPending
                ? "Loading..."
                : "Select User Message"}
            </Button>
            <Button
              onClick={() => insertAdminMessageMutation.mutate()}
              disabled={insertAdminMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_ADMIN_MESSAGE_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertAdminMessageMutation.isPending
                ? "Loading..."
                : "Insert Admin Message"}
            </Button>
            <Button
              onClick={() => insertUserMessageMutation.mutate()}
              disabled={insertUserMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_INSERT_USER_MESSAGE_BUTTON}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
            >
              {insertUserMessageMutation.isPending
                ? "Loading..."
                : "Insert User Message"}
            </Button>
            <Button
              onClick={() => updateAdminMessageMutation.mutate()}
              disabled={updateAdminMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_ADMIN_MESSAGE_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateAdminMessageMutation.isPending
                ? "Loading..."
                : "Update Admin Message"}
            </Button>
            <Button
              onClick={() => updateUserMessageMutation.mutate()}
              disabled={updateUserMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_UPDATE_USER_MESSAGE_BUTTON}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              {updateUserMessageMutation.isPending
                ? "Loading..."
                : "Update User Message"}
            </Button>
            <Button
              onClick={() => deleteAdminMessageMutation.mutate()}
              disabled={deleteAdminMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ADMIN_MESSAGE_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteAdminMessageMutation.isPending
                ? "Loading..."
                : "Delete Admin Message"}
            </Button>
            <Button
              onClick={() => deleteUserMessageMutation.mutate()}
              disabled={deleteUserMessageMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_USER_MESSAGE_BUTTON}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              {deleteUserMessageMutation.isPending
                ? "Loading..."
                : "Delete User Message"}
            </Button>
            <Button
              onClick={() => deleteAllUserMessagesMutation.mutate()}
              disabled={deleteAllUserMessagesMutation.isPending}
              data-cy={DataCyAttributes.RLS_DELETE_ALL_USER_MESSAGES_BUTTON}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
            >
              {deleteAllUserMessagesMutation.isPending
                ? "Loading..."
                : "Delete All User Messages"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
