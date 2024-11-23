import { User } from '@prisma/client';

export interface AuthUser extends Omit<User, 'password' | 'createdAt'> {
  token: string;
}
