import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { IVendaRepository } from "@modules/venda/infra/venda.repository.interface";
import { VendaExceptions } from "../../domain/venda.exception";

interface DeletarVendaInputDTO {
  id: string;
  empresaId: string;
}

export class DeletarVendaUseCase implements IUseCase<DeletarVendaInputDTO, void> {
  private readonly _vendaRepository: IVendaRepository;

  constructor(vendaRepository: IVendaRepository) {
    this._vendaRepository = vendaRepository;
  }

  async execute(input: DeletarVendaInputDTO): Promise<void> {
    const { id, empresaId } = input;

    // 1. Recupera a venda
    const venda = await this._vendaRepository.findById(id);

    if (!venda) {
      throw new VendaExceptions.VendaNaoEncontradaException(id);
    }

    // 2. Verifica se a venda pertence à empresa
    if (venda.empresaId !== empresaId) {
      throw new VendaExceptions.VendaNaoPermitidaException();
    }

    // 3. Deleta a venda
    await this._vendaRepository.deletar(id);
  }
}
