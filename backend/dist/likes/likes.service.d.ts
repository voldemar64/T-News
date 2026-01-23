import { LikesRepository } from './likes.repository';
export declare class LikesService {
    private readonly likesRepository;
    constructor(likesRepository: LikesRepository);
    toggleLike(userId: string, postId: string): Promise<void>;
    isLiked(userId: string, postId: string): Promise<boolean>;
    getLikesCount(postId: string): Promise<number>;
}
