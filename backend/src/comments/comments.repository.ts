import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByPostId(postId: string) {
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

  async findById(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async create(userId: string, postId: string, content: string) {
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

  async delete(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
