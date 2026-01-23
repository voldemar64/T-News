import { FollowsRepository } from './follows.repository';
import { UserResponseDto } from '../users/dto/user-response.dto';
export declare class FollowsService {
    private readonly followsRepository;
    constructor(followsRepository: FollowsRepository);
    follow(followerId: string, followingId: string): Promise<void>;
    unfollow(followerId: string, followingId: string): Promise<void>;
    getFollowing(userId: string): Promise<UserResponseDto[]>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
}
