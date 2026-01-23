import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.findAll();
    return posts.map((post) => this.toResponseDto(post));
  }

  async findById(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.toResponseDto(post);
  }

  async findByUserId(userId: string): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.findByUserId(userId);
    return posts.map((post) => this.toResponseDto(post));
  }

  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.postsRepository.create(
      userId,
      createPostDto.content,
    );
    return this.toResponseDto(post);
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsRepository.delete(id);
  }

  async getLikesCount(postId: string): Promise<number> {
    const post = await this.postsRepository.findById(postId);
    return post?._count?.likes || 0;
  }

  private toResponseDto(post: {
    id: string;
    userId: string;
    content: string;
    _count?: { likes?: number; comments?: number };
    comments?: Array<{
      id: string;
      userId: string;
      content: string;
      user?: { id: string; username: string; avatar?: string; bio?: string };
    }>;
    user?: { id: string; username: string; avatar?: string; bio?: string };
  }): PostResponseDto {
    return {
      id: post.id,
      userId: post.userId,
      content: post.content,
      likes: post._count?.likes || 0,
      comments: post.comments?.map((comment) => ({
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
    };
  }
}
