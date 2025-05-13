const { Pool } = require('pg');
require('dotenv').config();

// Log database connection parameters (without exposing sensitive info)
console.log('Database configuration:');
console.log('- Host:', process.env.PGHOST ? 'Configured' : 'Missing');
console.log('- Database:', process.env.PGDATABASE ? 'Configured' : 'Missing');
console.log('- User:', process.env.PGUSER ? 'Configured' : 'Missing');
console.log('- Port:', process.env.PGPORT || 5432);
console.log('- SSL:', process.env.NODE_ENV === 'production' ? 'Enabled with rejectUnauthorized:false' : 'Disabled');

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to the database successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
  // Don't exit process on connection error - this would crash the app
  // Instead, we'll let the app handle failed database operations gracefully
});

// Initial connection test
(async () => {
  try {
    const client = await pool.connect();
    console.log('Initial database connection test: SUCCESS');
    client.release();
  } catch (err) {
    console.error('Initial database connection test: FAILED');
    console.error('Error details:', err.message);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 