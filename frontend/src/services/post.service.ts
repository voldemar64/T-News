import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import type { Post, NewPost } from '@/types';

class PostService {
  async getAll(): Promise<Post[]> {
    return apiClient.get<Post[]>('/posts', false);
  }

  async getFeed(): Promise<Post[]> {
    return apiClient.get<Post[]>(ENDPOINTS.FEED);
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return apiClient.get<Post[]>(ENDPOINTS.USERS.POSTS(userId), false);
  }

  async create(userId: string, data: NewPost): Promise<Post> {
    return apiClient.post<Post>(ENDPOINTS.USERS.POSTS(userId), data);
  }

  async delete(postId: string): Promise<void> {
    return apiClient.delete(ENDPOINTS.POSTS.BY_ID(postId));
  }
}

export const postService = new PostService();
