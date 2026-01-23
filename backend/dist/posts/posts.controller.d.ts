import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { RequestUser } from '../common/interfaces/request-user.interface';
export declare class PostsController {
    private readonly postsService;
    private readonly likesService;
    private readonly commentsService;
    constructor(postsService: PostsService, likesService: LikesService, commentsService: CommentsService);
    getUserPosts(userId: string): Promise<PostResponseDto[]>;
    createPost(userId: string, createPostDto: CreatePostDto, req: {
        user: RequestUser;
    }): Promise<PostResponseDto>;
    deletePost(postId: string, req: {
        user: RequestUser;
    }): Promise<void>;
    likePost(postId: string, req: {
        user: RequestUser;
    }): Promise<void>;
    unlikePost(postId: string, req: {
        user: RequestUser;
    }): Promise<void>;
    getPostComments(postId: string): Promise<CommentResponseDto[]>;
    createComment(postId: string, createCommentDto: CreateCommentDto, req: {
        user: RequestUser;
    }): Promise<CommentResponseDto>;
}
