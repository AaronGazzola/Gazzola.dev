#!/usr/bin/env node

/**
 * Database User Privileges Checker
 * 
 * This script checks if the database user configured in DATABASE_URL
 * has privileges that would bypass RLS (Row Level Security) policies.
 */

const { PrismaClient } = require('../generated/prisma');

async function checkDatabaseUserPrivileges() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database user privileges...\n');
    
    // Get current user info
    const currentUserQuery = await prisma.$queryRaw`
      SELECT current_user as username, current_database() as database_name
    `;
    const currentUser = currentUserQuery[0];
    
    console.log(`📋 Database: ${currentUser.database_name}`);
    console.log(`👤 Current User: ${currentUser.username}\n`);
    
    // Check superuser status
    console.log('🔐 Checking superuser privileges...');
    const superuserCheck = await prisma.$queryRaw`
      SELECT 
        rolname,
        rolsuper as is_superuser,
        rolbypassrls as can_bypass_rls,
        rolcreaterole as can_create_roles,
        rolcreatedb as can_create_databases,
        rolreplication as can_replicate
      FROM pg_roles 
      WHERE rolname = current_user
    `;
    
    const userPrivileges = superuserCheck[0];
    
    // Display privilege status
    console.log(`   Superuser: ${userPrivileges.is_superuser ? '❌ YES (bypasses all RLS)' : '✅ NO'}`);
    console.log(`   Bypass RLS: ${userPrivileges.can_bypass_rls ? '❌ YES (bypasses all RLS)' : '✅ NO'}`);
    console.log(`   Create Roles: ${userPrivileges.can_create_roles ? '⚠️  YES' : 'NO'}`);
    console.log(`   Create Databases: ${userPrivileges.can_create_databases ? '⚠️  YES' : 'NO'}`);
    console.log(`   Replication: ${userPrivileges.can_replicate ? '⚠️  YES' : 'NO'}\n`);
    
    // Check role memberships that might grant bypass privileges
    console.log('👥 Checking role memberships...');
    const roleMemberships = await prisma.$queryRaw`
      SELECT 
        r.rolname as role_name,
        r.rolsuper as role_is_superuser,
        r.rolbypassrls as role_can_bypass_rls
      FROM pg_auth_members m
      JOIN pg_roles r ON m.roleid = r.oid
      WHERE m.member = (SELECT oid FROM pg_roles WHERE rolname = current_user)
    `;
    
    if (roleMemberships.length > 0) {
      roleMemberships.forEach(role => {
        const bypassWarning = role.role_is_superuser || role.role_can_bypass_rls ? '❌ (bypasses RLS)' : '✅';
        console.log(`   Member of: ${role.role_name} ${bypassWarning}`);
      });
    } else {
      console.log('   No role memberships found ✅');
    }
    
    // Check for cloud-specific roles (AWS RDS, Neon, etc.)
    console.log('\n☁️  Checking for cloud-specific privileges...');
    try {
      const cloudRoles = await prisma.$queryRaw`
        SELECT 
          CASE WHEN pg_has_role(current_user, 'rds_superuser', 'MEMBER') THEN 'rds_superuser'
               WHEN pg_has_role(current_user, 'rds_iam', 'MEMBER') THEN 'rds_iam'
               WHEN pg_has_role(current_user, 'rds_replication', 'MEMBER') THEN 'rds_replication'
               ELSE NULL
          END as cloud_role
      `;
      
      const hasCloudRole = cloudRoles[0]?.cloud_role;
      if (hasCloudRole) {
        const isProblematic = hasCloudRole === 'rds_superuser';
        console.log(`   AWS RDS Role: ${hasCloudRole} ${isProblematic ? '❌ (may bypass RLS)' : '⚠️'}`);
      } else {
        console.log('   No AWS RDS special roles detected ✅');
      }
    } catch (error) {
      // Likely not AWS RDS, check for other cloud providers
      console.log('   Not AWS RDS environment ✅');
    }
    
    // Test RLS functions
    console.log('\n🧪 Testing RLS functions...');
    try {
      const rlsTest = await prisma.$queryRaw`
        SELECT 
          get_current_user_id() as current_user_id,
          is_current_user_admin() as is_admin
      `;
      
      console.log(`   get_current_user_id(): ${rlsTest[0].current_user_id || 'NULL/Empty'}`);
      console.log(`   is_current_user_admin(): ${rlsTest[0].is_admin}`);
    } catch (error) {
      console.log(`   ❌ RLS functions error: ${error.message}`);
    }
    
    // Check if RLS is enabled on profile table
    console.log('\n📊 Checking RLS status on tables...');
    const rlsStatus = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('user', 'profile', 'contract', 'conversation', 'message')
      ORDER BY tablename
    `;
    
    rlsStatus.forEach(table => {
      console.log(`   ${table.tablename}: RLS ${table.rls_enabled ? '✅ Enabled' : '❌ Disabled'}`);
    });
    
    // Summary and recommendations
    console.log('\n📋 SUMMARY:');
    const hasPrivilegeIssues = userPrivileges.is_superuser || userPrivileges.can_bypass_rls;
    const hasRoleIssues = roleMemberships.some(r => r.role_is_superuser || r.role_can_bypass_rls);
    const hasCloudIssues = false; // Will be set to true if we detect problematic cloud roles
    
    if (hasPrivilegeIssues || hasRoleIssues || hasCloudIssues) {
      console.log('❌ ISSUE DETECTED: Database user has privileges that bypass RLS!');
      console.log('\n💡 RECOMMENDATIONS:');
      
      if (userPrivileges.is_superuser) {
        console.log('   • Create a new database user without superuser privileges');
        console.log('   • Example: CREATE ROLE myapp_user LOGIN PASSWORD \'password\';');
      }
      
      if (userPrivileges.can_bypass_rls) {
        console.log('   • Remove BYPASSRLS attribute from the user');
        console.log(`   • Example: ALTER ROLE ${currentUser.username} NOBYPASSRLS;`);
      }
      
      if (hasRoleIssues) {
        console.log('   • Remove user from privileged roles that bypass RLS');
      }
      
      if (hasCloudIssues) {
        console.log('   • Use a less privileged user instead of rds_superuser role');
      }
      
      console.log('   • Update your DATABASE_URL to use the new restricted user');
    } else {
      console.log('✅ Database user looks good - no RLS bypass privileges detected');
      console.log('   The RLS issue may be elsewhere (policy logic, transaction context, etc.)');
    }
    
  } catch (error) {
    console.error('❌ Error checking database privileges:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabaseUserPrivileges().catch(console.error);