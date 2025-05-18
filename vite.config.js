import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
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