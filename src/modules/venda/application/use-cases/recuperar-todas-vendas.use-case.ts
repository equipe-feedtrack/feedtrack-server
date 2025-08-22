import { Venda } from '../../../venda/domain/venda.entity';
import { IVendaRepository } from '../../../venda/infra/venda.repository.interface';

export class RecuperarTodasVendasUseCase {
  constructor(private vendaRepository: IVendaRepository) {}

  async execute(empresaId: string): Promise<Venda[]> {
    if (!empresaId) throw new Error("O campo empresaId é obrigatório.");
    return this.vendaRepository.findAll(empresaId);
  }
}
