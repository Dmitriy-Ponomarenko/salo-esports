import auth from '@/workers/middlewares/jwtAuth';
import type { RouterOpenApiType } from '@/workers/types';

import type { RegisterAppRoutes } from '../types';

import {
  PrivateCreatePostAPI,
  PrivateUpdatePostAPI,
  PrivateDeletePostAPI,
} from './api/private';
import {
  PublicGetAllPostsAPI,
  PublicGetPostByIdAPI,
  PublicGetUserPostsAPI,
} from './api/public';

export const registerPostRoutes: RegisterAppRoutes = (
  router: RouterOpenApiType,
  urlPrefix: string | null = null
): void => {
  // Public routes
  router.get(`${urlPrefix}/public/posts`, PublicGetAllPostsAPI);
  router.get(`${urlPrefix}/public/posts/:id`, PublicGetPostByIdAPI);
  router.get(`${urlPrefix}/public/users/:id/posts`, PublicGetUserPostsAPI);

  // Private routes (require authentication)
  router.post(
    `${urlPrefix}/private/create-post`,
    auth,
    PrivateCreatePostAPI as unknown as (
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ) => Promise<Response>
  );
  router.put(
    `${urlPrefix}/private/posts/:id`,
    auth,
    PrivateUpdatePostAPI as unknown as (
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ) => Promise<Response>
  );
  router.delete(
    `${urlPrefix}/private/posts/:id`,
    auth,
    PrivateDeletePostAPI as unknown as (
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ) => Promise<Response>
  );
};
