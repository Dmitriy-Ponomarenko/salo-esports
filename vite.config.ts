import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import { cloudflare } from '@cloudflare/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      '@/workers': path.resolve(__dirname, './workers'),
      '@/shared': path.resolve(__dirname, './shared'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@worker-config': path.resolve(__dirname, './worker-configuration.d.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
