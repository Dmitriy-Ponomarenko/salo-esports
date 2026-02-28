import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';

import { refreshAccessToken } from '@/workers/apps/auth/services/jwt';
import { handleError } from '@/workers/apps/common/handleError';

const REQUEST_BODY_SCHEMA = z.object({
  refresh: z.string(),
});

const RESPONSE_SCHEMA = z.object({
  access: z.string(),
});

export class PrivateRefreshAPI extends OpenAPIRoute {
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

  override async handle(_request: Request, env: Env, _ctx: ExecutionContext) {
    try {
      const { body } = await this.getValidatedData<typeof this.schema>();
      const { refresh } = body;

      const access = await refreshAccessToken(env, refresh);

      return Response.json({ access });
    } catch (error) {
      return handleError(error);
    }
  }
}
