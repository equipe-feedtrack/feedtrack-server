import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CampanhaRepositoryPrisma } from '../infra/campanha/campanha.repository.prisma';
import { FormularioRepositoryPrisma } from '@modules/formulario/infra/formulario/formulario.repository.prisma';
import { CriarCampanhaUseCase } from '../application/use-cases/criarCampanhaUseCase';
import { ListarCampanhasUseCase } from '../application/use-cases/listarCampanhaUseCase';
import { BuscarCampanhaPorIdUseCase } from '../application/use-cases/buscarCampanhaUseCase';
import { AtualizarCampanhaUseCase } from '../application/use-cases/atualizarCampanhaUseCase';
import { DeletarCampanhaUseCase } from '../application/use-cases/deletarCampanhaUseCase';
import { CampanhaController } from './controller/campanha.controller';


// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================

// 1. Instanciar o Prisma Client
const prismaClient = new PrismaClient();

// 2. Instanciar os Repositórios
const campanhaRepository = new CampanhaRepositoryPrisma(prismaClient);
const formularioRepository = new FormularioRepositoryPrisma(prismaClient); // Necessário para o CriarCampanhaUseCase

// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarCampanhaUseCase = new CriarCampanhaUseCase(campanhaRepository, formularioRepository);
const listarCampanhasUseCase = new ListarCampanhasUseCase(campanhaRepository);
const buscarCampanhaPorIdUseCase = new BuscarCampanhaPorIdUseCase(campanhaRepository);
const atualizarCampanhaUseCase = new AtualizarCampanhaUseCase(campanhaRepository);
const deletarCampanhaUseCase = new DeletarCampanhaUseCase(campanhaRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const campanhaController = new CampanhaController(
  criarCampanhaUseCase,
  listarCampanhasUseCase,
  buscarCampanhaPorIdUseCase,
  atualizarCampanhaUseCase,
  deletarCampanhaUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const campanhaRouter = Router();

// Rota para criar uma nova campanha
campanhaRouter.post('/campanha',  campanhaController.criar);

// Rota para listar todas as campanhas
campanhaRouter.get('/campanhas',  campanhaController.listar);

// Rota para buscar uma campanha por ID
campanhaRouter.get('/campanha/:id', campanhaController.buscarPorId);

// Rota para atualizar uma campanha
campanhaRouter.put('/update-campanha/:id', campanhaController.atualizar);

// Rota para deletar uma campanha
campanhaRouter.delete('/delete-campanha/:id', campanhaController.deletar);

export { campanhaRouter };
