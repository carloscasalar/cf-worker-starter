/**
 * Cloudflare Workers Starter Template
 * 
 * This template demonstrates the Ports and Adapters (Hexagonal) Architecture pattern
 * with clean separation of concerns and dependency injection.
 * 
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 * 
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from 'hono';

import { CloudflareUserRepository } from './cloudflare/CloudflareUserRepository';
import { Env } from './env';
import { UserController } from './UserController';
import { CreateUserUseCase } from './CreateUserUseCase';

const app = new Hono<{ Bindings: Env }>();

// User routes
app.post('/api/v1/users', async (c) => {
    const userRepository = new CloudflareUserRepository(c.env.DB);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const userController = new UserController(createUserUseCase, userRepository);
    return userController.createUser(c);
});

app.get('/api/v1/users/:id', async (c) => {
    const userRepository = new CloudflareUserRepository(c.env.DB);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const userController = new UserController(createUserUseCase, userRepository);
    return userController.getUserById(c);
});

app.get('/api/v1/users', async (c) => {
    const userRepository = new CloudflareUserRepository(c.env.DB);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const userController = new UserController(createUserUseCase, userRepository);
    return userController.listUsers(c);
});

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.onError((err, c) => {
    console.error('Application error:', err);
    return c.json({ error: 'Internal server error' }, 500);
});

export default app;
