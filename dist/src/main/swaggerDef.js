"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
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
        path_1.default.resolve(__dirname, '../modules/**/*.routes.ts'),
        path_1.default.resolve(__dirname, '../modules/**/*.dto.ts'),
        path_1.default.resolve(__dirname, '../modules/**/*.types.ts'),
    ],
};
exports.default = options;
//# sourceMappingURL=swaggerDef.js.map