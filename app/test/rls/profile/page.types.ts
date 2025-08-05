export interface RLSProfileTestResult {
  success: boolean;
  error?: string;
  count?: number;
}

export interface RLSProfileTestResults {
  // User operations
  select_admin_user: RLSProfileTestResult;
  select_regular_user: RLSProfileTestResult;
  select_own_user: RLSProfileTestResult;
  delete_admin_user: RLSProfileTestResult;
  delete_regular_user: RLSProfileTestResult;
  delete_own_user: RLSProfileTestResult;

  // Profile operations
  select_admin_profile: RLSProfileTestResult;
  select_regular_user_profile: RLSProfileTestResult;
  select_own_profile: RLSProfileTestResult;
  create_admin_profile: RLSProfileTestResult;
  create_regular_user_profile: RLSProfileTestResult;
  create_own_profile: RLSProfileTestResult;
  update_admin_profile: RLSProfileTestResult;
  update_regular_user_profile: RLSProfileTestResult;
  update_own_profile: RLSProfileTestResult;
  delete_admin_profile: RLSProfileTestResult;
  delete_regular_user_profile: RLSProfileTestResult;
  delete_own_profile: RLSProfileTestResult;
}

export type RLSProfileTestAction = keyof RLSProfileTestResults;

export class TestEnvironmentError extends Error {
  constructor(
    message: string = "RLS test actions can only be run in test environment"
  ) {
    super(message);
    this.name = "TestEnvironmentError";
  }
}

export interface RLSProfileTestState {
  isRunning: boolean;
  currentAction: RLSProfileTestAction | null;
  results: Partial<RLSProfileTestResults>;
  userRole: string | null;
  error: string | null;
}
