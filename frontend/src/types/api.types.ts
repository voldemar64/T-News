export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SearchType = 'users' | 'posts';

export interface SearchParams {
  query: string;
  type: SearchType;
}

export interface SearchResults<T> {
  results: T[];
  query: string;
  type: SearchType;
}
