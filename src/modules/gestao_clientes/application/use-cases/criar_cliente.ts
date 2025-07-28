import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { CriarClienteInputDTO } from '../dto/criar_cliente_input.dto';

export class CriarClienteUseCase {
  constructor(
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(input: CriarClienteInputDTO): Promise<ClienteResponseDTO> {
    // 1. Cria a entidade Pessoa (se não for passado já como instância)
    const pessoa = Pessoa.criar(input.pessoa); // A entidade Pessoa, validada

    // 2. Cria a entidade Cliente (sem produtos iniciais aqui, associados depois)
    const cliente = Cliente.criarCliente({
      pessoa: pessoa, // Passa a entidade Pessoa criada
      cidade: input.cidade,
      vendedorResponsavel: input.vendedorResponsavel,
      status: input.status,
      produtos: [], // Clientes são criados sem produtos inicialmente, associados depois
    });

    // 3. Persiste o Cliente
    await this.clienteRepository.inserir(cliente);

    // 4. Retorna o DTO de resposta
    return ClienteMap.toResponseDTO(cliente);
  }
}