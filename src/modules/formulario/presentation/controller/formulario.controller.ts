import { AtualizarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/atualizarFormularioUseCase';
import { BuscarFormularioPorIdUseCase } from '@modules/formulario/application/use-cases/formulario/buscarFormularioPorIdUseCase';
import { CriarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/CriarFormularioUseCase';
import { DeletarFormularioUseCase } from '@modules/formulario/application/use-cases/formulario/deletarFormularioUseCase';
import { ListarFormulariosUseCase } from '@modules/formulario/application/use-cases/formulario/listarFormulariosUseCase';
import { Request, Response } from 'express';

/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Formulários.
 */
export class FormularioController {
  constructor(
    private readonly _criarFormularioUseCase: CriarFormularioUseCase,
    private readonly _listarFormulariosUseCase: ListarFormulariosUseCase,
    private readonly _buscarFormularioPorIdUseCase: BuscarFormularioPorIdUseCase,
    private readonly _atualizarFormularioUseCase: AtualizarFormularioUseCase,
    private readonly _deletarFormularioUseCase: DeletarFormularioUseCase
  ) {}

  /**
   * Lida com a requisição para criar um novo formulário.
   * Rota: POST /formularios
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const formularioCriadoDTO = await this._criarFormularioUseCase.execute(req.body);
      return res.status(201).json(formularioCriadoDTO);
    } catch (error: any) {
      return res.status(400).json({
        message: 'Erro ao criar formulário.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para listar formulários.
   * Rota: GET /formularios
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const formulariosDTO = await this._listarFormulariosUseCase.execute(req.query);
      return res.status(200).json(formulariosDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao listar formulários.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para buscar um formulário por seu ID.
   * Rota: GET /formularios/:id
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const formularioDTO = await this._buscarFormularioPorIdUseCase.execute(id);

      if (!formularioDTO) {
        return res.status(404).json({ message: 'Formulário não encontrado.' });
      }

      return res.status(200).json(formularioDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao buscar formulário.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para atualizar um formulário existente.
   * Rota: PUT /formularios/:id
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };
      
      const formularioAtualizadoDTO = await this._atualizarFormularioUseCase.execute(inputDTO);
      return res.status(200).json(formularioAtualizadoDTO);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({
        message: 'Erro ao atualizar formulário.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para deletar um formulário.
   * Rota: DELETE /formularios/:id
   */
  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this._deletarFormularioUseCase.execute(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Erro ao deletar formulário.',
        error: error.message,
      });
    }
  }
}
