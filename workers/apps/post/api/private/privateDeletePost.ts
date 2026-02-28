import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';

import { handleError } from '@/workers/apps/common/handleError';

import { PostNotFoundException } from '../../exceptions/post';
import { deletePost } from '../../services/post';

export class PrivateDeletePostAPI extends OpenAPIRoute {
  override schema = {
    tags: ['Posts'],
    summary: 'Delete a post',
    description: 'Delete a post. Only the post owner can delete it.',
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Post ID',
        required: true,
        schema: {
          type: 'string',
          pattern: '^\\d+$',
        },
      },
    ],
    responses: {
      '204': {
        description: 'Post deleted successfully',
      },
      '401': {
        description: 'Unauthorized - Invalid or missing token',
      },
      '403': {
        description: 'Forbidden - User lacks permission',
      },
      '404': {
        description: "Not Found - Post ID doesn't exist",
      },
    },
  } satisfies OpenAPIRoute['schema'];

  override async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
    try {
      const postId = Number(request.params?.['id']);

      if (isNaN(postId) || postId < 1) {
        return new Response(
          JSON.stringify({
            error: 'Invalid post ID. Must be a positive integer.',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const userObj = (request as Record<string, unknown>)['user'];

      let userId: number | undefined;

      if (typeof userObj === 'object' && userObj !== null) {
        userId = (userObj as { user_id: number })['user_id'];
      }

      if (userId === undefined) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      await deletePost(env, postId, userId);

      return new Response(null, { status: 204 });
    } catch (error) {
      if (error instanceof PostNotFoundException) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return new Response(
          JSON.stringify({
            error: 'You do not have permission to delete this post',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return handleError(error);
    }
  }
}
