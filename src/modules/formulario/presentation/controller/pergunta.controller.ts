// src/modules/formulario/infra/http/controllers/pergunta.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AtualizarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/AtualizarPerguntaUseCase';
import { BuscarPerguntaPorIdUseCase } from '@modules/formulario/application/use-cases/pergunta/BuscarPerguntaPorIdUseCase';
import { CriarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/criarPerguntaUseCase';
import { DeletarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/DeletarPerguntaUseCase';
import { PerguntaException } from '@modules/formulario/domain/pergunta/pergunta.exception';

/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Perguntas.
 */
export class PerguntaController {
  constructor(
    private readonly _criarPerguntaUseCase: CriarPerguntaUseCase,
    private readonly _buscarPerguntaPorIdUseCase: BuscarPerguntaPorIdUseCase,
    private readonly _atualizarPerguntaUseCase: AtualizarPerguntaUseCase,
    private readonly _deletarPerguntaUseCase: DeletarPerguntaUseCase
  ) { }

  /**
   * Lida com a requisição para criar uma nova pergunta.
   * Rota: POST /perguntas
   */
  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const perguntaCriadaDTO = await this._criarPerguntaUseCase.execute(req.body);
      res.status(201).json(perguntaCriadaDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para buscar uma pergunta por seu ID.
   * Rota: GET /perguntas/:id
   */
  public buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const perguntaDTO = await this._buscarPerguntaPorIdUseCase.execute(id);

      if (!perguntaDTO) {
        res.status(404).json({ message: 'Pergunta não encontrada.' });
      }

      res.status(200).json(perguntaDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para atualizar uma pergunta existente.
   * Rota: PUT /perguntas/:id
   */
  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };

      const perguntaAtualizadaDTO = await this._atualizarPerguntaUseCase.execute(inputDTO);
      res.status(200).json(perguntaAtualizadaDTO);
    } catch (error: any) {
      if (error instanceof PerguntaException) {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * Lida com a requisição para deletar uma pergunta.
   * Rota: DELETE /perguntas/:id
   */
  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deletarPerguntaUseCase.execute(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof PerguntaException) {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };
}
