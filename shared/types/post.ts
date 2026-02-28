export type PostType = 'need' | 'offer' | 'question';

export interface Post {
  id: number;
  author_id: number;
  type: string;
  text: string;
  created_at: number;
  updated_at: number;
}

export interface CreatePostRequest {
  type: PostType;
  text: string;
}

export interface CreatePostResponse {
  id: number;
  author_id: number;
  type: string;
  text: string;
  created_at: number;
  updated_at: number;
}

export interface UserPostResponse {
  id: number;
  user_id: number;
  type: string;
  text: string;
  created_at: number;
  updated_at: number;
}

export interface PostResponse {
  id: number;
  type: string;
  text: string;
  created_at: number;
  user_full_name: string;
}
