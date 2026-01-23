import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';
import { setToken, setUser, clearAuthData } from '@/utils';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
      false
    );

    setToken(response.access_token);
    setUser(response.user);

    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
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
