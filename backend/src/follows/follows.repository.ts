import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsRepository {
  constructor(private prisma: PrismaService) {}

  async findByFollowerId(followerId: string) {
    return this.prisma.follow.findMany({
      where: { followerId },
      include: {
        following: true,
      },
    });
  }

  async findByFollowingId(followingId: string) {
    return this.prisma.follow.findMany({
      where: { followingId },
      include: {
        follower: true,
      },
    });
  }

  async findByFollowerAndFollowing(followerId: string, followingId: string) {
    return this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async create(followerId: string, followingId: string) {
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

  async delete(followerId: string, followingId: string) {
    return this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
