// workers/index.ts

import type { IRequest } from 'itty-router';

import apiRouter from './apps/apiRouter';
import docsRouter from './apps/docsRouter';
import { composeMiddlewares } from './middlewareComposer';
import type { Middleware } from './middlewareComposer';
import { optionsMiddleware } from './middlewares/options';
import { serveAssetsMiddleware } from './middlewares/serveAssets';

const middlewares: Middleware[] = [optionsMiddleware, serveAssetsMiddleware];

function applyCors(response: Response, request: Request): Response {
  if (request.headers.has('Origin')) {
    const newResponse = new Response(response.body, response);
    const origin = request.headers.get('Origin');
    newResponse.headers.set(
      'Access-Control-Allow-Origin',
      origin !== null && origin !== '' ? origin : '*'
    );

    return newResponse;
  }

  return response;
}

async function serveApi(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/docs')) {
    // docsRouter.fetch returns a promise; await and cast to Response
    const rawDocResp = (await docsRouter.fetch(request, env, ctx)) as unknown;
    const docResp = rawDocResp as Response;
    return docResp;
  }

  const response = (await apiRouter.fetch(
    request,
    env,
    ctx
  )) as Response | null;
  if (response === null || response === undefined) {
    return null;
  }

  return response;
}

export default {
  async fetch(
    request: IRequest,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const handler = composeMiddlewares(middlewares, serveApi);

      const response = await handler(request, env, ctx);

      return applyCors(
        response || new Response('Not found', { status: 404 }),
        request
      );
    } catch (error) {
      console.error(error);

      return new Response('Server error', { status: 500 });
    }
  },
};
