import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Controller()
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('posts')
  async getAllPosts(): Promise<PostResponseDto[]> {
    return this.postsService.findAll();
  }

  @Get('users/:userId/posts')
  async getUserPosts(
    @Param('userId') userId: string,
  ): Promise<PostResponseDto[]> {
    return this.postsService.findByUserId(userId);
  }

  @Post('users/:userId/posts')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(
    @Param('userId') userId: string,
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: RequestUser },
  ): Promise<PostResponseDto> {
    if (req.user.id !== userId) {
      throw new Error('You can only create posts for yourself');
    }
    return this.postsService.create(userId, createPostDto);
  }

  @Delete('posts/:postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('postId') postId: string,
    @Request() req: { user: RequestUser },
  ): Promise<void> {
    return this.postsService.delete(postId, req.user.id);
  }

  @Post('posts/:postId/likes')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('postId') postId: string,
    @Request() req: { user: RequestUser },
  ): Promise<void> {
    return this.likesService.toggleLike(req.user.id, postId);
  }

  @Delete('posts/:postId/likes')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Param('postId') postId: string,
    @Request() req: { user: RequestUser },
  ): Promise<void> {
    return this.likesService.toggleLike(req.user.id, postId);
  }

  @Get('posts/:postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentsService.findByPostId(postId);
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: { user: RequestUser },
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(req.user.id, postId, createCommentDto);
  }
}
