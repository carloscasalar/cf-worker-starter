import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// If you get type errors for Node.js, run: npm i --save-dev @types/node

async function generateSchemaScript(): Promise<void> {
  const schemaContent = `-- Users table for the Cloudflare Workers Starter Template
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
`;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(__dirname, '../schema.sql');
  try {
    await writeFile(schemaPath, schemaContent, 'utf8');
    console.log(`schema.sql has been written to ${schemaPath}`);
  } catch (err: unknown) {
    console.error('Failed to write schema.sql:', err);
    throw err;
  }
}

generateSchemaScript();
