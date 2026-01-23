import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
export declare class CommentsService {
    private readonly commentsRepository;
    constructor(commentsRepository: CommentsRepository);
    findByPostId(postId: string): Promise<CommentResponseDto[]>;
    create(userId: string, postId: string, createCommentDto: CreateCommentDto): Promise<CommentResponseDto>;
    delete(id: string, userId: string): Promise<void>;
    private toResponseDto;
}
