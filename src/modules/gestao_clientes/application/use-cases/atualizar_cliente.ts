import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { AtualizarClienteInputDTO } from '../dto/atualizar_cliente_input.dto';
import { IUseCase } from '@shared/application/use-case/usecase.interface';
import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';


export class AtualizarClienteUseCase implements IUseCase<AtualizarClienteInputDTO, ClienteResponseDTO> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(
    clienteRepository: IClienteRepository,
  ) {
    this._clienteRepository = clienteRepository;
  }

  async execute(input: AtualizarClienteInputDTO): Promise<ClienteResponseDTO> {
    // 1. Recuperar a entidade existente do banco de dados.
    const cliente = await this._clienteRepository.recuperarPorUuid(input.id);
    if (!cliente) {
      // Lança uma exceção se o cliente não for encontrado.
      throw new Error(`Cliente com ID ${input.id} não encontrado.`);
    }

    // 2. Aplicar as atualizações na entidade de domínio.
    if (input.nome !== undefined) {
      cliente.atualizarNome(input.nome);
    }
    if (input.email !== undefined) {
      cliente.atualizarEmail(input.email);
    }
    if (input.telefone !== undefined) {
      cliente.atualizarTelefone(input.telefone);
    }
    if (input.cidade !== undefined) {
      cliente.atualizarCidade(input.cidade ?? '');
    }
    if (input.status !== undefined) {
      cliente.atualizarStatus(input.status);
    }

    // 4. Persistir a entidade atualizada no banco de dados.
    await this._clienteRepository.atualizar(cliente);

    // 5. Retornar o DTO de resposta com os dados atualizados.
    return ClienteMap.toResponseDTO(cliente);
  }
}