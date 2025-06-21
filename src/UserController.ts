import { Context } from 'hono';
import { Env } from './env';
import { CreateUserUseCase, CreateUserRequest } from './CreateUserUseCase';
import { UserRepository } from './UserRepository';

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly userRepository: UserRepository
    ) {}

    async createUser(c: Context<{ Bindings: Env }>) {
        let request: CreateUserRequest;
        try {
            request = await c.req.json<CreateUserRequest>();
        } catch (e) {
            return c.json({ error: 'Invalid JSON in request body' }, 400);
        }

        const result = await this.createUserUseCase.execute(request);
        
        if ('error' in result) {
            return c.json({ error: result.error }, 400);
        }

        return c.json(result, 201);
    }

    async getUserById(c: Context<{ Bindings: Env }>) {
        const id = c.req.param('id');
        
        if (!id) {
            return c.json({ error: 'User ID is required' }, 400);
        }

        // TODO: This could be extracted to a GetUserByIdUseCase if additional business logic is needed
        const result = await this.userRepository.findById(id);
        
        if ('error' in result) {
            return c.json({ error: result.error }, 404);
        }

        return c.json(result);
    }

    async listUsers(c: Context<{ Bindings: Env }>) {
        // TODO: This could be extracted to a ListUsersUseCase if additional business logic is needed
        const result = await this.userRepository.findAll();
        
        if ('error' in result) {
            return c.json({ error: result.error }, 500);
        }

        return c.json(result);
    }
} 