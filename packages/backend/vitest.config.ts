import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 15000,
    globals: true,
    environment: 'node',
    setupFiles: [], // Ensure test DB is initialized
  },
});
