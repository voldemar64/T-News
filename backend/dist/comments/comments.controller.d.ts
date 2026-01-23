import { CommentsService } from './comments.service';
import { RequestUser } from '../common/interfaces/request-user.interface';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    deleteComment(commentId: string, req: {
        user: RequestUser;
    }): Promise<void>;
}
