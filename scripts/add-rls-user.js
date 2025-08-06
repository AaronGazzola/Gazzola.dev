#!/usr/bin/env node

/**
 * Script to create RLS (Row Level Security) database user
 * This script connects to the database using DATABASE_URL and creates
 * an RLS user with credentials from environment variables.
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createRLSUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    const rlsUserName = process.env.RLS_USER_NAME;
    const rlsUserPassword = process.env.RLS_USER_PASSWORD;

    if (!rlsUserName || !rlsUserPassword) {
      throw new Error('RLS_USER_NAME and RLS_USER_PASSWORD must be set in .env.local');
    }

    // Check if user already exists
    const userExistsQuery = `
      SELECT 1 FROM pg_roles WHERE rolname = $1;
    `;
    const userExistsResult = await client.query(userExistsQuery, [rlsUserName]);

    if (userExistsResult.rows.length > 0) {
      console.log(`User '${rlsUserName}' already exists. Updating password...`);
      
      // Update password for existing user
      const updatePasswordQuery = `ALTER USER "${rlsUserName}" WITH PASSWORD '${rlsUserPassword}';`;
      await client.query(updatePasswordQuery);
      console.log(`Password updated for user '${rlsUserName}'`);
    } else {
      console.log(`Creating new user '${rlsUserName}'...`);
      
      // Create new user
      const createUserQuery = `CREATE USER "${rlsUserName}" WITH PASSWORD '${rlsUserPassword}';`;
      await client.query(createUserQuery);
      console.log(`User '${rlsUserName}' created successfully`);
    }

    // Grant necessary permissions for the RLS user
    console.log('Granting permissions...');
    
    // Grant connect permission to database
    const grantConnectQuery = `GRANT CONNECT ON DATABASE neondb TO "${rlsUserName}";`;
    await client.query(grantConnectQuery);

    // Grant usage on schema
    const grantSchemaUsageQuery = `GRANT USAGE ON SCHEMA public TO "${rlsUserName}";`;
    await client.query(grantSchemaUsageQuery);

    // Note: Table permissions will be granted via migrations
    // This ensures proper version control and allows RLS policies to work correctly

    console.log('Permissions granted successfully');
    console.log(`RLS user '${rlsUserName}' is ready for use`);

  } catch (error) {
    console.error('Error creating RLS user:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the script
createRLSUser();