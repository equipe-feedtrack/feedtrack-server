import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
/**
 * Caso de Uso para realizar a exclusão lógica de um Cliente.
 * Altera o status do cliente para INATIVO e registra a data de exclusão.
 */
export class DeletarClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Recuperar a entidade Cliente pelo ID
    const cliente = await this.clienteRepository.recuperarPorUuid(id);

    // 2. Verificar se o cliente existe
    if (!cliente) {
      throw new ClienteExceptions.ClienteNaoEncontrado(id); // Lança uma exceção específica
    }

    // 3. Realizar a exclusão lógica na entidade
    // Assumimos que a entidade Cliente tem um método 'inativar'
    cliente.inativar(); // Este método deve definir o status para INATIVO e a dataExclusao

    // 4. Persistir a entidade Cliente atualizada
    await this.clienteRepository.atualizar(cliente);

    // Não há retorno explícito para uma exclusão lógica bem-sucedida (void)
  }
}