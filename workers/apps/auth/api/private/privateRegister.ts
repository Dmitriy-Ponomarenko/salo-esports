import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import type {
  RegisterUserRequest,
  RegisterUserResponse,
} from '@/shared/types/register';
import { UserAlreadyExistsException } from '@/workers/apps/auth/exceptions/user';
import { createUser, getUserByEmail } from '@/workers/apps/auth/services/user';
import { handleError } from '@/workers/apps/common/handleError';

const REQUEST_BODY_SCHEMA = z.object({
  email: z.string(),
  password: z.string(),
  full_name: z.string(),
  language: z.string(),
}) satisfies z.ZodType<RegisterUserRequest>;

const RESPONSE_SCHEMA = z.object({
  id: z.number(),
  email: z.string(),
}) satisfies z.ZodType<RegisterUserResponse>;

export class PrivateRegisterAPI extends OpenAPIRoute {
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
      const { body: userData } =
        await this.getValidatedData<typeof this.schema>();

      let user = await getUserByEmail(env, userData.email);
      if (user) {
        throw new UserAlreadyExistsException();
      }

      user = await createUser(env, userData);
      if (!user) {
        throw new Error('Failed to create user');
      }

      return Response.json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      return handleError(error);
    }
  }
}
