// src/modules/formulario/infra/http/controllers/formulario.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AtualizarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/atualizarFormularioUseCase';
import { BuscarFormularioPorIdUseCase } from '@modules/formulario/application/use-cases/formulario/buscarFormularioPorIdUseCase';
import { CriarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/CriarFormularioUseCase';
import { DeletarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/deletarFormularioUseCase';
import { ListarFormulariosUseCase } from '@modules/formulario/application/use-cases/formulario/listarFormulariosUseCase';
import { FormularioException } from '@modules/formulario/domain/formulario/formulario.exception';


/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Formulários.
 * A refatoração utiliza arrow functions para manter o contexto do 'this' e o
 * parâmetro 'next' para um tratamento de erros mais robusto.
 */
export class FormularioController {
  constructor(
    private readonly _criarFormularioUseCase: CriarFormularioUseCase,
    private readonly _listarFormulariosUseCase: ListarFormulariosUseCase,
    private readonly _buscarFormularioPorIdUseCase: BuscarFormularioPorIdUseCase,
    private readonly _atualizarFormularioUseCase: AtualizarFormularioUseCase,
    private readonly _deletarFormularioUseCase: DeletarFormularioUseCase
  ) { }

  /**
   * Lida com a requisição para criar um novo formulário.
   * Rota: POST /formularios
   */
  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const formularioCriadoDTO = await this._criarFormularioUseCase.execute(req.body);
      res.status(201).json(formularioCriadoDTO);
    } catch (error: any) {
      // Em vez de tratar o erro aqui, passamos para o próximo middleware
      next(error);
    }
  };

  /**
   * Lida com a requisição para listar formulários.
   * Rota: GET /formularios
   */
  public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { empresaId } = req.query;
      const formulariosDTO = await this._listarFormulariosUseCase.execute({ empresaId: empresaId as string });
      res.status(200).json(formulariosDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para buscar um formulário por seu ID.
   * Rota: GET /formularios/:id
   */
  public buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, empresaId } = req.params;
      const formularioDTO = await this._buscarFormularioPorIdUseCase.execute({id, empresaId});

      if (!formularioDTO) {
        res.status(404).json({ message: 'Formulário não encontrado.' });
        return;
      }

      res.status(200).json(formularioDTO);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Lida com a requisição para atualizar um formulário existente.
   * Rota: PUT /formularios/:id
   */
  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };

      const formularioAtualizadoDTO = await this._atualizarFormularioUseCase.execute(inputDTO);
      res.status(200).json(formularioAtualizadoDTO);
    } catch (error: any) {
      if (error instanceof FormularioException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  /**
   * Lida com a requisição para deletar um formulário.
   * Rota: DELETE /formularios/:id
   */
  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, empresaId } = req.params;
      await this._deletarFormularioUseCase.execute({id, empresaId});
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof FormularioException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
