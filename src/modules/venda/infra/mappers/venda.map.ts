import { Venda } from '../../domain/venda.entity';

export class VendaMap {
  public static toDomain(raw: any): Venda {
    return Venda.create({
      dataVenda: raw.dataVenda,
      clienteId: raw.clienteId,
      produtoId: raw.produtoId,
      empresaId: raw.empresaId,

    })
  }

  public static toPersistence(venda: Venda): any {
    return {
      id: venda.id,
      dataVenda: venda.dataVenda,
      clienteId: venda.clienteId,
      produtoId: venda.produtoId,
      empresaId: venda.empresaId,
    };
  }
}