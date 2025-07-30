/**
 * Row Level Security (RLS) Policy Tests
 * 
 * These tests verify that RLS policies correctly enforce access controls
 * at the database level, independent of application-layer authorization.
 * 
 * Tests run only in test environment (APP_ENV="test")
 */

describe('Row Level Security Policies', () => {
  let adminUserId: string;
  let regularUserId: string;
  let otherUserId: string;
  let regularProfileId: string;
  let otherProfileId: string;
  let conversationId: string;
  let contractId: string;
  let taskId: string;
  let messageId: string;

  before(() => {
    // Only run in test environment
    cy.task('checkEnv', 'test').then((isTest) => {
      if (!isTest) {
        throw new Error('RLS tests can only run in test environment');
      }
    });

    // Set up test data
    cy.task('setupRLSTestData').then((data: any) => {
      adminUserId = data.adminUserId;
      regularUserId = data.regularUserId;
      otherUserId = data.otherUserId;
      regularProfileId = data.regularProfileId;
      otherProfileId = data.otherProfileId;
      conversationId = data.conversationId;
      contractId = data.contractId;
      taskId = data.taskId;
      messageId = data.messageId;
    });
  });

  after(() => {
    // Clean up test data
    cy.task('cleanupRLSTestData');
  });

  describe('User Table Policies', () => {
    it('allows users to view their own record', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${regularUserId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing other user records', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${otherUserId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all user records', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${otherUserId}'`,
        expectSuccess: true
      });
    });

    it('allows users to update their own record', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'user',
        where: `id = '${regularUserId}'`,
        set: `name = 'Updated Name'`,
        expectSuccess: true
      });
    });

    it('prevents users from updating other user records', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'user',
        where: `id = '${otherUserId}'`,
        set: `name = 'Hacked Name'`,
        expectSuccess: false
      });
    });
  });

  describe('Profile Table Policies', () => {
    it('allows users to view their own profile', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'profile',
        where: `"userId" = '${regularUserId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing other profiles', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'profile',
        where: `"userId" = '${otherUserId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all profiles', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'profile',
        where: `"userId" = '${otherUserId}'`,
        expectSuccess: true
      });
    });

    it('allows users to update their own profile', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'profile',
        where: `"userId" = '${regularUserId}'`,
        set: `"firstName" = 'Updated'`,
        expectSuccess: true
      });
    });

    it('prevents users from updating other profiles', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'profile',
        where: `"userId" = '${otherUserId}'`,
        set: `"firstName" = 'Hacked'`,
        expectSuccess: false
      });
    });
  });

  describe('Conversation Table Policies', () => {
    it('allows users to view conversations they participate in', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'conversation',
        where: `id = '${conversationId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing conversations they do not participate in', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'conversation',
        where: `id = '${conversationId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all conversations', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'conversation',
        where: `id = '${conversationId}'`,
        expectSuccess: true
      });
    });

    it('prevents regular users from creating conversations (admin only)', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'conversation',
        values: {
          id: 'test-conv-1',
          title: 'Test Conversation',
          participants: `ARRAY['${regularUserId}','${adminUserId}']`,
          lastMessageAt: 'NOW()'
        },
        expectSuccess: false
      });
    });

    it('allows admins to create conversations', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'INSERT',
        table: 'conversation',
        values: {
          id: 'test-conv-2',
          title: 'Admin Conversation',
          participants: `ARRAY['${otherUserId}','${adminUserId}']`,
          lastMessageAt: 'NOW()'
        },
        expectSuccess: true
      });
    });
  });

  describe('Message Table Policies', () => {
    it('allows users to view messages in their conversations', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'message',
        where: `id = '${messageId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing messages in conversations they do not participate in', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'message',
        where: `id = '${messageId}'`,
        expectSuccess: false
      });
    });

    it('allows users to send messages as themselves in their conversations', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'message',
        values: {
          id: 'test-msg-1',
          senderId: `'${regularUserId}'`,
          content: 'Test message',
          conversationId: `'${conversationId}'`
        },
        expectSuccess: true
      });
    });

    it('prevents users from sending messages as other users', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'message',
        values: {
          id: 'test-msg-2',
          senderId: `'${otherUserId}'`,
          content: 'Spoofed message',
          conversationId: `'${conversationId}'`
        },
        expectSuccess: false
      });
    });

    it('prevents users from sending messages to conversations they do not participate in', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'INSERT',
        table: 'message',
        values: {
          id: 'test-msg-3',
          senderId: `'${otherUserId}'`,
          content: 'Unauthorized message',
          conversationId: `'${conversationId}'`
        },
        expectSuccess: false
      });
    });
  });

  describe('Contract Table Policies', () => {
    it('allows users to view their own contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'contract',
        where: `id = '${contractId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'contract',
        where: `id = '${contractId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all contracts', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'contract',
        where: `id = '${contractId}'`,
        expectSuccess: true
      });
    });

    it('allows users to update their own contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'contract',
        where: `id = '${contractId}'`,
        set: `title = 'Updated Contract'`,
        expectSuccess: true
      });
    });

    it('prevents users from updating other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'UPDATE',
        table: 'contract',
        where: `id = '${contractId}'`,
        set: `title = 'Hacked Contract'`,
        expectSuccess: false
      });
    });

    it('allows users to create contracts for themselves', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'contract',
        values: {
          id: 'test-contract-1',
          title: 'Test Contract',
          description: 'Test Description',
          startDate: 'NOW()',
          targetDate: 'NOW() + INTERVAL \'30 days\'',
          dueDate: 'NOW() + INTERVAL \'60 days\'',
          price: 1000,
          profileId: `'${regularProfileId}'`,
          conversationIds: 'ARRAY[]::text[]',
          userApproved: 'false',
          adminApproved: 'false'
        },
        expectSuccess: true
      });
    });

    it('prevents users from creating contracts for other users', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'contract',
        values: {
          id: 'test-contract-2',
          title: 'Unauthorized Contract',
          description: 'Unauthorized Description',
          startDate: 'NOW()',
          targetDate: 'NOW() + INTERVAL \'30 days\'',
          dueDate: 'NOW() + INTERVAL \'60 days\'',
          price: 1000,
          profileId: `'${otherProfileId}'`,
          conversationIds: 'ARRAY[]::text[]',
          userApproved: 'false',
          adminApproved: 'false'
        },
        expectSuccess: false
      });
    });
  });

  describe('Task Table Policies', () => {
    it('allows users to view tasks in their unpaid contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'task',
        where: `id = '${taskId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing tasks in other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'task',
        where: `id = '${taskId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all tasks', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'task',
        where: `id = '${taskId}'`,
        expectSuccess: true
      });
    });

    it('allows users to update tasks in their unpaid contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'task',
        where: `id = '${taskId}'`,
        set: `title = 'Updated Task'`,
        expectSuccess: true
      });
    });

    it('prevents users from updating tasks in other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'UPDATE',
        table: 'task',
        where: `id = '${taskId}'`,
        set: `title = 'Hacked Task'`,
        expectSuccess: false
      });
    });

    it('allows users to create tasks in their unpaid contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'task',
        values: {
          id: 'test-task-1',
          title: 'New Task',
          description: 'Task description',
          price: 500,
          contractId: `'${contractId}'`
        },
        expectSuccess: true
      });
    });

    it('prevents users from creating tasks in other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'INSERT',
        table: 'task',
        values: {
          id: 'test-task-2',
          title: 'Unauthorized Task',
          description: 'Unauthorized task description',
          price: 500,
          contractId: `'${contractId}'`
        },
        expectSuccess: false
      });
    });

    it('allows users to delete tasks in their unpaid contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'DELETE',
        table: 'task',
        where: `id = '${taskId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from deleting tasks in other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'DELETE',
        table: 'task',
        where: `id = '${taskId}'`,
        expectSuccess: false
      });
    });
  });

  describe('Payment Table Policies', () => {
    it('allows users to view payments for their contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'payment',
        where: `"contractId" = '${contractId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing payments for other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'payment',
        where: `"contractId" = '${contractId}'`,
        expectSuccess: false
      });
    });

    it('allows admins to view all payments', () => {
      cy.task('testRLSPolicy', {
        userId: adminUserId,
        operation: 'SELECT',
        table: 'payment',
        where: `"contractId" = '${contractId}'`,
        expectSuccess: true
      });
    });

    it('allows users to create payments for their contracts', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'payment',
        values: {
          id: 'test-payment-1',
          contractId: `'${contractId}'`,
          stripeSessionId: 'test-session-1',
          amount: 1000,
          currency: 'usd',
          status: 'pending'
        },
        expectSuccess: true
      });
    });

    it('prevents users from creating payments for other user contracts', () => {
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'INSERT',
        table: 'payment',
        values: {
          id: 'test-payment-2',
          contractId: `'${contractId}'`,
          stripeSessionId: 'test-session-2',
          amount: 1000,
          currency: 'usd',
          status: 'pending'
        },
        expectSuccess: false
      });
    });
  });

  describe('Session Table Policies', () => {
    it('allows users to view their own sessions', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'session',
        where: `"userId" = '${regularUserId}'`,
        expectSuccess: true
      });
    });

    it('prevents users from viewing other user sessions', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'session',
        where: `"userId" = '${otherUserId}'`,
        expectSuccess: false
      });
    });

    it('allows users to create their own sessions', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'session',
        values: {
          id: 'test-session-1',
          expiresAt: 'NOW() + INTERVAL \'7 days\'',
          token: 'test-token-1',
          userId: `'${regularUserId}'`
        },
        expectSuccess: true
      });
    });

    it('prevents users from creating sessions for other users', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'INSERT',
        table: 'session',
        values: {
          id: 'test-session-2',
          expiresAt: 'NOW() + INTERVAL \'7 days\'',
          token: 'test-token-2',
          userId: `'${otherUserId}'`
        },
        expectSuccess: false
      });
    });
  });

  describe('Admin Privilege Escalation Tests', () => {
    it('prevents regular users from escalating to admin', () => {
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'UPDATE',
        table: 'user',
        where: `id = '${regularUserId}'`,
        set: `role = 'admin'`,
        expectSuccess: true // Update will succeed but won't grant admin privileges for subsequent operations
      });

      // Verify that even after setting role to admin, user cannot access admin-only data
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${otherUserId}'`,
        expectSuccess: false // Should still fail because RLS uses current session context
      });
    });

    it('verifies admin functions work only for actual admins', () => {
      // Regular user should not be able to use admin functions even if they modify their role
      cy.task('testAdminFunction', {
        userId: regularUserId,
        expectSuccess: false
      });

      // Actual admin should be able to use admin functions
      cy.task('testAdminFunction', {
        userId: adminUserId,
        expectSuccess: true
      });
    });
  });

  describe('Context Isolation Tests', () => {
    it('ensures user context isolation between operations', () => {
      // Set context as regular user and verify access
      cy.task('testRLSPolicy', {
        userId: regularUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${regularUserId}'`,
        expectSuccess: true
      });

      // Immediately test with other user context in same test
      cy.task('testRLSPolicy', {
        userId: otherUserId,
        operation: 'SELECT',
        table: 'user',
        where: `id = '${regularUserId}'`,
        expectSuccess: false
      });
    });

    it('ensures no data leakage between user contexts', () => {
      // Test that changing context properly isolates data access
      const testData = [
        { userId: regularUserId, shouldAccess: regularUserId },
        { userId: otherUserId, shouldAccess: otherUserId },
        { userId: adminUserId, shouldAccess: regularUserId } // Admin can access all
      ];

      testData.forEach(({ userId, shouldAccess }) => {
        cy.task('testRLSPolicy', {
          userId,
          operation: 'SELECT',
          table: 'user',
          where: `id = '${shouldAccess}'`,
          expectSuccess: userId === adminUserId || userId === shouldAccess
        });
      });
    });
  });
});