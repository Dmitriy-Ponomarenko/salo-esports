export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  access_token: string;
  refresh_token: string;
}
