import { ErrorAware } from './types/returnTypes';
import { User } from './User';

export interface UserRepository {
    save(user: User): Promise<ErrorAware<User>>;
    findById(id: string): Promise<ErrorAware<User>>;
    findAll(): Promise<ErrorAware<User[]>>;
} 