import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';

class LikeService {
  async like(postId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.POSTS.LIKES(postId));
  }

  async unlike(postId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.POSTS.LIKES(postId));
  }

  async toggle(postId: string, isLiked: boolean): Promise<void> {
    if (isLiked) {
      await this.unlike(postId);
    } else {
      await this.like(postId);
    }
  }
}

export const likeService = new LikeService();
