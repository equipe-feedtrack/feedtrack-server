import { AtualizarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/AtualizarPerguntaUseCase';
import { BuscarPerguntaPorIdUseCase } from '@modules/formulario/application/use-cases/pergunta/BuscarPerguntaPorIdUseCase';
import { CriarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/criarPerguntaUseCase';
import { DeletarPerguntaUseCase } from '@modules/formulario/application/use-cases/pergunta/DeletarPerguntaUseCase';
import { Request, Response } from 'express';

/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Perguntas.
 */
export class PerguntaController {
  constructor(
    private readonly _criarPerguntaUseCase: CriarPerguntaUseCase,
    private readonly _buscarPerguntaPorIdUseCase: BuscarPerguntaPorIdUseCase,
    private readonly _atualizarPerguntaUseCase: AtualizarPerguntaUseCase,
    private readonly _deletarPerguntaUseCase: DeletarPerguntaUseCase
  ) {}

  /**
   * Lida com a requisição para criar uma nova pergunta.
   * Rota: POST /perguntas
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const perguntaCriadaDTO = await this._criarPerguntaUseCase.execute(req.body);
      return res.status(201).json(perguntaCriadaDTO);
    } catch (error: any) {
      return res.status(400).json({
        message: 'Erro ao criar pergunta.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para buscar uma pergunta por seu ID.
   * Rota: GET /perguntas/:id
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const perguntaDTO = await this._buscarPerguntaPorIdUseCase.execute(id);

      if (!perguntaDTO) {
        return res.status(404).json({ message: 'Pergunta não encontrada.' });
      }

      return res.status(200).json(perguntaDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao buscar pergunta.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para atualizar uma pergunta existente.
   * Rota: PUT /perguntas/:id
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };
      
      const perguntaAtualizadaDTO = await this._atualizarPerguntaUseCase.execute(inputDTO);
      return res.status(200).json(perguntaAtualizadaDTO);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({
        message: 'Erro ao atualizar pergunta.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para deletar uma pergunta.
   * Rota: DELETE /perguntas/:id
   */
  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this._deletarPerguntaUseCase.execute(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Erro ao deletar pergunta.',
        error: error.message,
      });
    }
  }
}
