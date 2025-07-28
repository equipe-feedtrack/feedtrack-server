import express, { Application } from 'express';
import morgan from 'morgan';
import http from 'node:http';
import { feedtrackRouter } from './rest/api.v1';
import whatsappRoutes from './routes/whatsapp.routes';

const app: Application = express();

const createHTTPServer = async (): Promise<http.Server>  => {
    app.disabled('x-powered-by');
    app.use(express.json());
    app.use(morgan('tiny'));
    app.use('/feedtrack/v1', feedtrackRouter);
    app.use(whatsappRoutes); // Registra as rotas
    const httpServer: http.Server = http.createServer(app);
    return httpServer;
};

export { createHTTPServer };
