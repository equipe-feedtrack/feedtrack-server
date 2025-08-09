import { Request, Response, NextFunction } from 'express';
import { AtualizarCampanhaUseCase } from "@modules/campanha/application/use-cases/atualizarCampanhaUseCase";
import { BuscarCampanhaPorIdUseCase } from "@modules/campanha/application/use-cases/buscarCampanhaUseCase";
import { CriarCampanhaUseCase } from "@modules/campanha/application/use-cases/criarCampanhaUseCase";
import { DeletarCampanhaUseCase } from "@modules/campanha/application/use-cases/deletarCampanhaUseCase";
import { ListarCampanhasUseCase } from "@modules/campanha/application/use-cases/listarCampanhaUseCase";
import { CampanhaNaoEncontradaException } from '@modules/campanha/application/exceptions/campanha.exception';

/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Campanhas.
 * A refatoração utiliza arrow functions para manter o contexto do 'this' e o
 * parâmetro 'next' para um tratamento de erros mais robusto.
 */
export class CampanhaController {
  constructor(
    private readonly _criarCampanhaUseCase: CriarCampanhaUseCase,
    private readonly _listarCampanhasUseCase: ListarCampanhasUseCase,
    private readonly _buscarCampanhaPorIdUseCase: BuscarCampanhaPorIdUseCase,
    private readonly _atualizarCampanhaUseCase: AtualizarCampanhaUseCase,
    private readonly _deletarCampanhaUseCase: DeletarCampanhaUseCase
  ) { }

  /**
   * Lida com a requisição para criar uma nova campanha.
   * Rota: POST /campanhas
   */
  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const campanhaCriadaDTO = await this._criarCampanhaUseCase.execute(req.body);
      res.status(201).json(campanhaCriadaDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para listar todas as campanhas.
   * Rota: GET /campanhas
   */
  public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const campanhasDTO = await this._listarCampanhasUseCase.execute();
      res.status(200).json(campanhasDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para buscar uma campanha por seu ID.
   * Rota: GET /campanhas/:id
   */
  public buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const campanhaDTO = await this._buscarCampanhaPorIdUseCase.execute(id);

      if (!campanhaDTO) {
        throw new CampanhaNaoEncontradaException();
      }

      res.status(200).json(campanhaDTO);
    } catch (error: any) {
        if (error instanceof CampanhaNaoEncontradaException) {
            res.status(404).json({ message: error.message });
            return;
        }
      next(error);
    }
  };

  /**
   * Lida com a requisição para atualizar uma campanha existente.
   * Rota: PUT /campanhas/:id
   */
  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };

      const campanhaAtualizadaDTO = await this._atualizarCampanhaUseCase.execute(inputDTO);
      res.status(200).json(campanhaAtualizadaDTO);
    } catch (error: any) {
      if (error instanceof CampanhaNaoEncontradaException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  /**
   * Lida com a requisição para deletar uma campanha.
   * Rota: DELETE /campanhas/:id
   */
  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deletarCampanhaUseCase.execute(id);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof CampanhaNaoEncontradaException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
