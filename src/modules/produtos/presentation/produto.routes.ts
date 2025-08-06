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

// Controlador
const produtoController = new ProdutoController(
  criarProdutoUseCase,
  buscarProdutoPorIdUseCase,
  atualizarProdutoUseCase,
  deletarProdutoUseCase,
  listarProdutosUseCase,
);

// --- DEFINIÇÃO DO ROUTER ---
const produtoRouter = Router();

// Rota para criar um novo produto
// POST /produtos
produtoRouter.post('/product', produtoController.criarProduto);

// Rota para buscar um produto por ID
// GET /produtos/:id
produtoRouter.get('/product/:id', produtoController.buscarProdutoPorId);

// Rota para listar todos os produtos ou produtos filtrados
// GET /produtos
produtoRouter.get('/products', produtoController.listarProdutos);

// Rota para atualizar um produto existente
// PUT /produtos/:id
produtoRouter.put('/update-product/:id', produtoController.atualizarProduto);

// Rota para deletar (logicamente) um produto
// DELETE /produtos/:id
produtoRouter.delete('/delete-product/:id', produtoController.deletarProduto);

export default produtoRouter;
