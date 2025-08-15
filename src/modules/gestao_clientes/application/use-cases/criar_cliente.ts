import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { IUseCase } from '@shared/application/use-case/usecase.interface';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { CriarClienteInputDTO } from '../dto/criar_cliente_input.dto';

export class CriarClienteUseCase implements IUseCase<CriarClienteInputDTO, ClienteResponseDTO> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(
    clienteRepository: IClienteRepository,
  ) {
    this._clienteRepository = clienteRepository;
  }

  async execute(input: CriarClienteInputDTO): Promise<ClienteResponseDTO> {
    
    const cliente = Cliente.criarCliente({
      nome: input.nome,
      email: input.email ?? '',
      telefone: input.telefone,
      cidade: input.cidade,
      empresaId: input.empresaId
    });

    await this._clienteRepository.inserir(cliente);

    return ClienteMap.toResponseDTO(cliente);
  }
}