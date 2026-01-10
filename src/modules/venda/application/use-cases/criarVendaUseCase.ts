import { Venda } from "../../domain/venda.entity";
import { IVendaRepository } from "../../infra/venda.repository.interface";
import { CriarVendaDTO } from "../dto/criarVenda.dto";

export class CriarVendaUseCase {
  constructor(private readonly vendaRepository: IVendaRepository) {}

  async execute(dto: CriarVendaDTO): Promise<Venda> {
    const venda = Venda.create({
      ...dto,
      dataVenda: new Date(),
    });

    return this.vendaRepository.save(venda);
  }
}
