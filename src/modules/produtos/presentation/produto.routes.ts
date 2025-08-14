// src/modules/formulario/infra/http/routes/produto.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { ListarProdutosUseCase } from '../application/use-cases/listar_produtos';
import { ProdutoController } from './controller/produto.controller';
import { DeletarProdutoUseCase } from '../application/use-cases/deletar_produto';
import { AtualizarProdutoUseCase } from '../application/use-cases/atualizar_produto';
import { BuscarProdutoPorIdUseCase } from '../application/use-cases/buscar_produto_por_id';
import { CriarProdutoUseCase } from '../application/use-cases/criar_produto';
import { ClienteRepositoryPrisma } from '@modules/gestao_clientes/infra/cliente.repository.prisma';
import { ProdutoRepositoryPrisma } from '../infra/produto.repository.prisma';
import { ReativarProdutoUseCase } from '../application/use-cases/reativar_produto';

// --- INICIALIZAÇÃO DE DEPENDÊNCIAS ---
// O PrismaClient deve ser instanciado uma única vez na aplicação.
// Aqui, ele é instanciado para este módulo, mas em uma aplicação maior,
// você poderia passá-lo via injeção de dependência global.
const prisma = new PrismaClient();

// Repositórios
const produtoRepository = new ProdutoRepositoryPrisma(prisma);
const clienteRepository = new ClienteRepositoryPrisma(prisma);

// Casos de Uso
const criarProdutoUseCase = new CriarProdutoUseCase(produtoRepository, clienteRepository);
const buscarProdutoPorIdUseCase = new BuscarProdutoPorIdUseCase(produtoRepository);
const atualizarProdutoUseCase = new AtualizarProdutoUseCase(produtoRepository);
const deletarProdutoUseCase = new DeletarProdutoUseCase(produtoRepository);
const listarProdutosUseCase = new ListarProdutosUseCase(produtoRepository);
const reativarProdutoUseCase = new ReativarProdutoUseCase(produtoRepository)

// Controlador
const produtoController = new ProdutoController(
  criarProdutoUseCase,
  buscarProdutoPorIdUseCase,
  atualizarProdutoUseCase,
  deletarProdutoUseCase,
  listarProdutosUseCase,
  reativarProdutoUseCase
);

// --- DEFINIÇÃO DO ROUTER ---
const produtoRouter = Router();

/**
 * @swagger
 * /produto:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *               - valor
 *               - cliente_id
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto.
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto.
 *               valor:
 *                 type: number
 *                 format: float
 *                 description: Valor do produto.
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 valor:
 *                   type: number
 *                 ativo:
 *                   type: boolean
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
produtoRouter.post('/produto', produtoController.criarProduto);

/**
 * @swagger
 * /produto/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Detalhes do produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 valor:
 *                   type: number
 *                 ativo:
 *                   type: boolean
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
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
produtoRouter.get('/produto/:id', produtoController.buscarProdutoPorId);

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos ou produtos filtrados
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtra produtos por status ativo (opcional).
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: string
 *         description: Filtra produtos por ID do cliente (opcional).
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   valor:
 *                     type: number
 *                   ativo:
 *                     type: boolean
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
produtoRouter.get('/produtos', produtoController.listarProdutos);

/**
 * @swagger
 * /atualizar-produto/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do produto (opcional).
 *               descricao:
 *                 type: string
 *                 description: Nova descrição do produto (opcional).
 *               valor:
 *                 type: number
 *                 format: float
 *                 description: Novo valor do produto (opcional).
 *               ativo:
 *                 type: boolean
 *                 description: Define se o produto está ativo ou inativo (opcional).
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 valor:
 *                   type: number
 *                 ativo:
 *                   type: boolean
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
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
produtoRouter.put('/atualizar-produto/:id', produtoController.atualizarProduto);

/**
 * @swagger
 * /deletar-produto/{id}:
 *   delete:
 *     summary: Deleta um produto (exclusão lógica)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser deletado.
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (sem conteúdo).
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
produtoRouter.delete('/deletar-produto/:id', produtoController.deletarProduto);

/**
 * @swagger
 * /reativar-produto/{id}:
 *   patch:
 *     summary: Reativa um produto (define ativo como true e dataExclusao como null)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser reativado.
 *     responses:
 *       200:
 *         description: Produto reativado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 valor:
 *                   type: number
 *                 ativo:
 *                   type: boolean
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
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
produtoRouter.patch('/reativar-produto/:id', produtoController.reativarProduto);

export default produtoRouter;
