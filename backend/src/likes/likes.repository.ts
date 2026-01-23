import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private prisma: PrismaService) {}

  async findByPostId(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });
  }

  async findByUserAndPost(userId: string, postId: string) {
    return this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async create(userId: string, postId: string) {
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

  async delete(userId: string, postId: string) {
    return this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async countByPostId(postId: string): Promise<number> {
    return this.prisma.like.count({
      where: { postId },
    });
  }
}
