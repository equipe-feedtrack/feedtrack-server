// src/modules/produtos/presentation/controllers/produto.controller.ts (Adaptado)

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
import { AtualizarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/atualizar_cliente";
import { BuscarClientePorIdUseCase } from "@modules/gestao_clientes/application/use-cases/buscar_cliente_por_id";
import { CriarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/criar_cliente";
import { DeletarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/deletar_cliente";
import { ListarClientesUseCase } from "@modules/gestao_clientes/application/use-cases/listar_clientes";
import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";


// Exceções personalizadas (se tiver)
class BadRequestError extends Error { /* ... */ }
class NotFoundError extends Error { /* ... */ } // Para quando não encontrar algo

export class ClienteController {
  constructor(
    private readonly _criarClienteUseCase: CriarClienteUseCase,
    private readonly _listarClientesUseCase: ListarClientesUseCase,
    private readonly _buscarClientePorIdUseCase: BuscarClientePorIdUseCase,
    private readonly _atualizarClienteUseCase: AtualizarClienteUseCase,
    private readonly _deletarClienteUseCase: DeletarClienteUseCase,
  ) { }

  /**
   * Lida com a requisição para criar um novo cliente.
   * Rota: POST /clientes
   */
  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Os dados de entrada vêm do corpo da requisição.
      const clienteCriadoDTO = await this._criarClienteUseCase.execute(req.body);
      res.status(201).json(clienteCriadoDTO);
    } catch (error: any) {
      // Tratamento de erros genéricos ou de validação.
      next(error);
    }
  }

  /**
   * Lida com a requisição para listar clientes, com filtros opcionais.
   * Rota: GET /clientes
   */
  public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Os filtros vêm da query string da URL (ex: /clientes?status=ATIVO).
      const clientesDTO = await this._listarClientesUseCase.execute(req.query);
      res.status(200).json(clientesDTO);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Lida com a requisição para buscar um cliente por seu ID.
   * Rota: GET /clientes/:id
   */
  public buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const clienteDTO = await this._buscarClientePorIdUseCase.execute(id);

      if (!clienteDTO) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      res.status(200).json(clienteDTO);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Lida com a requisição para atualizar um cliente existente.
   * Rota: PUT /clientes/:id
   */
  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // Combina o ID da rota com os dados do corpo da requisição.
      const inputDTO = { id, ...req.body };

      const clienteAtualizadoDTO = await this._atualizarClienteUseCase.execute(inputDTO);
      res.status(200).json(clienteAtualizadoDTO);
    } catch (error: any) {
      // Trata erros específicos, como cliente não encontrado.
      if (error instanceof ClienteExceptions.ClienteNaoEncontrado) {
        res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Lida com a requisição para deletar (logicamente) um cliente.
   * Rota: DELETE /clientes/:id
   */
  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deletarClienteUseCase.execute(id);
      // Retorna uma resposta 204 No Content, indicando sucesso sem corpo de resposta.
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof ClienteExceptions.ClienteNaoEncontrado) {
        res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

}
