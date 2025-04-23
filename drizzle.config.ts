import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
// Load vars from .env.local
dotenv.config({ path: '.env.local' });

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env.local');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  // PostgreSQL dialect
  dialect: 'postgresql',
  dbCredentials: {
    // Use URL for DB connection
    url: process.env.DATABASE_URL!,
  },
});
