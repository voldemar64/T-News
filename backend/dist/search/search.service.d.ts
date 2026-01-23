import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PostResponseDto } from '../posts/dto/post-response.dto';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchUsers(query: string): Promise<UserResponseDto[]>;
    searchPosts(query: string): Promise<PostResponseDto[]>;
    search(query: string, type: 'users' | 'posts'): Promise<UserResponseDto[] | PostResponseDto[]>;
}
