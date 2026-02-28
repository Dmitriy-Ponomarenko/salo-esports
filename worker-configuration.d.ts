interface Env {
  JWT_SECRET_TOKEN: string;
  ACCESS_TOKEN_EXPIRES_IN: number;
  REFRESH_TOKEN_EXPIRES_IN: number;
  DB: D1Database;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  CLOUDFLARE_ACCOUNT_ID?: string;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result>;
  batch(queries: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all(): Promise<D1Result>;
  first(): Promise<unknown>;
  run(): Promise<D1Result>;
}

interface D1Result {
  success: boolean;
  results: unknown[];
  meta: { duration: number };
}
