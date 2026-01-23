import type { Comment } from './comment.types';
import type { User } from './user.types';

export interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  likedByUser?: boolean;
  comments?: Comment[];
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewPost {
  content: string;
}

export interface PostWithAuthor extends Post {
  user: User;
}
