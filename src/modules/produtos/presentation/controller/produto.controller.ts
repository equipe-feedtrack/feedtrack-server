// src/modules/produtos/presentation/controllers/produto.controller.ts (Adaptado)

import { Request, Response } from 'express';
// Importar todos os casos de uso
import { ListarProdutosInput, ListarProdutosUseCase } from '@modules/produtos/application/use-cases/listar_produtos';
import { DeletarProdutoUseCase } from '@modules/produtos/application/use-cases/deletar_produto';
import { AtualizarProdutoUseCase } from '@modules/produtos/application/use-cases/atualizar_produto';
import { BuscarProdutoPorIdUseCase } from '@modules/produtos/application/use-cases/buscar_produto_por_id';
import { CriarProdutoUseCase } from '@modules/produtos/application/use-cases/criar_produto';

// Importar DTOs de input/output
import { AtualizarProdutoInputDTO } from '@modules/produtos/application/dto/atualizar_produto_input.dto';
import { CriarProdutoInputDTO } from '@modules/produtos/application/dto/criar_produto_input.dto';

 // Para validações de enum

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
  ) {}

  // Métodos do Controlador
  public async criarProduto(req: Request, res: Response): Promise<Response> {
    try {
      // ... (validações de input) ...
      const inputDTO: CriarProdutoInputDTO = req.body; // Requisição direta
      const produtoCriado = await this.criarProdutoUseCase.execute(inputDTO);
      return res.status(201).json(produtoCriado);
    } catch (error: any) {
      if (error instanceof BadRequestError) return res.status(400).json({ message: error.message });
      // ... tratar outras exceções ...
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  public async buscarProdutoPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório.');

      const produto = await this.buscarProdutoPorIdUseCase.execute(id);
      if (!produto) throw new NotFoundError(`Produto com ID ${id} não encontrado.`);

      return res.status(200).json(produto);
    } catch (error: any) {
      if (error instanceof BadRequestError) return res.status(400).json({ message: error.message });
      if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  public async listarProdutos(req: Request, res: Response): Promise<Response> {
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
      return res.status(200).json(produtos);
    } catch (error: any) {
      console.error('Erro ao listar produtos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  public async atualizarProduto(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório para atualização.');

      const inputDTO: AtualizarProdutoInputDTO = { id, ...req.body };
      const produtoAtualizado = await this.atualizarProdutoUseCase.execute(inputDTO);

      return res.status(200).json(produtoAtualizado);
    } catch (error: any) {
      if (error instanceof BadRequestError) return res.status(400).json({ message: error.message });
      // ... Tratar outras exceções, como produto não encontrado ...
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  public async deletarProduto(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID do produto é obrigatório para exclusão.');

      await this.deletarProdutoUseCase.execute(id);

      return res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error: any) {
      if (error instanceof BadRequestError) return res.status(400).json({ message: error.message });
      // ... Tratar outras exceções ...
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }
}