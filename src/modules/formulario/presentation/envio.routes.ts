// src/modules/formulario/infra/http/routes/envio.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { DispararEnvioEmMassaUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case';
import { DispararEnvioIndividualUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case';
import { RetentarEnviosPendentesUseCase } from '@modules/formulario/application/use-cases/envio/retentarEnviosPendentes.use-case';
import { EnvioRepositoryPrisma } from '../infra/envio/EnvioRepositoryPrisma';
import { ClienteRepositoryPrisma } from '@modules/gestao_clientes/infra/cliente.repository.prisma';
import { FormularioRepositoryPrisma } from '../infra/formulario/formulario.repository.prisma';
import { CampanhaRepositoryPrisma } from '@modules/campanha/infra/campanha/campanha.repository.prisma';
import { WhatsAppApiGateway } from '../infra/envio/gateways/WhatsAppApiGateway';
import { EnvioController } from './controller/envio.controller';

// Repositórios e Casos de Uso (simulação, você precisará ajustar para o seu projeto)
const prisma = new PrismaClient();
 const envioRepository = new EnvioRepositoryPrisma(prisma);
 const clienteRepository = new ClienteRepositoryPrisma(prisma);
const campanhaRepository = new CampanhaRepositoryPrisma(prisma);
 const formularioRepository = new FormularioRepositoryPrisma(prisma);

// Instanciação das classes de casos de uso (dependências precisam ser ajustadas)
 const dispararEnvioIndividualUseCase =  new DispararEnvioIndividualUseCase(envioRepository, clienteRepository, campanhaRepository, formularioRepository, WhatsAppApiGateway);
 const dispararEnvioEmMassaUseCase = new DispararEnvioEmMassaUseCase(envioRepository, clienteRepository, campanhaRepository, WhatsAppApiGateway);
 const retentarEnviosPendentesUseCase = new RetentarEnviosPendentesUseCase(envioRepository);

// O controlador recebe os casos de uso como dependências
const envioController = new EnvioController(
  dispararEnvioIndividualUseCase,
  dispararEnvioEmMassaUseCase,
  retentarEnviosPendentesUseCase
);

// --- DEFINIÇÃO DAS ROTAS ---
const envioRouter = Router();

// Rota para disparo individual
envioRouter.post('/envio-unico', (req, res, next) => envioController.dispararIndividual(req, res, next));

// Rota para disparo em massa
envioRouter.post('/envio-massa', (req, res, next) => envioController.dispararEmMassa(req, res, next));

// Rota para retentativa de envios
envioRouter.post('/retentar-envio', (req, res, next) => envioController.retentarPendentes(req, res, next));

export { envioRouter };
