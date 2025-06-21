# Cloudflare Workers Starter Template

This template provides a starting point for building pet projects taking advantage of the Cloudflare Workers ecosystem.

## 🏗️ Architecture

This project follows the **Ports and Adapters Architecture** pattern but with no explicit layer separation:

- **Domain Entities**: Core business concepts (interfaces/classes).
- **Ports**: Define contracts (interfaces) that your application expects.
- **Adapters**: Implement those contracts for specific infrastructure (Cloudflare D1, AI, Vectorize).
- **Use Cases**: Restores domain entities from storage, calls business operations, triggers side-effects.
- **Controllers**: Handle HTTP requests and coordinate between layers using the Hono framework.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 24.1.0
- Cloudflare account with Workers, D1, AI, and Vectorize enabled

### Installation

1. **Clone this template**:
   ```bash
   git clone <your-repo-url>
   cd cf-worker-starter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your database** by following the instructions in [create-db.md](./create-db.md)

4. **Configure your environment** in `wrangler.toml`

5. **Run in development**:
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:8787`

## 📁 Project Structure

```
src/
├── cloudflare/           # Cloudflare-specific implementations (adapters)
│   └── CloudflareUserRepository.ts
├── json/                 # Library ports and implementations
│   ├── JsonUnmarshaler.ts
│   └── ZodJsonUnmarshaler.ts
├── types/                # Generic, reusable types only
│   └── returnTypes.ts
├── User.ts               # Domain entity (interface/class)
├── UserRepository.ts     # Port (interface)
├── CreateUserUseCase.ts  # Use case
├── UserController.ts     # HTTP controller
├── env.ts               # Environment bindings
└── index.ts             # Application entry point
```

## 🎯 Using This Template

### For New Projects

1. **Copy this template** to start a new project
2. **Remove the example code**:
   - Delete `src/User.ts`
   - Delete `src/UserRepository.ts`
   - Delete `src/CreateUserUseCase.ts`
   - Delete `src/UserController.ts`
   - Delete `src/cloudflare/CloudflareUserRepository.ts`
3. **Follow the architecture patterns** outlined in [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Add your own features** following the established patterns

### What to Keep

- ✅ **Environment setup** (`src/env.ts`) - Contains DB, VECTORIZE, and AI bindings
- ✅ **JSON unmarshaling utilities** (`src/json/`) - Useful for API validation
- ✅ **Error handling patterns** (`src/types/returnTypes.ts`)
- ✅ **Architecture patterns** - Follow the ports and adapters structure

### What to Replace

- ❌ **Example user management** - Replace with your domain logic
- ❌ **Example routes** - Add your own API endpoints
- ❌ **Example database schema** - Create tables for your domain (see `seed/src/generate-schema-sql.ts`)

## 🧪 Testing

```bash
# Run all tests (unit + integration) - suitable for CI/CD
npm test

# Run unit tests only (with watch mode)
npm run test:unit

# Run integration tests only (with watch mode)
npm run test:workers
```

### Test Status

Some integration tests are currently **skipped** because they require a database connection that isn't set up in the template:

- `validates user data correctly` - Tests user creation endpoint
- `handles user listing` - Tests user listing endpoint
- `handles user retrieval by ID` - Tests user retrieval endpoint

#### After Setting Up Your Database

If you're using the example user management code:

1. **Follow the database setup** in [create-db.md](./create-db.md)
2. **Remove the `.skip()` calls** from the tests in `test/index.spec.ts`
3. **Run the tests** to verify everything works

#### After Replacing Example Code

If you've replaced the example controllers and use cases with your own implementation:

1. **Update or remove the skipped tests** to match your new API endpoints
2. **Remove the `.skip()` calls** from tests you want to keep
3. **Add new tests** for your custom functionality

The skipped tests serve as examples of how to test Cloudflare Workers with the Hono framework and can be used as a reference for testing your own endpoints.

## 📚 API Examples

### Create a User
```bash
curl -X POST http://localhost:8787/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get User by ID
```bash
curl http://localhost:8787/api/v1/users/{user-id}
```

### List All Users
```bash
curl http://localhost:8787/api/v1/users
```

### Health Check
```bash
curl http://localhost:8787/health
```

## 🔧 Development

```bash
# Start development server
npm run dev

# Deploy to Cloudflare
npm run deploy

# Generate Cloudflare types
npm run cf-typegen
```

## 📖 Documentation

- [Contributing Guide](./CONTRIBUTING.md) - Detailed architecture patterns and guidelines
- [Database Setup](./create-db.md) - Instructions for setting up D1 database
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) - Official documentation

## 🤝 Contributing

Please read the [Contributing Guide](./CONTRIBUTING.md) for details on our architecture patterns and development workflow.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

