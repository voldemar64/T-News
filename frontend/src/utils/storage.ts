import { STORAGE_KEYS } from '../config/constants';
import type { User } from '@/types';

export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch {
    console.error('Failed to save token to localStorage');
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch {
    console.error('Failed to remove token from localStorage');
  }
}

export function getUser(): User | null {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {
    console.error('Failed to save user to localStorage');
  }
}

export function removeUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch {
    console.error('Failed to remove user from localStorage');
  }
}

export function clearAuthData(): void {
  removeToken();
  removeUser();
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getUser() !== null;
}
