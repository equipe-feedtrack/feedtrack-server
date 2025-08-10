"use strict";
// src/modules/formulario/infra/http/routes/envio.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.envioRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const dispararEnvioEmMassa_use_case_1 = require("@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case");
const dispararEnvioIndividual_use_case_1 = require("@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case");
const retentarEnviosPendentes_use_case_1 = require("@modules/formulario/application/use-cases/envio/retentarEnviosPendentes.use-case");
const EnvioRepositoryPrisma_1 = require("../infra/envio/EnvioRepositoryPrisma");
const cliente_repository_prisma_1 = require("@modules/gestao_clientes/infra/cliente.repository.prisma");
const formulario_repository_prisma_1 = require("../infra/formulario/formulario.repository.prisma");
const campanha_repository_prisma_1 = require("@modules/campanha/infra/campanha/campanha.repository.prisma");
const WhatsAppApiGateway_1 = require("../infra/envio/gateways/WhatsAppApiGateway");
const envio_controller_1 = require("./controller/envio.controller");
// Repositórios e Casos de Uso (simulação, você precisará ajustar para o seu projeto)
const prisma = new client_1.PrismaClient();
const envioRepository = new EnvioRepositoryPrisma_1.EnvioRepositoryPrisma(prisma);
const clienteRepository = new cliente_repository_prisma_1.ClienteRepositoryPrisma(prisma);
const campanhaRepository = new campanha_repository_prisma_1.CampanhaRepositoryPrisma(prisma);
const formularioRepository = new formulario_repository_prisma_1.FormularioRepositoryPrisma(prisma);
// Instanciação das classes de casos de uso (dependências precisam ser ajustadas)
const dispararEnvioIndividualUseCase = new dispararEnvioIndividual_use_case_1.DispararEnvioIndividualUseCase(envioRepository, clienteRepository, campanhaRepository, formularioRepository, WhatsAppApiGateway_1.WhatsAppApiGateway);
const dispararEnvioEmMassaUseCase = new dispararEnvioEmMassa_use_case_1.DispararEnvioEmMassaUseCase(envioRepository, clienteRepository, campanhaRepository, WhatsAppApiGateway_1.WhatsAppApiGateway);
const retentarEnviosPendentesUseCase = new retentarEnviosPendentes_use_case_1.RetentarEnviosPendentesUseCase(envioRepository);
// O controlador recebe os casos de uso como dependências
const envioController = new envio_controller_1.EnvioController(dispararEnvioIndividualUseCase, dispararEnvioEmMassaUseCase, retentarEnviosPendentesUseCase);
// --- DEFINIÇÃO DAS ROTAS ---
const envioRouter = (0, express_1.Router)();
exports.envioRouter = envioRouter;
// Rota para disparo individual
envioRouter.post('/envio-unico', (req, res, next) => envioController.dispararIndividual(req, res, next));
// Rota para disparo em massa
envioRouter.post('/envio-massa', (req, res, next) => envioController.dispararEmMassa(req, res, next));
// Rota para retentativa de envios
envioRouter.post('/retentar-envio', (req, res, next) => envioController.retentarPendentes(req, res, next));
//# sourceMappingURL=envio.routes.js.map