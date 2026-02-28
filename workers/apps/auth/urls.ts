import auth from '@/workers/middlewares/jwtAuth';
import type { RouterOpenApiType } from '@/workers/types';

import type { RegisterAppRoutes } from '../types';

import {
  PrivateLoginAPI,
  PrivateRegisterAPI,
  PrivateGetUserInfoAPI,
  PrivateRefreshAPI,
  PrivateUploadUserAvatarAPI,
} from './api/private';
import { PublicGetUserByIdAPI } from './api/public';

export const registerAuthRoutes: RegisterAppRoutes = (
  router: RouterOpenApiType,
  urlPrefix: string | null = null
): void => {
  // Public routes
  router.get(`${urlPrefix}/public/users/:id`, PublicGetUserByIdAPI);

  // Private routes
  router.post(`${urlPrefix}/private/auth/register`, PrivateRegisterAPI);
  router.post(`${urlPrefix}/private/auth/login`, PrivateLoginAPI);
  router.post(`${urlPrefix}/private/auth/refresh`, PrivateRefreshAPI);

  // Private routes with JWT auth
  router.get(
    `${urlPrefix}/private/auth/me`,
    auth,
    PrivateGetUserInfoAPI as unknown as (
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ) => Promise<Response>
  );
  router.post(
    `${urlPrefix}/private/auth/upload-avatar`,
    auth,
    PrivateUploadUserAvatarAPI as unknown as (
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ) => Promise<Response>
  );
};
