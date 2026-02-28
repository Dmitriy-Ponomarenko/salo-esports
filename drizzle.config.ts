import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './workers/db/schema',
  out: './workers/db/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: (() => {
    const accountId = process.env['CLOUDFLARE_ACCOUNT_ID'];
    const databaseId = process.env['CLOUDFLARE_DATABASE_ID'];
    const token = process.env['CLOUDFLARE_D1_TOKEN'];

    if (!accountId || !databaseId || !token) {
      throw new Error('Missing required D1 environment variables');
    }

    return {
      accountId,
      databaseId,
      token,
    };
  })(),
});
