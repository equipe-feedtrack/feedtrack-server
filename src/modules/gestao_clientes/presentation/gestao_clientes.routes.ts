// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// Em uma aplicação real, isso seria gerido por um container de DI.
// ====================================================================

import { PrismaClient } from "@prisma/client";
import { ClienteRepositoryPrisma } from "../infra/cliente.repository.prisma";
import { ProdutoRepositoryPrisma } from "@modules/produtos/infra/produto.repository.prisma";
import { CriarClienteUseCase } from "../application/use-cases/criar_cliente";
import { ListarClientesUseCase } from "../application/use-cases/listar_clientes";
import { BuscarClientePorIdUseCase } from "../application/use-cases/buscar_cliente_por_id";
import { AtualizarClienteUseCase } from "../application/use-cases/atualizar_cliente";
import { DeletarClienteUseCase } from "../application/use-cases/deletar_cliente";
import { ClienteController } from "./controller/gestao_clientes.controller";
import { Router } from "express";

// 1. Instanciar o Prisma Client
const PrismaRepository = new PrismaClient();

// 2. Instanciar os Repositórios
const clienteRepository = new ClienteRepositoryPrisma(PrismaRepository);
const produtoRepository = new ProdutoRepositoryPrisma(PrismaRepository); // O CriarClienteUseCase precisa disto

// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarClienteUseCase = new CriarClienteUseCase(clienteRepository, produtoRepository);
const listarClientesUseCase = new ListarClientesUseCase(clienteRepository);
const buscarClientePorIdUseCase = new BuscarClientePorIdUseCase(clienteRepository);
const atualizarClienteUseCase = new AtualizarClienteUseCase(clienteRepository, produtoRepository);
const deletarClienteUseCase = new DeletarClienteUseCase(clienteRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const clienteController = new ClienteController(
  criarClienteUseCase,
  listarClientesUseCase,
  buscarClientePorIdUseCase,
  atualizarClienteUseCase,
  deletarClienteUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const clienteRouter = Router();

// Rota para criar um novo cliente
clienteRouter.post('/cliente', (req, res) => clienteController.criar(req, res));

// Rota para listar todos os clientes (com filtros opcionais)
clienteRouter.get('/clientes', (req, res) => clienteController.listar(req, res));

// Rota para buscar um cliente específico por ID
clienteRouter.get('/cliente/:id', (req, res) => clienteController.buscarPorId(req, res));

// Rota para atualizar um cliente existente
clienteRouter.put('/update-cliente/:id', (req, res) => clienteController.atualizar(req, res));

// Rota para deletar (logicamente) um cliente
clienteRouter.delete('/delete-cliente/:id', (req, res) => clienteController.deletar(req, res));

export { clienteRouter };