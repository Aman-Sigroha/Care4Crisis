const { Client } = require('pg');
require('dotenv').config();

// Create a client for the default postgres database
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'postgres', // Connect to default postgres database
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require',
    channelbinding: 'require'
  }
});

const createDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to postgres database');

    // Check if our database already exists
    const checkResult = await client.query(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '${process.env.PGDATABASE}')`
    );

    // If database doesn't exist, create it
    if (!checkResult.rows[0].exists) {
      console.log(`Database ${process.env.PGDATABASE} does not exist, creating...`);
      await client.query(`CREATE DATABASE ${process.env.PGDATABASE}`);
      console.log(`Database ${process.env.PGDATABASE} created successfully`);
    } else {
      console.log(`Database ${process.env.PGDATABASE} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Disconnected from postgres database');
  }
};

// Run the function
createDatabase(); 