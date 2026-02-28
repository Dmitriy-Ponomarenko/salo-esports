import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import type { LoginUserRequest, LoginUserResponse } from '@/shared/types/login';
import { generateTokens } from '@/workers/apps/auth/services/jwt';
import { verifyUser } from '@/workers/apps/auth/services/user';
import { handleError } from '@/workers/apps/common/handleError';

const REQUEST_BODY_SCHEMA = z.object({
  email: z.string(),
  password: z.string(),
}) satisfies z.ZodType<LoginUserRequest>;

const RESPONSE_SCHEMA = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
}) satisfies z.ZodType<LoginUserResponse>;

export class PrivateLoginAPI extends OpenAPIRoute {
  override schema = {
    request: {
      body: {
        content: {
          'application/json': {
            schema: REQUEST_BODY_SCHEMA,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Successful response with access token',
        content: {
          'application/json': {
            schema: RESPONSE_SCHEMA,
          },
        },
      },
    },
  } satisfies OpenAPIRoute['schema'];

  override async handle(_request: IRequest, env: Env, _ctx: ExecutionContext) {
    try {
      const data = await this.getValidatedData<typeof REQUEST_BODY_SCHEMA>();
      const userData = data.body as unknown as LoginUserRequest;

      const user = await verifyUser(env, userData.email, userData.password);
      const tokens = await generateTokens(env, user);

      return Response.json({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } catch (error) {
      return handleError(error);
    }
  }
}
