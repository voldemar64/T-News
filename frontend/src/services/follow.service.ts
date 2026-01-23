import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';

class FollowService {
  async follow(userId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.USERS.FOLLOW(userId));
  }

  async unfollow(userId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.FOLLOW(userId));
  }

  async toggle(userId: string, isFollowing: boolean): Promise<void> {
    if (isFollowing) {
      await this.unfollow(userId);
    } else {
      await this.follow(userId);
    }
  }
}

export const followService = new FollowService();
