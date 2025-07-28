import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { AtualizarClienteInputDTO } from '../dto/atualizar_cliente_input.dto';


export class AtualizarClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: AtualizarClienteInputDTO): Promise<ClienteResponseDTO> {
    // 1. Recuperar a entidade existente
    const cliente = await this.clienteRepository.recuperarPorUuid(input.id);
    if (!cliente) {
      throw new Error(`Cliente com ID ${input.id} não encontrado.`); // Exceção específica
    }

    // 2. Aplicar as atualizações (a entidade sabe como mudar seu estado)
    // Para propriedades de Pessoa, a entidade Cliente delega
    if (input.pessoa?.nome !== undefined) {
      cliente.pessoa.atualizarNome(input.pessoa.nome); // Assume que Pessoa tem atualizarNome
    }
    if (input.pessoa?.email !== undefined) {
      cliente.pessoa.atualizarEmail(input.pessoa.email); // Assume que Pessoa tem atualizarEmail
    }
    if (input.pessoa?.telefone !== undefined) {
      cliente.pessoa.atualizarTelefone(input.pessoa.telefone); // Assume que Pessoa tem atualizarTelefone
    }
    // Outras propriedades diretas do Cliente
    if (input.cidade !== undefined) {
      cliente.atualizarCidade(input.cidade); // Crie este método na entidade Cliente
    }
    if (input.vendedorResponsavel !== undefined) {
      cliente.atualizarVendedorResponsavel(input.vendedorResponsavel); // Crie este método na entidade Cliente
    }
    if (input.status !== undefined) {
      cliente.atualizarStatus(input.status); // Crie este método na entidade Cliente
    }
    // Note: 'produtos' é atualizado via outro Caso de Uso (AssociarProdutosAoCliente)

    // A data de atualização da entidade Cliente será atualizada pelos setters ou por um método genérico.
    // cliente.dataAtualizacao = new Date(); // Pode ser feito por um método de atualização genérico ou no setter


    // 3. Persistir a entidade atualizada
    await this.clienteRepository.atualizar(cliente);

    // 4. Retornar o DTO de resposta
    return ClienteMap.toResponseDTO(cliente);
  }
}