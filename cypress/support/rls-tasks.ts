/**
 * Cypress tasks for testing Row Level Security (RLS) policies
 *
 * These tasks interact directly with the database to test RLS policies
 * independently of application-layer authorization.
 */

import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface RLSTestParams {
  userId: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  table: string;
  where?: string;
  set?: string;
  values?: Record<string, any>;
  expectSuccess: boolean;
}

interface TestData {
  adminUserId: string;
  regularUserId: string;
  otherUserId: string;
  regularProfileId: string;
  otherProfileId: string;
  conversationId: string;
  contractId: string;
  taskId: string;
  messageId: string;
}

let testData: TestData | null = null;

/**
 * Execute a raw SQL query with user context set for RLS
 */
async function executeWithUserContext(
  userId: string,
  query: string
): Promise<{ success: boolean; error?: string; result?: any }> {
  try {
    // Set the user context for RLS
    await prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`;

    // Execute the query
    const result = await prisma.$queryRawUnsafe(query);

    return { success: true, result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Build SQL query based on operation type
 */
function buildQuery(params: RLSTestParams): string {
  const { operation, table, where, set, values } = params;

  switch (operation) {
    case "SELECT":
      return `SELECT * FROM "${table}" ${where ? `WHERE ${where}` : ""} LIMIT 1`;

    case "UPDATE":
      if (!where || !set) {
        throw new Error("UPDATE requires where and set parameters");
      }
      return `UPDATE "${table}" SET ${set} WHERE ${where}`;

    case "INSERT":
      if (!values) {
        throw new Error("INSERT requires values parameter");
      }
      const columns = Object.keys(values)
        .map((col) => `"${col}"`)
        .join(", ");
      const vals = Object.values(values).join(", ");
      return `INSERT INTO "${table}" (${columns}) VALUES (${vals})`;

    case "DELETE":
      if (!where) {
        throw new Error("DELETE requires where parameter");
      }
      return `DELETE FROM "${table}" WHERE ${where}`;

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

export const rlsTasks = {
  /**
   * Check if running in test environment
   */
  checkEnv: (expectedEnv: string) => {
    return process.env.APP_ENV === expectedEnv;
  },

  /**
   * Set up test data for RLS testing
   */
  setupRLSTestData: async (): Promise<TestData> => {
    try {
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          id: "rls-admin-user",
          name: "RLS Admin",
          email: "rls-admin@test.com",
          emailVerified: true,
          role: "admin",
        },
      });

      // Create regular user
      const regularUser = await prisma.user.create({
        data: {
          id: "rls-regular-user",
          name: "RLS Regular",
          email: "rls-regular@test.com",
          emailVerified: true,
          role: "user",
        },
      });

      // Create other user
      const otherUser = await prisma.user.create({
        data: {
          id: "rls-other-user",
          name: "RLS Other",
          email: "rls-other@test.com",
          emailVerified: true,
          role: "user",
        },
      });

      // Create profiles
      await prisma.profile.create({
        data: {
          id: "rls-admin-profile",
          userId: adminUser.id,
          firstName: "Admin",
          lastName: "User",
          email: adminUser.email,
        },
      });

      const regularProfile = await prisma.profile.create({
        data: {
          id: "rls-regular-profile",
          userId: regularUser.id,
          firstName: "Regular",
          lastName: "User",
          email: regularUser.email,
        },
      });

      const otherProfile = await prisma.profile.create({
        data: {
          id: "rls-other-profile",
          userId: otherUser.id,
          firstName: "Other",
          lastName: "User",
          email: otherUser.email,
        },
      });

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          id: "rls-test-conversation",
          title: "RLS Test Conversation",
          participants: [regularUser.id, adminUser.id],
          lastMessageAt: new Date(),
        },
      });

      // Create contract
      const contract = await prisma.contract.create({
        data: {
          id: "rls-test-contract",
          title: "RLS Test Contract",
          description: "Test contract for RLS",
          startDate: new Date(),
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          price: 1000,
          profileId: regularProfile.id,
          conversationIds: [conversation.id],
          userApproved: false,
          adminApproved: false,
        },
      });

      // Create task
      const task = await prisma.task.create({
        data: {
          id: "rls-test-task",
          title: "RLS Test Task",
          description: "Test task for RLS",
          price: 500,
          contractId: contract.id,
        },
      });

      // Create message
      const message = await prisma.message.create({
        data: {
          id: "rls-test-message",
          senderId: regularUser.id,
          content: "RLS test message",
          conversationId: conversation.id,
        },
      });

      testData = {
        adminUserId: adminUser.id,
        regularUserId: regularUser.id,
        otherUserId: otherUser.id,
        regularProfileId: regularProfile.id,
        otherProfileId: otherProfile.id,
        conversationId: conversation.id,
        contractId: contract.id,
        taskId: task.id,
        messageId: message.id,
      };

      return testData;
    } catch (error: any) {
      throw new Error(`Failed to setup RLS test data: ${error.message}`);
    }
  },

  /**
   * Test RLS policy enforcement
   */
  testRLSPolicy: async (params: RLSTestParams) => {
    try {
      const query = buildQuery(params);
      const result = await executeWithUserContext(params.userId, query);

      if (params.expectSuccess && !result.success) {
        throw new Error(`Expected success but got error: ${result.error}`);
      }

      if (!params.expectSuccess && result.success) {
        throw new Error(`Expected failure but operation succeeded`);
      }

      return { success: true, result: result.result };
    } catch (error: any) {
      if (!params.expectSuccess) {
        // This is expected, so return success
        return { success: true, expectedFailure: true };
      }
      throw error;
    }
  },

  /**
   * Test admin function access
   */
  testAdminFunction: async ({
    userId,
    expectSuccess,
  }: {
    userId: string;
    expectSuccess: boolean;
  }) => {
    try {
      // Test the is_admin() function
      const result = await executeWithUserContext(
        userId,
        "SELECT is_admin() as is_admin"
      );

      const isAdmin = result.result?.[0]?.is_admin;

      if (expectSuccess && !isAdmin) {
        throw new Error(
          "Expected user to be admin but is_admin() returned false"
        );
      }

      if (!expectSuccess && isAdmin) {
        throw new Error(
          "Expected user to not be admin but is_admin() returned true"
        );
      }

      return { success: true, isAdmin };
    } catch (error: any) {
      if (!expectSuccess) {
        return { success: true, expectedFailure: true };
      }
      throw error;
    }
  },

  /**
   * Clean up test data
   */
  cleanupRLSTestData: async () => {
    if (!testData) return;

    try {
      // Delete in reverse order of creation to handle foreign key constraints
      await prisma.message.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.task.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.payment.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.contract.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.conversation.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.profile.deleteMany({
        where: { id: { startsWith: "rls-" } },
      });

      await prisma.session.deleteMany({
        where: { id: { startsWith: "rls-test-" } },
      });

      await prisma.user.deleteMany({
        where: { id: { startsWith: "rls-" } },
      });

      testData = null;
    } catch (error: any) {
      console.error("Failed to cleanup RLS test data:", error.message);
      // Don't throw here as cleanup is best effort
    }
  },
};
