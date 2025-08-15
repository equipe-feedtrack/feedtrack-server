import http from 'node:http';
import express, { Application } from 'express';
import morgan from 'morgan';
import { apiv1Router } from './rest/api.v1';
import { swaggerUi, specs } from '../../swagger'; // Importa o Swagger
import cors from 'cors';


const app: Application = express();

const createHTTPServer = async (): Promise<http.Server>  => {
    app.disabled('x-powered-by');
    app.use(express.json());
    app.use(morgan('tiny'));
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    

    // Configuração do Swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.use('/api/v1', apiv1Router);
    // app.use(whatsappRoutes); // Registra as rotas
    const httpServer: http.Server = http.createServer(app);
    return httpServer;
};

export { createHTTPServer }