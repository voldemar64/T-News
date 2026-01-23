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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const likes_service_1 = require("../likes/likes.service");
const comments_service_1 = require("../comments/comments.service");
const create_comment_dto_1 = require("../comments/dto/create-comment.dto");
let PostsController = class PostsController {
    constructor(postsService, likesService, commentsService) {
        this.postsService = postsService;
        this.likesService = likesService;
        this.commentsService = commentsService;
    }
    async getUserPosts(userId) {
        return this.postsService.findByUserId(userId);
    }
    async createPost(userId, createPostDto, req) {
        if (req.user.id !== userId) {
            throw new Error('You can only create posts for yourself');
        }
        return this.postsService.create(userId, createPostDto);
    }
    async deletePost(postId, req) {
        return this.postsService.delete(postId, req.user.id);
    }
    async likePost(postId, req) {
        return this.likesService.toggleLike(req.user.id, postId);
    }
    async unlikePost(postId, req) {
        return this.likesService.toggleLike(req.user.id, postId);
    }
    async getPostComments(postId) {
        return this.commentsService.findByPostId(postId);
    }
    async createComment(postId, createCommentDto, req) {
        return this.commentsService.create(req.user.id, postId, createCommentDto);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)('users/:userId/posts'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getUserPosts", null);
__decorate([
    (0, common_1.Post)('users/:userId/posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Delete)('posts/:postId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Post)('posts/:postId/likes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "likePost", null);
__decorate([
    (0, common_1.Delete)('posts/:postId/likes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "unlikePost", null);
__decorate([
    (0, common_1.Get)('posts/:postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostComments", null);
__decorate([
    (0, common_1.Post)('posts/:postId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createComment", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        likes_service_1.LikesService,
        comments_service_1.CommentsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map