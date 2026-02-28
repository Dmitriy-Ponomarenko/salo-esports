import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import type { AuthenticatedRequest } from '@/shared/types/auth';
import type { UserInfo } from '@/shared/types/user';
import { getUserById } from '@/workers/apps/auth/services/user';
import { handleError } from '@/workers/apps/common/handleError';

import { UserNotFoundException } from '../../exceptions/user';

const RESPONSE_SCHEMA = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string(),
  avatar_url: z.string().nullable(),
  language: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
}) satisfies z.ZodType<UserInfo>;

export class PrivateGetUserInfoAPI extends OpenAPIRoute {
  override schema = {
    security: [{ BearerAuth: [] }],
    response: {
      content: {
        'application/json': { schema: RESPONSE_SCHEMA },
      },
    },
  };

  override async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
    try {
      const userId = (request as unknown as AuthenticatedRequest).userId;
      const user = await getUserById(env, userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      const userInfo: UserInfo = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        language: user.language,
        created_at:
          typeof user.created_at === 'number'
            ? user.created_at
            : new Date(user.created_at).getTime(),
        updated_at:
          typeof user.updated_at === 'number'
            ? user.updated_at
            : new Date(user.updated_at).getTime(),
      };

      return Response.json(userInfo);
    } catch (error) {
      return handleError(error);
    }
  }
}
