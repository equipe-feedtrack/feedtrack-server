import { Venda } from '../../../venda/domain/venda.entity';
import { IVendaRepository } from '../../../venda/infra/venda.repository.interface';

export class RecuperarVendaPorIdUseCase {
  constructor(private vendaRepository: IVendaRepository) {}

  async execute(id: string): Promise<Venda | null> {
    return this.vendaRepository.findById(id);
  }
}
