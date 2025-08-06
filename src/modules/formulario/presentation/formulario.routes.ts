import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FormularioRepositoryPrisma } from '../infra/formulario/formulario.repository.prisma';
import { PerguntaRepositoryPrisma } from '../infra/pergunta/pergunta.repository.prisma';
import { CriarFormularioUseCase } from '../application/use-cases/formulario/CriarFormularioUseCase';
import { ListarFormulariosUseCase } from '../application/use-cases/formulario/listarFormulariosUseCase';
import { BuscarFormularioPorIdUseCase } from '../application/use-cases/formulario/buscarFormularioPorIdUseCase';
import { AtualizarFormularioUseCase } from '../application/use-cases/formulario/atualizarFormularioUseCase';
import { FormularioController } from './controller/formulario.controller';
import { DeletarFormularioUseCase } from '../application/use-cases/formulario/deletarFormularioUseCase';

// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================

// 1. Instanciar o Prisma Client
const prismaClient = new PrismaClient();

// 2. Instanciar os Repositórios
const formularioRepository = new FormularioRepositoryPrisma(prismaClient);
const perguntaRepository = new PerguntaRepositoryPrisma(prismaClient); // Necessário para os casos de uso de formulário

// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarFormularioUseCase = new CriarFormularioUseCase(formularioRepository, perguntaRepository);
const listarFormulariosUseCase = new ListarFormulariosUseCase(formularioRepository);
const buscarFormularioPorIdUseCase = new BuscarFormularioPorIdUseCase(formularioRepository);
const atualizarFormularioUseCase = new AtualizarFormularioUseCase(formularioRepository, perguntaRepository);
const deletarFormularioUseCase = new DeletarFormularioUseCase(formularioRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const formularioController = new FormularioController(
  criarFormularioUseCase,
  listarFormulariosUseCase,
  buscarFormularioPorIdUseCase,
  atualizarFormularioUseCase,
  deletarFormularioUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const formularioRouter = Router();

// Rota para criar um novo formulário
formularioRouter.post('/formulario',formularioController.criar);

// Rota para listar todos os formulários
formularioRouter.get('/formularios',  formularioController.listar);

// Rota para buscar um formulário por ID
formularioRouter.get('/formulario/:id',  formularioController.buscarPorId);

// Rota para atualizar um formulário
formularioRouter.put('/update-formulario/:id', formularioController.atualizar);

// Rota para deletar um formulário
formularioRouter.delete('/delete-formulario/:id', formularioController.deletar);

export { formularioRouter };
