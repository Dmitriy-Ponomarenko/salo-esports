// workers/middlewares/jwtAuth.ts

import jwt from '@tsndr/cloudflare-worker-jwt';
import type { IRequest } from 'itty-router';

import type { JwtPayload } from '@/shared/types/jwt';

export default async function auth(
  request: IRequest,
  env: Env,
  _ctx: ExecutionContext
): Promise<Response | void> {
  const urlPathname = new URL(request.url).pathname;
  if (urlPathname.includes('private')) {
    const token = getJwt(request);
    if (token === null || token === undefined || token === '') {
      return new Response('No authorization token provided', { status: 401 });
    }
    try {
      const payload = (await verifyJwt(token, env)) as JwtPayload;
      request['user'] = {
        user_id: payload.user_id,
      };
    } catch {
      return new Response('JWT verification failed', { status: 401 });
    }
  } else {
    return new Response('Invalid url structure', { status: 401 });
  }
}

export async function verifyJwt(
  token: string,
  env: Env
): Promise<Response | JwtPayload> {
  const isValid = await jwt.verify(token, env.JWT_SECRET_TOKEN);
  if (!isValid) {
    return new Response('Invalid JWT signature', { status: 401 });
  }

  const decoded = jwt.decode(token);
  if (decoded === null || decoded === undefined) {
    return new Response('Invalid JWT format', { status: 401 });
  }

  const payload = decoded.payload as JwtPayload;
  if (
    payload === undefined ||
    payload === null ||
    payload.user_id === undefined ||
    payload.user_id === null ||
    payload.exp === undefined ||
    payload.exp === null
  ) {
    return new Response('Invalid token payload', { status: 401 });
  }
  if (!checkTokenExpired(payload)) {
    return new Response('Token expired', { status: 401 });
  }

  return payload;
}

function checkTokenExpired(payload: JwtPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp > now) {
    return true;
  }

  return false;
}

function getJwt(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader === null || !authHeader.startsWith('JWT ')) {
    return null;
  }

  const parts = authHeader.split(' ');
  const token = parts[1];
  return token !== undefined && token !== null && token !== ''
    ? token.trim()
    : null;
}
