import { Injectable, BadRequestException } from '@nestjs/common';
import { FollowsRepository } from './follows.repository';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class FollowsService {
  constructor(private readonly followsRepository: FollowsRepository) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existingFollow =
      await this.followsRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    await this.followsRepository.create(followerId, followingId);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const existingFollow =
      await this.followsRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    if (!existingFollow) {
      throw new BadRequestException('Not following this user');
    }

    await this.followsRepository.delete(followerId, followingId);
  }

  async getFollowing(userId: string): Promise<UserResponseDto[]> {
    const follows = await this.followsRepository.findByFollowerId(userId);
    return follows.map((follow) => {
      const { password: _password, ...user } = follow.following;
      return user as UserResponseDto;
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followsRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );
    return !!follow;
  }
}
