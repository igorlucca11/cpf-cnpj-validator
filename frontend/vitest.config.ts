// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteConfig from './vite.config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', 
    globals: true,
    setupFiles: '__tests__/setupTests.ts',
    coverage: {
      reporter: ['text', 'html', 'json'],
      exclude: [ 'node_modules/', 'src/main.tsx', 'check-coverage.ts', 'src/vite-env.d.ts', 'vite.config.ts', 'vitest.config.ts' ],
    },
    alias: viteConfig.resolve?.alias,
  },
});
