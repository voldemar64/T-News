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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const posts_repository_1 = require("./posts.repository");
let PostsService = class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async findAll() {
        const posts = await this.postsRepository.findAll();
        return posts.map((post) => this.toResponseDto(post));
    }
    async findById(id) {
        const post = await this.postsRepository.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.toResponseDto(post);
    }
    async findByUserId(userId) {
        const posts = await this.postsRepository.findByUserId(userId);
        return posts.map((post) => this.toResponseDto(post));
    }
    async create(userId, createPostDto) {
        const post = await this.postsRepository.create(userId, createPostDto.content);
        return this.toResponseDto(post);
    }
    async delete(id, userId) {
        const post = await this.postsRepository.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.postsRepository.delete(id);
    }
    async getLikesCount(postId) {
        var _a;
        const post = await this.postsRepository.findById(postId);
        return ((_a = post === null || post === void 0 ? void 0 : post._count) === null || _a === void 0 ? void 0 : _a.likes) || 0;
    }
    toResponseDto(post) {
        var _a, _b;
        return {
            id: post.id,
            userId: post.userId,
            content: post.content,
            likes: ((_a = post._count) === null || _a === void 0 ? void 0 : _a.likes) || 0,
            comments: (_b = post.comments) === null || _b === void 0 ? void 0 : _b.map((comment) => ({
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
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository])
], PostsService);
//# sourceMappingURL=posts.service.js.map