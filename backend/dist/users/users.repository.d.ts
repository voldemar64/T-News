import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
