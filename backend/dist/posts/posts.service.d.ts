import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
export declare class PostsService {
    private readonly postsRepository;
    constructor(postsRepository: PostsRepository);
    findAll(): Promise<PostResponseDto[]>;
    findById(id: string): Promise<PostResponseDto>;
    findByUserId(userId: string): Promise<PostResponseDto[]>;
    create(userId: string, createPostDto: CreatePostDto): Promise<PostResponseDto>;
    delete(id: string, userId: string): Promise<void>;
    getLikesCount(postId: string): Promise<number>;
    private toResponseDto;
}
