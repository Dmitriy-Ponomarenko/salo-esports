// workers/apps/apiRouter.ts

import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';

import type { RouterOpenApiType, RouterTypeItty } from '../types';

import { registerAppRoutes } from './appUrls';

const _router: RouterTypeItty = Router();
const router: RouterOpenApiType = fromIttyRouter(_router);
router.registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'Authorization',
  description: 'JWT token (format: JWT {token})',
});

registerAppRoutes(router, '/api');
export default router;
