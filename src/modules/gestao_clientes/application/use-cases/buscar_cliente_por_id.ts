import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';


export class BuscarClientePorIdUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: string): Promise<ClienteResponseDTO | null> {
    const cliente = await this.clienteRepository.recuperarPorUuid(id);

    if (!cliente) {
      return null;
    }

    return ClienteMap.toResponseDTO(cliente);
  }
}