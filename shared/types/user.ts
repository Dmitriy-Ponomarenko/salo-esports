export interface UserInfo {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
  language: string;
  created_at: number;
  updated_at: number;
}

export type User = UserInfo;
