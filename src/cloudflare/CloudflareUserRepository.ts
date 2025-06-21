import { D1Database } from '@cloudflare/workers-types';
import { ErrorAware } from '../types/returnTypes';
import { User } from '../User';
import { UserRepository } from '../UserRepository';

export class CloudflareUserRepository implements UserRepository {
    constructor(private readonly db: D1Database) {}

    async save(user: User): Promise<ErrorAware<User>> {
        try {
            const result = await this.db
                .prepare('INSERT INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)')
                .bind(user.id, user.name, user.email, user.createdAt.toISOString())
                .run();

            if (result.error) {
                return { error: `Database error: ${result.error}` };
            }

            return user;
        } catch (error) {
            return { error: `Failed to save user: ${error}` };
        }
    }

    async findById(id: string): Promise<ErrorAware<User>> {
        try {
            const result = await this.db
                .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
                .bind(id)
                .first<{ id: string; name: string; email: string; created_at: string }>();

            if (!result) {
                return { error: 'User not found' };
            }

            return {
                id: result.id,
                name: result.name,
                email: result.email,
                createdAt: new Date(result.created_at),
            };
        } catch (error) {
            return { error: `Failed to find user: ${error}` };
        }
    }

    async findAll(): Promise<ErrorAware<User[]>> {
        try {
            const result = await this.db
                .prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC')
                .all<{ id: string; name: string; email: string; created_at: string }>();

            if (result.error) {
                return { error: `Database error: ${result.error}` };
            }

            return result.results.map((row) => ({
                id: row.id,
                name: row.name,
                email: row.email,
                createdAt: new Date(row.created_at),
            }));
        } catch (error) {
            return { error: `Failed to find users: ${error}` };
        }
    }
} 