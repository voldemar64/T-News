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
exports.CommentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentsRepository = class CommentsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPostId(postId) {
        return this.prisma.comment.findMany({
            where: { postId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async findById(id) {
        return this.prisma.comment.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    async create(userId, postId, content) {
        return this.prisma.comment.create({
            data: {
                content,
                user: {
                    connect: { id: userId },
                },
                post: {
                    connect: { id: postId },
                },
            },
            include: {
                user: true,
            },
        });
    }
    async delete(id) {
        return this.prisma.comment.delete({
            where: { id },
        });
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsRepository);
//# sourceMappingURL=comments.repository.js.map