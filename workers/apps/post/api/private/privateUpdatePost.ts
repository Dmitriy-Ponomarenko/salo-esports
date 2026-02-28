import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import { handleError } from '@/workers/apps/common/handleError';

import { PostNotFoundException } from '../../exceptions/post';
import { updatePost } from '../../services/post';

const UpdatePostRequestSchema = z.object({
  type: z
    .enum(['need', 'offer', 'question'])
    .optional()
    .describe('Post type (need, offer, or question)'),
  text: z.string().min(1).max(1000).optional().describe('Post text content'),
});

const UpdatePostResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  text: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export class PrivateUpdatePostAPI extends OpenAPIRoute {
  override schema = {
    tags: ['Posts'],
    summary: 'Update a post',
    description: "Update a post's content. Only the post owner can update it.",
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
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdatePostRequestSchema,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Post updated successfully',
        content: {
          'application/json': {
            schema: UpdatePostResponseSchema,
          },
        },
      },
      '400': {
        description: 'Bad Request - Invalid fields',
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
      // 1. Get post ID from URL
      const postIdRaw = request.params?.['id'];
      if (postIdRaw === undefined || postIdRaw === null || postIdRaw === '') {
        throw new Error('Post ID is required');
      }
      const postId = Number(postIdRaw);

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

      // 2. Get authenticated user ID from request context
      const userObj = (request as Record<string, unknown>)['user'];
      let userId: number | undefined;

      if (typeof userObj === 'object' && userObj !== null) {
        // Explicitly cast to fix 'no-unsafe-assignment'
        userId = (userObj as Record<string, unknown>)['user_id'] as number;
      }

      // Explicit check for strict-boolean-expressions
      if (userId === undefined) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // 3. Parse and validate request body
      const body = await request.json();
      const validation = UpdatePostRequestSchema.safeParse(body);

      if (!validation.success) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request body',
            details: validation.error.errors,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const updates = validation.data;

      // 4. Check if at least one field is provided (Explicitly check against undefined)
      if (updates.type === undefined && updates.text === undefined) {
        return new Response(
          JSON.stringify({
            error: 'At least one field (type or text) must be provided',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // 5. Update the post
      // Explicitly check for undefined to satisfy strict-boolean-expressions
      const updatedPostResult = await updatePost(env, postId, userId, {
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.text !== undefined && { text: updates.text }),
      });

      // 6. Handle potentially 'any' typed response from updatePost
      // Cast the result to the expected structure to fix no-unsafe-assignment
      const post = updatedPostResult as {
        id: number;
        type: string;
        text: string;
        created_at: number;
        updated_at: number;
      };

      const response = {
        id: post.id,
        type: post.type,
        text: post.text,
        created_at: post.created_at,
        updated_at: post.updated_at,
      };

      return Response.json(response, { status: 200 });
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
            error: 'You do not have permission to update this post',
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
