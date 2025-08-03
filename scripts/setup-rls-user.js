#!/usr/bin/env node

/**
 * RLS Database User Setup Script
 * 
 * This script creates a new restricted database user that will respect
 * RLS policies instead of bypassing them.
 */

const { PrismaClient } = require('../generated/prisma');
const crypto = require('crypto');

async function setupRLSUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Setting up new restricted database user for RLS...\n');
    
    // Generate a secure password
    const password = crypto.randomBytes(24).toString('hex');
    const username = 'myapp_rls_user';
    
    console.log('👤 Creating new database user...');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('   (Save this password - you\'ll need it for DATABASE_URL)\n');
    
    // Step 1: Create the new role
    console.log('📝 Step 1: Creating role...');
    try {
      await prisma.$executeRawUnsafe(`
        CREATE ROLE ${username} LOGIN PASSWORD '${password}'
      `);
      console.log('   ✅ Role created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ⚠️  Role already exists, continuing...');
      } else {
        throw error;
      }
    }
    
    // Step 2: Grant database connection
    console.log('\n📝 Step 2: Granting database connection...');
    await prisma.$executeRawUnsafe(`
      GRANT CONNECT ON DATABASE neondb TO ${username}
    `);
    console.log('   ✅ CONNECT privilege granted');
    
    // Step 3: Grant schema usage
    console.log('\n📝 Step 3: Granting schema usage...');
    await prisma.$executeRawUnsafe(`
      GRANT USAGE ON SCHEMA public TO ${username}
    `);
    console.log('   ✅ USAGE on public schema granted');
    
    // Step 4: Grant table permissions
    console.log('\n📝 Step 4: Granting table permissions...');
    await prisma.$executeRawUnsafe(`
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${username}
    `);
    console.log('   ✅ Table permissions granted');
    
    // Step 5: Grant sequence permissions (for auto-increment IDs)
    console.log('\n📝 Step 5: Granting sequence permissions...');
    await prisma.$executeRawUnsafe(`
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${username}
    `);
    console.log('   ✅ Sequence permissions granted');
    
    // Step 6: Grant permissions on future tables (important for migrations)
    console.log('\n📝 Step 6: Setting default privileges...');
    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public 
      GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${username}
    `);
    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public 
      GRANT USAGE, SELECT ON SEQUENCES TO ${username}
    `);
    console.log('   ✅ Default privileges set for future objects');
    
    // Step 7: Verify the user doesn't have bypass privileges
    console.log('\n📝 Step 7: Verifying RLS compliance...');
    const userCheck = await prisma.$queryRawUnsafe(`
      SELECT 
        rolname,
        rolsuper as is_superuser,
        rolbypassrls as can_bypass_rls
      FROM pg_roles 
      WHERE rolname = '${username}'
    `);
    
    const user = userCheck[0];
    if (user) {
      console.log(`   User: ${user.rolname}`);
      console.log(`   Superuser: ${user.is_superuser ? '❌ YES (problematic)' : '✅ NO'}`);
      console.log(`   Bypass RLS: ${user.can_bypass_rls ? '❌ YES (problematic)' : '✅ NO'}`);
      
      if (!user.is_superuser && !user.can_bypass_rls) {
        console.log('   ✅ User is properly restricted for RLS');
      } else {
        console.log('   ❌ User has bypass privileges - this may cause issues');
      }
    }
    
    // Step 8: Provide DATABASE_URL
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Update your DATABASE_URL in .env.local:');
    
    // Get current database info
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        inet_server_addr() as host,
        inet_server_port() as port
    `;
    
    const currentUrl = process.env.DATABASE_URL;
    if (currentUrl) {
      // Parse current URL to get host, port, etc.
      const urlMatch = currentUrl.match(/postgresql:\/\/[^:]+:[^@]+@([^:]+):?(\d+)?\/(.+?)(\?.*)?$/);
      if (urlMatch) {
        const [, host, port, database, params] = urlMatch;
        const newUrl = `postgresql://${username}:${password}@${host}${port ? ':' + port : ''}/${database}${params || ''}`;
        console.log(`   DATABASE_URL="${newUrl}"`);
      } else {
        console.log(`   DATABASE_URL="postgresql://${username}:${password}@YOUR_HOST:YOUR_PORT/neondb"`);
      }
    } else {
      console.log(`   DATABASE_URL="postgresql://${username}:${password}@YOUR_HOST:YOUR_PORT/neondb"`);
    }
    
    console.log('\n2. Restart your application');
    console.log('3. Run the RLS tests to verify everything works');
    console.log('\n⚠️  Important: Save the password above - you cannot retrieve it later!');
    
  } catch (error) {
    console.error('❌ Error setting up RLS user:', error);
    
    if (error.message.includes('permission denied')) {
      console.log('\n💡 Permission denied - you may need to:');
      console.log('   • Run this script with a superuser database connection');
      console.log('   • Or ask your database administrator to create the user');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupRLSUser().catch(console.error);