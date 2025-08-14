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
import { GerenciarProdutosClienteUseCase } from "../application/use-cases/gerenciarProdutosCliente.use-case";

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
const gerenciarProdutosClienteUseCase = new GerenciarProdutosClienteUseCase(clienteRepository, produtoRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const clienteController = new ClienteController(
  criarClienteUseCase,
  listarClientesUseCase,
  buscarClientePorIdUseCase,
  atualizarClienteUseCase,
  deletarClienteUseCase,
  gerenciarProdutosClienteUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const clienteRouter = Router();

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pessoa
 *               - vendedorResponsavel
 *               - idsProdutos
 *             properties:
 *               pessoa:
 *                 type: object
 *                 required:
 *                   - nome
 *                   - telefone
 *                 properties:
 *                   nome:
 *                     type: string
 *                     description: Nome da pessoa.
 *                   email:
 *                     type: string
 *                     format: email
 *                     nullable: true
 *                     description: Email da pessoa (opcional).
 *                   telefone:
 *                     type: string
 *                     description: Telefone da pessoa.
 *               cidade:
 *                 type: string
 *                 nullable: true
 *                 description: Cidade do cliente (opcional).
 *               vendedorResponsavel:
 *                 type: string
 *                 description: Nome do vendedor responsável.
 *               idsProdutos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs dos produtos associados ao cliente.
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 pessoa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                 cidade:
 *                   type: string
 *                 vendedorResponsavel:
 *                   type: string
 *                 status:
 *                   type: string
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       descricao:
 *                         type: string
 *                       valor:
 *                         type: number
 *                       ativo:
 *                         type: boolean
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.post('/cliente', clienteController.criar);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVO, INATIVO]
 *         description: Filtra clientes por status (opcional).
 *     responses:
 *       200:
 *         description: Lista de clientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   pessoa:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telefone:
 *                         type: string
 *                   cidade:
 *                     type: string
 *                   vendedorResponsavel:
 *                     type: string
 *                   status:
 *                     type: string
 *                   produtos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *                         descricao:
 *                           type: string
 *                         valor:
 *                           type: number
 *                         ativo:
 *                           type: boolean
 *                   dataCriacao:
 *                     type: string
 *                     format: date-time
 *                   dataAtualizacao:
 *                     type: string
 *                     format: date-time
 *                   dataExclusao:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.get('/clientes',clienteController.listar);

/**
 * @swagger
 * /cliente/{id}:
 *   get:
 *     summary: Busca um cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Detalhes do cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 pessoa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                 cidade:
 *                   type: string
 *                 vendedorResponsavel:
 *                   type: string
 *                 status:
 *                   type: string
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       descricao:
 *                         type: string
 *                       valor:
 *                         type: number
 *                       ativo:
 *                         type: boolean
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.get('/cliente/:id', clienteController.buscarPorId);

/**
 * @swagger
 * /atualizar-cliente/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pessoa:
 *                 type: object
 *                 properties:
 *                   nome:
 *                     type: string
 *                     description: Novo nome da pessoa (opcional).
 *                   email:
 *                     type: string
 *                     format: email
 *                     nullable: true
 *                     description: Novo email da pessoa (opcional).
 *                   telefone:
 *                     type: string
 *                     description: Novo telefone da pessoa (opcional).
 *               cidade:
 *                 type: string
 *                 nullable: true
 *                 description: Nova cidade do cliente (opcional).
 *               vendedorResponsavel:
 *                 type: string
 *                 description: Novo vendedor responsável (opcional).
 *               status:
 *                 type: string
 *                 enum: [ATIVO, INATIVO]
 *                 description: Novo status do cliente (opcional).
 *               idsProdutosParaAdicionar:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de produtos para adicionar ao cliente (opcional).
 *               idsProdutosParaRemover:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de produtos para remover do cliente (opcional).
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 pessoa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                 cidade:
 *                   type: string
 *                 vendedorResponsavel:
 *                   type: string
 *                 status:
 *                   type: string
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       descricao:
 *                         type: string
 *                       valor:
 *                         type: number
 *                       ativo:
 *                         type: boolean
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.put('/atualizar-cliente/:id', clienteController.atualizar);

/**
 * @swagger
 * /deletar-cliente/{id}:
 *   delete:
 *     summary: Deleta um cliente (exclusão lógica)
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente a ser deletado.
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso (sem conteúdo).
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.delete('/deletar-cliente/:id', clienteController.deletar);

/**
 * @swagger
 * /cliente/{clienteId}/produtos:
 *   post:
 *     summary: Gerencia produtos associados a um cliente (adicionar/remover)
 *     tags: Clientes
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idsProdutosParaAdicionar:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de produtos para adicionar ao cliente (opcional).
 *               idsProdutosParaRemover:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de produtos para remover do cliente (opcional).
 *     responses:
 *       200:
 *         description: Produtos do cliente atualizados com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Cliente ou produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
clienteRouter.post('/:clienteId/produtos', (req, res, next) => clienteController.gerenciarProdutos(req, res, next));

export { clienteRouter };