import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create connection pool for better performance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 2 seconds if connection cannot be established
});

const db = drizzle(pool);

export default db;
