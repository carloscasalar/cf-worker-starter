# SEED

This folder is to place any seeding and bootstrapping tool and scripts.

## Schema Generation

The `schema.sql` file contains the database schema for the application. You can regenerate it using the provided script:

```bash
npm run schema:generate
```

This will write the schema to `seed/schema.sql` using the content defined in `src/generate-schema-sql.ts`.

## Available Scripts

- `npm run schema:generate` - Generate the database schema file
- `npm run vectorize` - Run vectorize index operations
