import { PrismaService } from '../prisma/prisma.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';
export declare class FeedService {
    private prisma;
    constructor(prisma: PrismaService);
    getFeed(userId: string): Promise<PostResponseDto[]>;
}
