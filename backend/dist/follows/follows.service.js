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
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const follows_repository_1 = require("./follows.repository");
let FollowsService = class FollowsService {
    constructor(followsRepository) {
        this.followsRepository = followsRepository;
    }
    async follow(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.BadRequestException('Cannot follow yourself');
        }
        const existingFollow = await this.followsRepository.findByFollowerAndFollowing(followerId, followingId);
        if (existingFollow) {
            throw new common_1.BadRequestException('Already following this user');
        }
        await this.followsRepository.create(followerId, followingId);
    }
    async unfollow(followerId, followingId) {
        const existingFollow = await this.followsRepository.findByFollowerAndFollowing(followerId, followingId);
        if (!existingFollow) {
            throw new common_1.BadRequestException('Not following this user');
        }
        await this.followsRepository.delete(followerId, followingId);
    }
    async getFollowing(userId) {
        const follows = await this.followsRepository.findByFollowerId(userId);
        return follows.map((follow) => {
            const _a = follow.following, { password } = _a, user = __rest(_a, ["password"]);
            return user;
        });
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.followsRepository.findByFollowerAndFollowing(followerId, followingId);
        return !!follow;
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [follows_repository_1.FollowsRepository])
], FollowsService);
//# sourceMappingURL=follows.service.js.map