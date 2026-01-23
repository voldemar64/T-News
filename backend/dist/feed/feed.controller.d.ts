import { FeedService } from './feed.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { RequestUser } from '../common/interfaces/request-user.interface';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getFeed(req: {
        user: RequestUser;
    }): Promise<PostResponseDto[]>;
}
