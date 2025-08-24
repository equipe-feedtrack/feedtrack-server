import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

/**
 * Caso de Uso para excluir fisicamente um Cliente do banco de dados.
 */
export class DeletarClienteUseCase implements IUseCase<string, void> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(clienteRepository: IClienteRepository) {
    this._clienteRepository = clienteRepository;
  }

  /**
   * Executa a exclusão definitiva do cliente.
   * @param id O ID (UUID) do cliente a ser deletado.
   * @returns Uma promessa que resolve como void se a operação for bem-sucedida.
   * @throws {ClienteExceptions.ClienteNaoEncontrado} Se o cliente com o ID fornecido não for encontrado.
   */
  async execute(id: string): Promise<void> {
    // 1. Recuperar a entidade Cliente pelo ID
    const cliente = await this._clienteRepository.recuperarPorUuid(id);

    // 2. Verificar se o cliente existe
    if (!cliente) {
      throw new ClienteExceptions.ClienteNaoEncontrado(id);
    }

    // 3. Excluir definitivamente do banco
    await this._clienteRepository.deletar(id);
  }
}
