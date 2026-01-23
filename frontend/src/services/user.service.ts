import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import type { User, UpdateUser } from '@/types';

class UserService {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE, false);
  }

  async getById(userId: string): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.USERS.BY_ID(userId), false);
  }

  async update(userId: string, data: UpdateUser): Promise<User> {
    return apiClient.patch<User>(ENDPOINTS.USERS.BY_ID(userId), data);
  }

  async getFollowing(userId: string): Promise<User[]> {
    return apiClient.get<User[]>(ENDPOINTS.USERS.FOLLOWING(userId));
  }
}

export const userService = new UserService();
