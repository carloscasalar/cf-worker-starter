# Contributing Guide

This project follows the **Ports and Adapters Architecture** pattern to ensure clean separation of concerns, testability, and maintainability. It starts with a flattened structure for simplicity, where the separation between layers is not explicitly enforced.
The codebase can be easily refactored to a structure based on features or, if preferred, organized into explicit layers.

## Architecture Overview

### Core Principles

1. **Dependency Inversion**: High-level modules (use cases) don't depend on low-level modules (infrastructure). Both depend on abstractions.
2. **Separation of Concerns**: Business logic is isolated from infrastructure concerns.
3. **Testability**: Dependencies can be easily mocked for unit testing.
4. **Flexibility**: Infrastructure implementations can be swapped without changing business logic.

### Project Structure

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
├── CreateUserUseCase.ts  # Use case (business logic)
├── UserController.ts     # HTTP controller
├── env.ts               # Environment bindings
└── index.ts             # Application entry point
```

## Pattern Explanation

### 1. Domain Entities

Domain entities represent your core business concepts. They can be interfaces initially and (likely) evolve into classes with behavior.

**Example**: `User.ts`
```typescript
export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}
```

### 2. Ports (Interfaces)

Ports define contracts that your application expects. They are pure interfaces that don't depend on any external libraries or frameworks.

**Example**: `UserRepository.ts`
```typescript
export interface UserRepository {
    save(user: User): Promise<ErrorAware<User>>;
    findById(id: string): Promise<ErrorAware<User>>;
    findAll(): Promise<ErrorAware<User[]>>;
}
```

### 3. Adapters (Implementations)

Adapters implement the ports and handle the integration with external systems (databases, APIs, etc.).

**Example**: `CloudflareUserRepository.ts`
```typescript
export class CloudflareUserRepository implements UserRepository {
    constructor(private readonly db: D1Database) {}
    // Implementation using Cloudflare D1
}
```

### 4. Use Cases

Use cases model a specific user case, instantiate the domain object (creating it or restoring it from storage), call the
business operations and finally store any side effect (like the domain object changing).

**Example**: `CreateUserUseCase.ts`
```typescript
export interface CreateUserRequest {
    name: string;
    email: string;
}

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(request: CreateUserRequest): Promise<ErrorAware<User>> {
        // Instantiate a new user
        // Persist the user
        // Maybe notify the user creation somewhere
    }
}
```

### 5. Controllers

Controllers handle HTTP requests and coordinate between the web layer and use cases.

**Example**: `UserController.ts`
```typescript
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly userRepository: UserRepository
    ) {}
    // HTTP request handling
}
```

## Guidelines for Adding New Features

### 1. Define the Domain Entity First

Start by defining your domain entity:

```typescript
// src/Product.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
}
```

### 2. Define the Port

Create the interface that your use case will depend on:

```typescript
// src/ProductRepository.ts
export interface ProductRepository {
    save(product: Product): Promise<ErrorAware<Product>>;
    findById(id: string): Promise<ErrorAware<Product>>;
}
```

### 3. Create the Use Case

Implement the calls to storage, business logic in the domain entity, trigger any side-effect using ports:

```typescript
// src/CreateProductUseCase.ts
export interface CreateProductRequest {
    name: string;
    price: number;
}

export class CreateProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(request: CreateProductRequest): Promise<ErrorAware<Product>> {
        // Business logic here
        return await this.productRepository.save(product);
    }
}
```

### 4. Implement the Adapter

Create the concrete implementation for your chosen infrastructure:

```typescript
// src/cloudflare/CloudflareProductRepository.ts
export class CloudflareProductRepository implements ProductRepository {
    constructor(private readonly db: D1Database) {}

    async save(product: Product): Promise<ErrorAware<Product>> {
        // D1-specific implementation
    }
}
```

### 5. Create the Controller

Handle HTTP requests and wire up dependencies:

```typescript
// src/ProductController.ts
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly productRepository: ProductRepository
    ) {}

    async createProduct(c: Context<{ Bindings: Env }>) {
        // HTTP handling logic
    }
}
```

### 6. Add Routes

Wire everything together in your main application:

```typescript
// src/index.ts
app.post('/api/v1/products', async (c) => {
    const productRepository = new CloudflareProductRepository(c.env.DB);
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const productController = new ProductController(createProductUseCase, productRepository);
    return productController.createProduct(c);
});
```

## File Organization Rules

### Domain Entities
- **Location**: Same level as repositories (`src/Entity.ts`)
- **Purpose**: Core business concepts
- **Example**: `User.ts`, `Product.ts`, `Order.ts`

### Use Case-Specific Types
- **Location**: Same file as the use case
- **Purpose**: Request/response types specific to a single use case
- **Example**: `CreateUserRequest` in `CreateUserUseCase.ts`

### Generic Types
- **Location**: `src/types/` folder
- **Purpose**: Reusable types across the application
- **Example**: `ErrorAware<T>`, `Result<T, E>`

## Library Ports Pattern

When integrating with external libraries, we follow a similar pattern:

1. **Define a port** that abstracts the library functionality
2. **Create an implementation** that wraps the library
3. **Place both in the same folder** for convenience

**Example**: `json/` folder contains both the `JsonUnmarshaler` port and the `ZodJsonUnmarshaler` implementation.

## Testing Strategy

### Unit Tests

- Test use cases with mocked ports
- Test adapters with mocked infrastructure
- Test controllers with mocked services

### Integration Tests

- Test the full flow with real adapters
- Use test databases and external services

## Best Practices

1. **Keep ports simple**: Interfaces should be focused and minimal
2. **Implement adapters in provider folders**: Group related implementations (e.g., `cloudflare/`)
3. **Use dependency injection**: Pass dependencies through constructors
4. **Handle errors consistently**: Use the `ErrorAware<T>` pattern
5. **Keep business logic pure**: Avoid infrastructure concerns in use cases or domain entities
6. **Document interfaces**: Add JSDoc comments to ports
7. **Place domain entities and repositories together**: Just because they have a type they don't need to live in `types/` folder (this note is more for the IA)
8. **Keep use case types with use cases**: Don't extract request/response types to separate files

## Error Handling

Use the `ErrorAware<T>` pattern for consistent error handling:

```typescript
export type ErrorAware<T> = T | { error: string };

// Usage
const result: ErrorAware<User> = await userRepository.findById(id);
if ('error' in result) {
    // Handle error
} else {
    // Use result (User type)
}
```

This pattern ensures that errors are handled explicitly and consistently throughout the application.
