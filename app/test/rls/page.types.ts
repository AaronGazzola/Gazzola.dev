//-| File path: app/test/rls/page.types.ts

export interface RLSTestResult {
  success: boolean;
  error?: string;
  count?: number;
}

export interface RLSTestResults {
  profile_select: RLSTestResult;
  profile_insert: RLSTestResult;
  profile_update: RLSTestResult;
  profile_delete: RLSTestResult;
  contract_select: RLSTestResult;
  contract_insert: RLSTestResult;
  contract_update: RLSTestResult;
  contract_delete: RLSTestResult;
  task_select: RLSTestResult;
  task_insert: RLSTestResult;
  task_update: RLSTestResult;
  task_delete: RLSTestResult;
  conversation_select: RLSTestResult;
  conversation_insert: RLSTestResult;
  conversation_update: RLSTestResult;
  conversation_delete: RLSTestResult;
  message_select: RLSTestResult;
  message_insert: RLSTestResult;
  message_update: RLSTestResult;
  message_delete: RLSTestResult;
  file_upload_select: RLSTestResult;
  file_upload_insert: RLSTestResult;
  file_upload_update: RLSTestResult;
  file_upload_delete: RLSTestResult;
  payment_select: RLSTestResult;
  payment_insert: RLSTestResult;
  payment_update: RLSTestResult;
  payment_delete: RLSTestResult;
}

export type RLSTestAction = keyof RLSTestResults;

export interface RLSTestState {
  isRunning: boolean;
  currentAction: RLSTestAction | null;
  results: Partial<RLSTestResults>;
  userRole: string | null;
  error: string | null;
}