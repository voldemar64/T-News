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
exports.LikesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikesRepository = class LikesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPostId(postId) {
        return this.prisma.like.findMany({
            where: { postId },
            include: {
                user: true,
            },
        });
    }
    async findByUserAndPost(userId, postId) {
        return this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    }
    async create(userId, postId) {
        return this.prisma.like.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                post: {
                    connect: { id: postId },
                },
            },
        });
    }
    async delete(userId, postId) {
        return this.prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    }
    async countByPostId(postId) {
        return this.prisma.like.count({
            where: { postId },
        });
    }
};
exports.LikesRepository = LikesRepository;
exports.LikesRepository = LikesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesRepository);
//# sourceMappingURL=likes.repository.js.map