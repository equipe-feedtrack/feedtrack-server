import { AtualizarCampanhaUseCase } from "@modules/campanha/application/use-cases/atualizarCampanhaUseCase";
import { BuscarCampanhaPorIdUseCase } from "@modules/campanha/application/use-cases/buscarCampanhaUseCase";
import { CriarCampanhaUseCase } from "@modules/campanha/application/use-cases/criarCampanhaUseCase";
import { DeletarCampanhaUseCase } from "@modules/campanha/application/use-cases/deletarCampanhaUseCase";
import { ListarCampanhasUseCase } from "@modules/campanha/application/use-cases/listarCampanhaUseCase";

export class CampanhaController {
  constructor(
    private readonly _criarCampanhaUseCase: CriarCampanhaUseCase,
    private readonly _listarCampanhasUseCase: ListarCampanhasUseCase,
    private readonly _buscarCampanhaPorIdUseCase: BuscarCampanhaPorIdUseCase,
    private readonly _atualizarCampanhaUseCase: AtualizarCampanhaUseCase,
    private readonly _deletarCampanhaUseCase: DeletarCampanhaUseCase
  ) {}

  /**
   * Lida com a requisição para criar uma nova campanha.
   * Rota: POST /campanhas
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const campanhaCriadaDTO = await this._criarCampanhaUseCase.execute(req.body);
      return res.status(201).json(campanhaCriadaDTO);
    } catch (error: any) {
      return res.status(400).json({
        message: 'Erro ao criar campanha.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para listar todas as campanhas.
   * Rota: GET /campanhas
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const campanhasDTO = await this._listarCampanhasUseCase.execute();
      return res.status(200).json(campanhasDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao listar campanhas.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para buscar uma campanha por seu ID.
   * Rota: GET /campanhas/:id
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const campanhaDTO = await this._buscarCampanhaPorIdUseCase.execute(id);

      if (!campanhaDTO) {
        return res.status(404).json({ message: 'Campanha não encontrada.' });
      }

      return res.status(200).json(campanhaDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao buscar campanha.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para atualizar uma campanha existente.
   * Rota: PUT /campanhas/:id
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const inputDTO = { id, ...req.body };
      
      const campanhaAtualizadaDTO = await this._atualizarCampanhaUseCase.execute(inputDTO);
      return res.status(200).json(campanhaAtualizadaDTO);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({
        message: 'Erro ao atualizar campanha.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para deletar uma campanha.
   * Rota: DELETE /campanhas/:id
   */
  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this._deletarCampanhaUseCase.execute(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Erro ao deletar campanha.',
        error: error.message,
      });
    }
  }
}
