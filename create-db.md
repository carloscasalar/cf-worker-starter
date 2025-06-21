# Database Setup Instructions

This document provides instructions for setting up the D1 database for the Cloudflare Workers Starter Template.

## Prerequisites

- Cloudflare account with D1 enabled
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Create D1 Database

```bash
# Create a new D1 database
wrangler d1 create cf-worker-starter-db

# This will output something like:
# ✅ Created D1 database 'cf-worker-starter-db' (ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

## Step 2: Update wrangler.toml

Add the database binding to your `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "cf-worker-starter-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Use the ID from step 1
```

## Step 3: Create Database Schema

You have two options for creating the database schema:

### Option A: Use the Schema Generation Script (Recommended)

```bash
# Navigate to the seed directory
cd seed

# Generate the schema file
npm run schema:generate
```

This will automatically create `seed/schema.sql` with the correct schema content.

### Option B: Create the Schema File Manually

Create a file called `seed/schema.sql` with the following content:

```sql
-- Users table for the Cloudflare Workers Starter Template
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
```

## Step 4: Apply the Schema

```bash
# Apply the schema to your D1 database
wrangler d1 execute cf-worker-starter-db --file=./seed/schema.sql
```

## Step 5: Verify Setup

You can verify the setup by running:

```bash
# List all tables
wrangler d1 execute cf-worker-starter-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check the users table structure
wrangler d1 execute cf-worker-starter-db --command="PRAGMA table_info(users);"
```

## Step 6: Test the API

Once your database is set up, you can test the API:

```bash
# Start the development server
npm run dev

# Create a test user
curl -X POST http://localhost:8787/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# List all users
curl http://localhost:8787/api/v1/users
```

## Additional Database Operations

### View Data

```bash
# View all users
wrangler d1 execute cf-worker-starter-db --command="SELECT * FROM users;"
```

### Reset Database

```bash
# Drop and recreate the users table
wrangler d1 execute cf-worker-starter-db --command="DROP TABLE IF EXISTS users;"
wrangler d1 execute cf-worker-starter-db --file=./seed/schema.sql
```

### Backup Database

```bash
# Export database to SQL file
wrangler d1 export cf-worker-starter-db --output=backup.sql
```

## Troubleshooting

### Common Issues

1. **Database not found**: Make sure the database ID in `wrangler.toml` matches the one created
2. **Permission errors**: Ensure you're logged in with `wrangler login`
3. **Binding errors**: Check that the binding name in `wrangler.toml` matches `src/env.ts`

### Getting Help

- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)
