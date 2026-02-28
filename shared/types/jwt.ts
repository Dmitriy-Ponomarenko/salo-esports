export interface JwtPayload {
  user_id: number;
  token_type?: 'access' | 'refresh';
  jti?: string;
  exp: number;
}

export interface JwtTokens {
  access_token: string;
  refresh_token: string;
}
