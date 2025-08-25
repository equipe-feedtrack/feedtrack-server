import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

interface DeletarClienteUseCaseInputDTO {
  id: string;
  empresaId: string;
}

export class DeletarClienteUseCase implements IUseCase<DeletarClienteUseCaseInputDTO, void> {
  private readonly _clienteRepository: IClienteRepository;

  constructor(clienteRepository: IClienteRepository) {
    this._clienteRepository = clienteRepository;
  }

  async execute(input: DeletarClienteUseCaseInputDTO): Promise<void> {
    const { id, empresaId } = input;

    // Recuperar cliente
    const cliente = await this._clienteRepository.recuperarPorUuid(id, empresaId);
    if (!cliente) {
      throw new ClienteExceptions.ClienteNaoEncontrado(id);
    }

    // Excluir do banco
    await this._clienteRepository.deletar(id, empresaId);
  }
}
