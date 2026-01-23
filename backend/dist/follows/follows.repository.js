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
exports.FollowsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FollowsRepository = class FollowsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByFollowerId(followerId) {
        return this.prisma.follow.findMany({
            where: { followerId },
            include: {
                following: true,
            },
        });
    }
    async findByFollowingId(followingId) {
        return this.prisma.follow.findMany({
            where: { followingId },
            include: {
                follower: true,
            },
        });
    }
    async findByFollowerAndFollowing(followerId, followingId) {
        return this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    }
    async create(followerId, followingId) {
        return this.prisma.follow.create({
            data: {
                follower: {
                    connect: { id: followerId },
                },
                following: {
                    connect: { id: followingId },
                },
            },
        });
    }
    async delete(followerId, followingId) {
        return this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    }
};
exports.FollowsRepository = FollowsRepository;
exports.FollowsRepository = FollowsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowsRepository);
//# sourceMappingURL=follows.repository.js.map