import { PrismaService } from '../prisma/prisma.service';
export declare class PostsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        comments: ({
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
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
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
        comments: ({
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
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<({
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        comments: ({
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
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
    })[]>;
    create(userId: string, content: string): Promise<{
        user: {
            id: string;
            username: string;
            password: string;
            avatar: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
    }>;
}
