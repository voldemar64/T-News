"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeedService = class FeedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFeed(userId) {
        const follows = await this.prisma.follow.findMany({
            where: { followerId: userId },
        });
        const followingIds = follows.map((follow) => follow.followingId);
        if (followingIds.length === 0) {
            return [];
        }
        const posts = await this.prisma.post.findMany({
            where: {
                userId: {
                    in: followingIds,
                },
            },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts.map((post) => ({
            id: post.id,
            userId: post.userId,
            content: post.content,
            likes: post._count.likes,
            comments: post.comments.map((comment) => ({
                id: comment.id,
                userId: comment.userId,
                content: comment.content,
                user: comment.user
                    ? {
                        id: comment.user.id,
                        username: comment.user.username,
                        avatar: comment.user.avatar,
                        bio: comment.user.bio,
                    }
                    : undefined,
            })),
            user: post.user
                ? {
                    id: post.user.id,
                    username: post.user.username,
                    avatar: post.user.avatar,
                    bio: post.user.bio,
                }
                : undefined,
        }));
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedService);
//# sourceMappingURL=feed.service.js.map