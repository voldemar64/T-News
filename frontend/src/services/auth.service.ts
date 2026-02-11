import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import { setToken, setUser, clearAuthData } from '@/utils';
import type { AuthResponse, UserCredentials } from '@/types';

class AuthService {
  /**
   * Вход в систему
   * ВНИМАНИЕ: Пароли передаются в открытом виде. В продакшене обязательно использовать HTTPS!
   */
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
      false
    );

    setToken(response.access_token);
    setUser(response.user);

    return response;
  }

  /**
   * Регистрация нового пользователя
   * ВНИМАНИЕ: Пароли передаются в открытом виде. В продакшене обязательно использовать HTTPS!
   */
  async register(credentials: UserCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      credentials,
      false
    );

    setToken(response.access_token);
    setUser(response.user);

    return response;
  }

  logout(): void {
    clearAuthData();
  }
}

export const authService = new AuthService();
