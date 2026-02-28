export interface RegisterUserRequest {
  email: string;
  password: string;
  full_name: string;
  language: string;
}

export interface RegisterUserResponse {
  id: number;
  email: string;
}
