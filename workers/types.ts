// workers/types.ts

import type { IttyRouterOpenAPIRouterType } from 'chanfana';
import type { IRequest, RouterType } from 'itty-router';

export type RouterTypeItty = RouterType<IRequest, Record<string, unknown>[]>;

export type RouterOpenApiType = RouterTypeItty &
  IttyRouterOpenAPIRouterType<RouterTypeItty>;
