// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    outputFile: './test-results.json',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/', 'src/main.tsx', 'check-coverage.ts'],
    },
  },
});
