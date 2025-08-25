import { ClienteMap } from "@modules/gestao_clientes/infra/mappers/cliente.map";
import { ClienteResponseDTO } from "../dto/cliente_response.dto";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";

interface BuscarClientePorIdInputDTO {
  id: string;
  empresaId: string;
}


export class BuscarClientePorIdUseCase implements IUseCase<BuscarClientePorIdInputDTO, ClienteResponseDTO | null> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(clienteRepository: IClienteRepository) {
    this._clienteRepository = clienteRepository;
  }

  async execute(input: BuscarClientePorIdInputDTO): Promise<ClienteResponseDTO | null> {
    const { id, empresaId } = input;

    const cliente = await this._clienteRepository.recuperarPorUuid(id, empresaId);

    if (!cliente) {
      return null;
    }

    return ClienteMap.toResponseDTO(cliente);
  }
}
