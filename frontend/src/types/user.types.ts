export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NewUser {
  username: string;
  password: string;
}

export interface UpdateUser {
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}
