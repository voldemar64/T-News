import type { User } from './user.types';

export interface Comment {
  id: string;
  userId: string;
  postId?: string;
  content: string;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewComment {
  content: string;
}

export interface CommentWithAuthor extends Comment {
  user: User;
}
