import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { ListarClientesInputDTO } from "../dto/listar_cliente_input.dto";
import { ClienteResponseDTO } from "../dto/cliente_response.dto";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { ClienteMap } from "@modules/gestao_clientes/infra/mappers/cliente.map";

export class ListarClientesUseCase implements IUseCase<ListarClientesInputDTO | undefined, ClienteResponseDTO[]> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(clienteRepository: IClienteRepository) {
    this._clienteRepository = clienteRepository;
  }

  /**
   * Executa a listagem de clientes.
   * @param filtros Um objeto opcional com os filtros a serem aplicados.
   * @returns Uma promessa que resolve com um array de DTOs de cliente.
   */
async execute(filtros?: ListarClientesInputDTO): Promise<ClienteResponseDTO[]> {
  const clientes = await this._clienteRepository.listar({
    status: filtros?.status,
    empresaId: filtros?.empresaId, // aqui usamos o empresaId
  });

  return clientes.map(cliente => ClienteMap.toResponseDTO(cliente));
}


}