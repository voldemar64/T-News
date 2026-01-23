import {API_BASE_URL} from '../config/api';
import {TIMEOUTS} from '../config/constants';
import {clearAuthData, getToken} from '@/utils';
import type {ApiError} from '@/types';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      clearAuthData();
      window.location.href = '/login.html';
      throw new Error('Unauthorized');
    }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (
      response.status === 204 ||
      contentLength === '0' ||
      !contentType?.includes('application/json')
    ) {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return undefined as T;
    }

    const data: unknown = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return data as T;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUTS.API_REQUEST
    );

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth: boolean = true
  ): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    includeAuth: boolean = true
  ): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete(endpoint: string, includeAuth: boolean = true): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });

    await this.handleResponse<void>(response);
  }
}

export const apiClient = new ApiClient();
