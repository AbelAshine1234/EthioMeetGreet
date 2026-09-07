import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ethiomeetgreet',
});

// Helper for queries
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Connection test with retry logic for docker startup
export const waitForDb = async (retries = 15, delayMs = 2000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL database.');
      client.release();
      return;
    } catch (err: any) {
      console.log(`Waiting for database... (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error('Could not connect to database after multiple retries.');
};
