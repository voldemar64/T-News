import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import type { User, Post, SearchType } from '@/types';

class SearchService {
  async searchUsers(query: string): Promise<User[]> {
    const params = new URLSearchParams({
      query,
      type: 'users',
    });
    return apiClient.get<User[]>(
      `${ENDPOINTS.SEARCH}?${params.toString()}`,
      false
    );
  }

  async searchPosts(query: string): Promise<Post[]> {
    const params = new URLSearchParams({
      query,
      type: 'posts',
    });
    return apiClient.get<Post[]>(
      `${ENDPOINTS.SEARCH}?${params.toString()}`,
      false
    );
  }

  async search(query: string, type: SearchType): Promise<User[] | Post[]> {
    if (type === 'users') {
      return this.searchUsers(query);
    }
    return this.searchPosts(query);
  }
}

export const searchService = new SearchService();
