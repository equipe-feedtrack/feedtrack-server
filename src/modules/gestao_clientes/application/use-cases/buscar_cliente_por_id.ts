import { ClienteMap } from "@modules/gestao_clientes/infra/mappers/cliente.map";
import { ClienteResponseDTO } from "../dto/cliente_response.dto";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";

/**
 * Caso de uso para buscar um cliente pelo seu ID único.
 */
export class BuscarClientePorIdUseCase implements IUseCase<string, ClienteResponseDTO | null> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(clienteRepository: IClienteRepository) {
    this._clienteRepository = clienteRepository;
  }

  /**
   * Executa a busca pelo cliente.
   * @param id O ID (UUID) do cliente a ser buscado.
   * @returns Um DTO com os dados do cliente se encontrado, ou null caso contrário.
   */
  async execute(id: string): Promise<ClienteResponseDTO | null> {
    // 1. Pede ao repositório para recuperar a entidade de domínio.
    const cliente = await this._clienteRepository.recuperarPorUuid(id);

    // 2. Se a entidade não for encontrada, retorna null.
    if (!cliente) {
      return null;
    }

    // 3. Se encontrada, usa o mapper para converter a entidade em um DTO de resposta.
    return ClienteMap.toResponseDTO(cliente);
  }
}
