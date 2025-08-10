import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { EnvioController } from './controller/envio.controller';

// Use Cases
import { DispararEnvioEmMassaUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case';
import { DispararEnvioIndividualUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case';
import { RetentarEnviosPendentesUseCase } from '@modules/formulario/application/use-cases/envio/retentarEnviosPendentes.use-case';

// Repositórios
import { FormularioRepositoryPrisma } from '../infra/formulario/formulario.repository.prisma';
import { CampanhaRepositoryPrisma } from '@modules/campanha/infra/campanha/campanha.repository.prisma';
import { ClienteRepositoryPrisma } from '@modules/gestao_clientes/infra/cliente.repository.prisma';
import { EnvioRepositoryPrisma } from '../infra/envio/EnvioRepositoryPrisma';

// Gateways
import { WhatsAppApiGateway } from '../infra/envio/gateways/WhatsAppApiGateway';
import { EmailGateway } from '../infra/envio/gateways/EmailApiGateway';


// --- INICIALIZAÇÃO DE DEPENDÊNCIAS ---
const prisma = new PrismaClient();

// Repositórios
const envioRepository = new EnvioRepositoryPrisma(prisma);
const clienteRepository = new ClienteRepositoryPrisma(prisma);
const campanhaRepository = new CampanhaRepositoryPrisma(prisma);
const formularioRepository = new FormularioRepositoryPrisma(prisma);

// Gateways
const emailGateway = new EmailGateway();
const whatsappGateway = new WhatsAppApiGateway();

// Casos de Uso
const dispararEnvioIndividualUseCase = new DispararEnvioIndividualUseCase(
  envioRepository,
  clienteRepository,
  campanhaRepository,
  formularioRepository,
  whatsappGateway, // Injetando o gateway de WhatsApp
  emailGateway // Injetando o gateway de e-mail
);
const dispararEnvioEmMassaUseCase = new DispararEnvioEmMassaUseCase(
  envioRepository,
  clienteRepository,
  campanhaRepository,
  emailGateway, // Injetando o gateway de e-mail
  whatsappGateway // Injetando o gateway de WhatsApp
);
const retentarEnviosPendentesUseCase = new RetentarEnviosPendentesUseCase(
  envioRepository,
  campanhaRepository,
  clienteRepository,
  emailGateway,
  whatsappGateway
);

// Controlador
const envioController = new EnvioController(
  dispararEnvioIndividualUseCase,
  dispararEnvioEmMassaUseCase,
  retentarEnviosPendentesUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

// --- DEFINIÇÃO DAS ROTAS ---
const envioRouter = Router();

/**
 * @swagger
 * /envio/individual:
 *   post:
 *     summary: Dispara um envio de formulário para um cliente específico
 *     tags: [Envios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - campanhaId
 *               - usuarioId
 *             properties:
 *               clienteId:
 *                 type: string
 *                 description: ID do cliente para quem o formulário será enviado.
 *               campanhaId:
 *                 type: string
 *                 description: ID da campanha associada ao envio.
 *               usuarioId:
 *                 type: string
 *                 description: ID do usuário que está disparando o envio.
 *     responses:
 *       200:
 *         description: Envio individual disparado com sucesso.
 *       400:
 *         description: Dados de entrada inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
// Rota para disparo individual
envioRouter.post('/envio/individual', envioController.dispararIndividual);

// Rota para disparo em massa
/**
 * @swagger
 * /envio/massa:
 *   post:
 *     summary: Dispara envios de formulário em massa para todos os clientes de uma campanha
 *     tags: [Envios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campanhaId
 *               - usuarioId
 *             properties:
 *               campanhaId:
 *                 type: string
 *                 description: ID da campanha para o disparo em massa.
 *               usuarioId:
 *                 type: string
 *                 description: ID do usuário que está disparando o envio.
 *     responses:
 *       200:
 *         description: Envios em massa disparados com sucesso.
 *       400:
 *         description: Dados de entrada inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
envioRouter.post('/envio/massa', envioController.dispararEmMassa);

// Rota para retentativa de envios
/**
 * @swagger
 * /envio/retentar:
 *   post:
 *     summary: Retenta o envio de formulários que falharam anteriormente
 *     tags: [Envios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campanhaId
 *             properties:
 *               campanhaId:
 *                 type: string
 *                 description: ID da campanha para a qual a retentativa será executada.
 *     responses:
 *       200:
 *         description: Retentativa de envios disparada com sucesso.
 *       400:
 *         description: Dados de entrada inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
envioRouter.post('/envio/retentar', envioController.retentarPendentes);

export { envioRouter };
