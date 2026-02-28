import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { z } from 'zod';

import type {
  CreatePostRequest,
  CreatePostResponse,
} from '@/shared/types/post';
import { handleError } from '@/workers/apps/common/handleError';
import { createPost } from '@/workers/apps/post/services/post';

const REQUEST_BODY_SCHEMA = z.object({
  type: z.enum(['need', 'offer', 'question'], {
    errorMap: () => ({
      message: "Post type must be 'need', 'offer', or 'question'",
    }),
  }),
  text: z
    .string()
    .min(1, 'Post text is required')
    .max(5000, 'Post text must not exceed 5000 characters'),
}) satisfies z.ZodType<CreatePostRequest>;

const RESPONSE_SCHEMA = z.object({
  id: z.number(),
  author_id: z.number(),
  type: z.string(),
  text: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
}) satisfies z.ZodType<CreatePostResponse>;

export class PrivateCreatePostAPI extends OpenAPIRoute {
  override schema = {
    tags: ['Posts'],
    summary: 'Create a new post',
    description: 'Create a new post by an authenticated user',
    security: [{ BearerAuth: [] }],
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
      '201': {
        description: 'Post created successfully',
        content: {
          'application/json': {
            schema: RESPONSE_SCHEMA,
          },
        },
      },
      '401': {
        description: 'Unauthorized - Invalid or missing token',
      },
      '400': {
        description: 'Bad request - Invalid input data',
      },
    },
  } satisfies OpenAPIRoute['schema'];

  override async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
    try {
      const userObj = (request as Record<string, unknown>)['user'];

      let userId: number | undefined;
      if (
        typeof userObj === 'object' &&
        userObj !== null &&
        'user_id' in userObj
      ) {
        userId = Number(userObj.user_id);
      }

      if (userId === undefined || Number.isNaN(userId)) {
        return Response.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }

      const { body: postData } =
        await this.getValidatedData<typeof this.schema>();

      const post = await createPost(env, {
        authorId: userId,
        type: postData.type,
        text: postData.text,
      });

      const response: CreatePostResponse = {
        id: post.id,
        author_id: post.author_id,
        type: post.type,
        text: post.text,
        created_at: post.created_at,
        updated_at: post.updated_at,
      };

      return Response.json(response, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }
}
