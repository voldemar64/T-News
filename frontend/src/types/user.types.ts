export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
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

export interface UserCredentials {
  username: string;
  password: string;
}
