"use strict";
// src/modules/formulario/infra/http/routes/produto.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const listar_produtos_1 = require("../application/use-cases/listar_produtos");
const produto_controller_1 = require("./controller/produto.controller");
const deletar_produto_1 = require("../application/use-cases/deletar_produto");
const atualizar_produto_1 = require("../application/use-cases/atualizar_produto");
const buscar_produto_por_id_1 = require("../application/use-cases/buscar_produto_por_id");
const criar_produto_1 = require("../application/use-cases/criar_produto");
const cliente_repository_prisma_1 = require("@modules/gestao_clientes/infra/cliente.repository.prisma");
const produto_repository_prisma_1 = require("../infra/produto.repository.prisma");
// --- INICIALIZAÇÃO DE DEPENDÊNCIAS ---
// O PrismaClient deve ser instanciado uma única vez na aplicação.
// Aqui, ele é instanciado para este módulo, mas em uma aplicação maior,
// você poderia passá-lo via injeção de dependência global.
const prisma = new client_1.PrismaClient();
// Repositórios
const produtoRepository = new produto_repository_prisma_1.ProdutoRepositoryPrisma(prisma);
const clienteRepository = new cliente_repository_prisma_1.ClienteRepositoryPrisma(prisma);
// Casos de Uso
const criarProdutoUseCase = new criar_produto_1.CriarProdutoUseCase(produtoRepository, clienteRepository);
const buscarProdutoPorIdUseCase = new buscar_produto_por_id_1.BuscarProdutoPorIdUseCase(produtoRepository);
const atualizarProdutoUseCase = new atualizar_produto_1.AtualizarProdutoUseCase(produtoRepository);
const deletarProdutoUseCase = new deletar_produto_1.DeletarProdutoUseCase(produtoRepository);
const listarProdutosUseCase = new listar_produtos_1.ListarProdutosUseCase(produtoRepository);
// Controlador
const produtoController = new produto_controller_1.ProdutoController(criarProdutoUseCase, buscarProdutoPorIdUseCase, atualizarProdutoUseCase, deletarProdutoUseCase, listarProdutosUseCase);
// --- DEFINIÇÃO DO ROUTER ---
const produtoRouter = (0, express_1.Router)();
/**
 * @swagger
 * /product:
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
 * /product/{id}:
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
 * /products:
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
 * /update-product/{id}:
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
exports.default = produtoRouter;
//# sourceMappingURL=produto.routes.js.map