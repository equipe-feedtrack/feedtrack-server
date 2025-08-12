import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.spec.ts', '**/*.test.ts'], // Garante que Vitest reconheça seus testes
    exclude: [...configDefaults.exclude],
  },
 resolve: {
        alias: [
            {
                find: "@modules",
                replacement: path.resolve(__dirname, "src/modules"),
            },
            {
                find: "@shared",
                replacement: path.resolve(__dirname, "src/shared"),
            },
        ]
    }    
})