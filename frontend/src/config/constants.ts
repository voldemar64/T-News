export const STORAGE_KEYS = {
  TOKEN: 'tnews_token',
  USER: 'tnews_user',
} as const;

export const TIMEOUTS = {
  API_REQUEST: 10000,
  DEBOUNCE_SEARCH: 300,
  NOTIFICATION: 3000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  POST_MAX_LENGTH: 1000,
  COMMENT_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 500,
} as const;

export const ROUTES = {
  HOME: '/index.html',
  LOGIN: '/login.html',
  REGISTER: '/register.html',
  PROFILE: '/profile.html',
  SEARCH: '/search.html',
} as const;

export const DEFAULT_IMAGES = {
  AVATAR: '/images/default_avatar.svg',
} as const;
