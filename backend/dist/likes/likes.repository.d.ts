import { PrismaService } from '../prisma/prisma.service';
export declare class LikesRepository {
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
        userId: string;
        postId: string;
    })[]>;
    findByUserAndPost(userId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        postId: string;
    }>;
    create(userId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        postId: string;
    }>;
    delete(userId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        postId: string;
    }>;
    countByPostId(postId: string): Promise<number>;
}
