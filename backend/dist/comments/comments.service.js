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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const comments_repository_1 = require("./comments.repository");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async findByPostId(postId) {
        const comments = await this.commentsRepository.findByPostId(postId);
        return comments.map((comment) => this.toResponseDto(comment));
    }
    async create(userId, postId, createCommentDto) {
        const comment = await this.commentsRepository.create(userId, postId, createCommentDto.content);
        return this.toResponseDto(comment);
    }
    async delete(id, userId) {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.commentsRepository.delete(id);
    }
    toResponseDto(comment) {
        return {
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
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map