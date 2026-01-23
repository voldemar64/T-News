import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(query: string): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    return users.map((user) => {
      const { password: _password, ...result } = user;
      return result as UserResponseDto;
    });
  }

  async searchPosts(query: string): Promise<PostResponseDto[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        content: {
          contains: query,
          mode: 'insensitive',
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

  async search(
    query: string,
    type: 'users' | 'posts',
  ): Promise<UserResponseDto[] | PostResponseDto[]> {
    if (type === 'users') {
      return this.searchUsers(query);
    } else {
      return this.searchPosts(query);
    }
  }
}
