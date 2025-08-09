"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPServer = void 0;
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const api_v1_1 = require("./rest/api.v1");
const swagger_1 = require("../../swagger"); // Importa o Swagger
const app = (0, express_1.default)();
const createHTTPServer = async () => {
    app.disabled('x-powered-by');
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)('tiny'));
    // Configuração do Swagger
    app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs));
    app.use('/api/v1', api_v1_1.apiv1Router);
    // app.use(whatsappRoutes); // Registra as rotas
    const httpServer = node_http_1.default.createServer(app);
    return httpServer;
};
exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=server.js.map