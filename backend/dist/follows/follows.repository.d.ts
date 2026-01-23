import { PrismaService } from '../prisma/prisma.service';
export declare class FollowsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByFollowerId(followerId: string): Promise<({
        following: {
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
        followingId: string;
        followerId: string;
    })[]>;
    findByFollowingId(followingId: string): Promise<({
        follower: {
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
        followingId: string;
        followerId: string;
    })[]>;
    findByFollowerAndFollowing(followerId: string, followingId: string): Promise<{
        id: string;
        createdAt: Date;
        followingId: string;
        followerId: string;
    }>;
    create(followerId: string, followingId: string): Promise<{
        id: string;
        createdAt: Date;
        followingId: string;
        followerId: string;
    }>;
    delete(followerId: string, followingId: string): Promise<{
        id: string;
        createdAt: Date;
        followingId: string;
        followerId: string;
    }>;
}
