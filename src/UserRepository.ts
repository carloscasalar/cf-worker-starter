import { User } from './User';
import { ErrorAware } from './types/returnTypes';

export interface UserRepository {
    save(user: User): Promise<ErrorAware<User>>;
    findById(id: string): Promise<ErrorAware<User>>;
    findAll(): Promise<ErrorAware<User[]>>;
}
