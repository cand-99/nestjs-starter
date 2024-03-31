import { User } from '@prisma/client';

export interface IUserWithoutPassword extends Omit<User, 'password'> {
  password?: string;
}
