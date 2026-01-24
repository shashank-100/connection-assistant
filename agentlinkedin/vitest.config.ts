import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Skip tests in CI/Vercel environment where browsers aren't available
    environment: 'node',
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
