import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed(userId: string): Promise<PostResponseDto[]> {
    // Найти все подписки пользователя
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
    });

    const followingIds = follows.map((follow) => follow.followingId);

    // Если пользователь ни на кого не подписан, возвращаем пустой массив
    if (followingIds.length === 0) {
      return [];
    }

    // Получить посты от подписанных пользователей
    const posts = await this.prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      content: post.content,
      likes: post._count.likes,
      comments: post.comments.map((comment) => ({
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
    }));
  }
}
