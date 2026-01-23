import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import type { Comment, NewComment } from '@/types';

class CommentService {
  async getByPost(postId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(ENDPOINTS.POSTS.COMMENTS(postId), false);
  }

  async create(postId: string, data: NewComment): Promise<Comment> {
    return apiClient.post<Comment>(ENDPOINTS.POSTS.COMMENTS(postId), data);
  }

  async delete(commentId: string): Promise<void> {
    return apiClient.delete(ENDPOINTS.COMMENTS.BY_ID(commentId));
  }
}

export const commentService = new CommentService();
