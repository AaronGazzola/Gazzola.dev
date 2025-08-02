//-| File path: app/test/rls/page.hooks.ts
"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { RLSTestState, RLSTestAction } from "@/app/test/rls/page.types";
import * as actions from "@/app/test/rls/page.actions";

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
  'profile_select',
  'profile_insert', 
  'profile_update',
  'profile_delete',
  'contract_select',
  'contract_insert',
  'contract_update', 
  'contract_delete',
  'task_select',
  'task_insert',
  'task_update',
  'task_delete',
  'conversation_select',
  'conversation_insert',
  'conversation_update',
  'conversation_delete',
  'message_select',
  'message_insert',
  'message_update',
  'message_delete',
  'file_upload_select',
  'file_upload_insert',
  'file_upload_update',
  'file_upload_delete',
  'payment_select',
  'payment_insert',
  'payment_update',
  'payment_delete',
];

export const useRLSTests = () => {
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
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [action]: result.data || { success: false, error: result.error || 'Unknown error' }
        }
      }));
    },
    onError: (error, action) => {
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [action]: { success: false, error: error instanceof Error ? error.message : String(error) }
        }
      }));
    },
  });

  const runAllTests = useCallback(async (userRole: string) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentAction: null,
      results: {},
      userRole,
      error: null,
    }));

    try {
      for (const action of testActions) {
        setState(prev => ({ ...prev, currentAction: action }));
        await mutation.mutateAsync(action);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error)
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentAction: null,
      }));
    }
  }, [mutation]);

  return {
    state,
    runAllTests,
    isLoading: mutation.isPending,
  };
};