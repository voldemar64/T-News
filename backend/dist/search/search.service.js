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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchUsers(query) {
        const users = await this.prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
        });
        return users.map((user) => {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        });
    }
    async searchPosts(query) {
        const posts = await this.prisma.post.findMany({
            where: {
                content: {
                    contains: query,
                    mode: 'insensitive',
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
    async search(query, type) {
        if (type === 'users') {
            return this.searchUsers(query);
        }
        else {
            return this.searchPosts(query);
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map