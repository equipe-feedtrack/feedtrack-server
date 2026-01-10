// src/modules/formulario/infra/http/controllers/pergunta.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AtualizarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/AtualizarPerguntaUseCase';
import { BuscarPerguntaPorIdUseCase } from '@modules/formulario/application/use-cases/pergunta/BuscarPerguntaPorIdUseCase';
import { CriarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/criarPerguntaUseCase';
import { DeletarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/DeletarPerguntaUseCase';
import { PerguntaException } from '@modules/formulario/domain/pergunta/pergunta.exception';
import { ListarPerguntasUseCase } from '@modules/formulario/application/use-cases/pergunta/listar-perguntas.usecase';

/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Perguntas.
 */
export class PerguntaController {
  constructor(
    private readonly _criarPerguntaUseCase: CriarPerguntaUseCase,
    private readonly _buscarPerguntaPorIdUseCase: BuscarPerguntaPorIdUseCase,
    private readonly _listarPerguntasUseCase: ListarPerguntasUseCase,
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
      const { id, empresaId} = req.params;
      const perguntaDTO = await this._buscarPerguntaPorIdUseCase.execute({id, empresaId});

      if (!perguntaDTO) {
        res.status(404).json({ message: 'Pergunta não encontrada.' });
      }

      res.status(200).json(perguntaDTO);
    } catch (error: any) {
      next(error);
    }
  };

public listar = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { empresaId } = req.query;

    if (!empresaId) {
      return res.status(400).json({ message: "Parâmetro 'empresa' é obrigatório." });
    }

    const empresa = String(empresaId);
    const perguntasDTO = await this._listarPerguntasUseCase.execute(empresa);
    return res.status(200).json(perguntasDTO);
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
      const { id, empresaId } = req.params;
      await this._deletarPerguntaUseCase.execute({id, empresaId});
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
