import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByPostId(postId: string): Promise<({
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        postId: string;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        postId: string;
    }>;
    create(userId: string, postId: string, content: string): Promise<{
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        postId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        postId: string;
    }>;
}
