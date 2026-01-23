import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async toggleLike(userId: string, postId: string): Promise<void> {
    const existingLike = await this.likesRepository.findByUserAndPost(
      userId,
      postId,
    );

    if (existingLike) {
      await this.likesRepository.delete(userId, postId);
    } else {
      await this.likesRepository.create(userId, postId);
    }
  }

  async isLiked(userId: string, postId: string): Promise<boolean> {
    const like = await this.likesRepository.findByUserAndPost(userId, postId);
    return !!like;
  }

  async getLikesCount(postId: string): Promise<number> {
    return this.likesRepository.countByPostId(postId);
  }
}
