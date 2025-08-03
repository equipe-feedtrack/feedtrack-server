import { AtualizarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/atualizar_cliente";
import { BuscarClientePorIdUseCase } from "@modules/gestao_clientes/application/use-cases/buscar_cliente_por_id";
import { CriarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/criar_cliente";
import { DeletarClienteUseCase } from "@modules/gestao_clientes/application/use-cases/deletar_cliente";
import { ListarClientesUseCase } from "@modules/gestao_clientes/application/use-cases/listar_clientes";
import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";

export class ClienteController {
  constructor(
    private readonly _criarClienteUseCase: CriarClienteUseCase,
    private readonly _listarClientesUseCase: ListarClientesUseCase,
    private readonly _buscarClientePorIdUseCase: BuscarClientePorIdUseCase,
    private readonly _atualizarClienteUseCase: AtualizarClienteUseCase,
    private readonly _deletarClienteUseCase: DeletarClienteUseCase
  ) {}

  /**
   * Lida com a requisição para criar um novo cliente.
   * Rota: POST /clientes
   */
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      // Os dados de entrada vêm do corpo da requisição.
      const clienteCriadoDTO = await this._criarClienteUseCase.execute(req.body);
      return res.status(201).json(clienteCriadoDTO);
    } catch (error: any) {
      // Tratamento de erros genéricos ou de validação.
      return res.status(400).json({
        message: 'Erro ao criar cliente.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para listar clientes, com filtros opcionais.
   * Rota: GET /clientes
   */
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      // Os filtros vêm da query string da URL (ex: /clientes?status=ATIVO).
      const clientesDTO = await this._listarClientesUseCase.execute(req.query);
      return res.status(200).json(clientesDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao listar clientes.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para buscar um cliente por seu ID.
   * Rota: GET /clientes/:id
   */
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const clienteDTO = await this._buscarClientePorIdUseCase.execute(id);

      if (!clienteDTO) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      return res.status(200).json(clienteDTO);
    } catch (error: any) {
      return res.status(500).json({
        message: 'Erro ao buscar cliente.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para atualizar um cliente existente.
   * Rota: PUT /clientes/:id
   */
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      // Combina o ID da rota com os dados do corpo da requisição.
      const inputDTO = { id, ...req.body };
      
      const clienteAtualizadoDTO = await this._atualizarClienteUseCase.execute(inputDTO);
      return res.status(200).json(clienteAtualizadoDTO);
    } catch (error: any) {
      // Trata erros específicos, como cliente não encontrado.
      if (error instanceof ClienteExceptions.ClienteNaoEncontrado) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({
        message: 'Erro ao atualizar cliente.',
        error: error.message,
      });
    }
  }

  /**
   * Lida com a requisição para deletar (logicamente) um cliente.
   * Rota: DELETE /clientes/:id
   */
  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this._deletarClienteUseCase.execute(id);
      // Retorna uma resposta 204 No Content, indicando sucesso sem corpo de resposta.
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof ClienteExceptions.ClienteNaoEncontrado) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Erro ao deletar cliente.',
        error: error.message,
      });
    }
  }
}