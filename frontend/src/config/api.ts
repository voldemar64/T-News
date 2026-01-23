export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    POSTS: (userId: string) => `/users/${userId}/posts`,
    FOLLOW: (userId: string) => `/users/${userId}/follow`,
    FOLLOWING: (userId: string) => `/users/${userId}/following`,
  },

  POSTS: {
    BY_ID: (id: string) => `/posts/${id}`,
    LIKES: (postId: string) => `/posts/${postId}/likes`,
    COMMENTS: (postId: string) => `/posts/${postId}/comments`,
  },

  COMMENTS: {
    BY_ID: (id: string) => `/comments/${id}`,
  },

  FEED: '/feed',

  SEARCH: '/search',
} as const;
