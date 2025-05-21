import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts', '**/*.test.ts'], // Garante que Vitest reconheça seus testes
  },
});
