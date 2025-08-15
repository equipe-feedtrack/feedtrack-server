import { defineConfig } from 'vite';
import path from 'path';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  // Configurações do Vitest para a seção `test`
  test: {
    // Permite usar as funções `describe`, `it`, etc., globalmente
    globals: true,
    
    // Define o ambiente de execução como Node.js (ideal para APIs)
    environment: 'node',

    // Define quais arquivos o Vitest deve incluir nos testes
    include: ['**/*.spec.ts', '**/*.test.ts'],

    // Define quais diretórios/arquivos o Vitest deve excluir
    exclude: [...configDefaults.exclude, 'dist/**'],

    // Configuração para o Vitest ler as variáveis de ambiente
    env: {
      DATABASE_URL: 'file:./test.db',
    },
  },

  // Configurações do Vite para a seção `resolve`
  resolve: {
    // Define os aliases de caminho para as suas importações
    alias: [
      {
        find: '@modules',
        replacement: path.resolve(__dirname, 'src/modules'),
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, 'src/shared'),
      },
    ],
  },
});