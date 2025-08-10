// src/modules/produtos/presentation/controllers/produto.controller.ts

import { Request, Response, NextFunction } from 'express';
// Importar todos os casos de uso
import { ListarProdutosInput, ListarProdutosUseCase } from '@modules/produtos/application/use-cases/listar_produtos';
import { DeletarProdutoUseCase } from '@modules/produtos/application/use-cases/deletar_produto';
import { AtualizarProdutoUseCase } from '@modules/produtos/application/use-cases/atualizar_produto';
import { BuscarProdutoPorIdUseCase } from '@modules/produtos/application/use-cases/buscar_produto_por_id';
import { CriarProdutoUseCase } from '@modules/produtos/application/use-cases/criar_produto';

// Importar DTOs de input/output
import { AtualizarProdutoInputDTO } from '@modules/produtos/application/dto/atualizar_produto_input.dto';
import { CriarProdutoInputDTO } from '@modules/produtos/application/dto/criar_produto_input.dto';

// Exceções personalizadas (se tiver)
class BadRequestError extends Error { /* ... */ }
class NotFoundError extends Error { /* ... */ } // Para quando não encontrar algo

export class ProdutoController {
  constructor(
    private readonly criarProdutoUseCase: CriarProdutoUseCase,
    private readonly buscarProdutoPorIdUseCase: BuscarProdutoPorIdUseCase,
    private readonly atualizarProdutoUseCase: AtualizarProdutoUseCase,
    private readonly deletarProdutoUseCase: DeletarProdutoUseCase,
    private readonly listarProdutosUseCase: ListarProdutosUseCase
  ) { }

  // Métodos do Controlador
  public criarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // ... (validações de input) ...
      const inputDTO: CriarProdutoInputDTO = req.body; // Requisição direta
      const produtoCriado = await this.criarProdutoUseCase.execute(inputDTO);
      res.status(201).json(produtoCriado);
    } catch (error: any) {
      next(error); // Encaminha o erro para o middleware de erros global
    }
  }

  public buscarProdutoPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório.');

      const produto = await this.buscarProdutoPorIdUseCase.execute(id);
      if (!produto) throw new NotFoundError(`Produto com ID ${id} não encontrado.`);

      res.status(200).json(produto);
    } catch (error: any) {
      next(error);
    }
  }

  public listarProdutos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Implementar lógica de filtros a partir de req.query
      const { ativo, cliente_id } = req.query; // Tipagem básica para filtros
      let ativoBoolean: boolean | undefined;
      if (typeof ativo === 'string') {
        ativoBoolean = ativo.toLowerCase() === 'true'; // Converte "true" para true, "false" para false
      }

      const filtros: ListarProdutosInput = {
        ativo: ativoBoolean, // Passa o booleano convertido
        cliente_id: typeof cliente_id === 'string' ? cliente_id : undefined, // Garante que cliente_id é string ou undefined
      };
      const produtos = await this.listarProdutosUseCase.execute(filtros);
      res.status(200).json(produtos);
    } catch (error: any) {
      next(error);
    }
  }

  public atualizarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório para atualização.');

      const inputDTO: AtualizarProdutoInputDTO = { id, ...req.body };
      const produtoAtualizado = await this.atualizarProdutoUseCase.execute(inputDTO);

      res.status(200).json(produtoAtualizado);
    } catch (error: any) {
      next(error);
    }
  }

  public deletarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório para exclusão.');

      await this.deletarProdutoUseCase.execute(id);
      res.json({ message: 'Produto deletado com sucesso.' });
      res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error: any) {
      next(error);
    }
  }
}
