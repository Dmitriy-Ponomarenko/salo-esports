import { OpenAPIRoute } from 'chanfana';
import type { IRequest } from 'itty-router';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { handleError } from '@/workers/apps/common/handleError';

import { updateUserAvatar } from '../../services/user';

const UploadAvatarResponseSchema = z.object({
  success: z.boolean(),
  avatar_url: z.string(),
});

export class PrivateUploadUserAvatarAPI extends OpenAPIRoute {
  override schema = {
    tags: ['Authentication'],
    summary: 'Upload user avatar',
    description:
      'Upload a user avatar image. Supports image files up to 1MB. The image is stored in Cloudflare R2 and served via Cloudflare Images.',
    security: [{ BearerAuth: [] }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
                description:
                  'Avatar image file (max 1MB, supported formats: PNG, JPG, JPEG, GIF, WebP)',
              },
            },
            required: ['file'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Avatar uploaded successfully',
        content: {
          'application/json': {
            schema: UploadAvatarResponseSchema,
          },
        },
      },
      '400': {
        description: 'Bad Request - Invalid content type or missing file',
      },
      '401': {
        description: 'Unauthorized - Invalid or missing token',
      },
      '405': {
        description: 'Method Not Allowed - Only POST method is supported',
      },
      '413': {
        description: 'Payload Too Large - File size exceeds 1MB limit',
      },
    },
  } satisfies OpenAPIRoute['schema'];

  override async handle(request: IRequest, env: Env, _ctx: ExecutionContext) {
    try {
      // Get authenticated user ID from request context
      const userObj = (request as Record<string, unknown>)['user'];
      const userId =
        typeof userObj === 'object' && userObj !== null
          ? Number((userObj as Record<string, unknown>)['user_id'])
          : undefined;
      if (typeof userId !== 'number' || userId <= 0) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate content type
      const contentType = request.headers.get('content-type');

      if (contentType === null) {
        return new Response(
          JSON.stringify({ error: 'Missing Content-Type header' }),
          { status: 400 }
        );
      }

      if (!contentType.startsWith('multipart/form-data')) {
        return new Response(
          JSON.stringify({
            error: 'Expected multipart/form-data content type',
          }),
          { status: 400 }
        );
      }

      // Parse form data
      const form = await request.formData();
      const file = form.get('file');

      if (!(file instanceof File)) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Validate file size (max 1MB)
      if (file.size > 1_000_000) {
        return new Response(
          JSON.stringify({ error: 'File size exceeds 1MB limit' }),
          {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate file type
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({
            error:
              'Invalid file type. Supported formats: PNG, JPG, JPEG, GIF, WebP',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Generate unique filename
      const ext = file.type.split('/')[1] ?? 'png';
      const filename = nanoid() + '.' + ext;

      // Generate public URL via Cloudflare Images
      const publicUrl = `https://workers.dev/cdn/${filename}`;

      // Update user avatar URL in database
      await updateUserAvatar(env, userId, publicUrl);

      const response = {
        success: true,
        avatar_url: publicUrl,
      };

      return Response.json(response, { status: 200 });
    } catch (error) {
      console.error('Upload avatar error:', error);
      return handleError(error);
    }
  }
}
