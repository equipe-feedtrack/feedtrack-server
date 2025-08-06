import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FeedTrack API',
    version: '1.0.0',
    description: 'Documentação da API do FeedTrack',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    schemas: {},
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../modules/**/*.routes.ts'),
    path.resolve(__dirname, '../modules/**/*.dto.ts'),
    path.resolve(__dirname, '../modules/**/*.types.ts'),
  ],
};

export default options;
