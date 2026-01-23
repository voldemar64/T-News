import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async findByPostId(postId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsRepository.findByPostId(postId);
    return comments.map((comment) => this.toResponseDto(comment));
  }

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.create(
      userId,
      postId,
      createCommentDto.content,
    );
    return this.toResponseDto(comment);
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentsRepository.delete(id);
  }

  private toResponseDto(comment: {
    id: string;
    userId: string;
    content: string;
    user?: { id: string; username: string; avatar?: string; bio?: string };
  }): CommentResponseDto {
    return {
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
    };
  }
}
