import { User } from './User';
import { UserRepository } from './UserRepository';
import { ErrorAware } from './types/returnTypes';

export interface CreateUserRequest {
    name: string;
    email: string;
}

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(request: CreateUserRequest): Promise<ErrorAware<User>> {
        // Simple validation
        if (!request.name || !request.email) {
            return { error: 'Name and email are required' };
        }

        if (!request.email.includes('@')) {
            return { error: 'Invalid email format' };
        }

        const user: User = {
            id: crypto.randomUUID(),
            name: request.name,
            email: request.email,
            createdAt: new Date(),
        };

        return await this.userRepository.save(user);
    }
}
