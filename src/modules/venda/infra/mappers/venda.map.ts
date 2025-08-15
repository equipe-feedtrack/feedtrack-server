import { Venda as VendaPersistence } from "@prisma/client";
import { Venda } from "../../domain/venda.entity";

export class VendaMap {
  public static toDomain(raw: VendaPersistence): Venda {
    const venda = Venda.create(
      {
        clienteId: raw.clienteId,
        produtoId: raw.produtoId,
        empresaId: raw.empresaId,
      },
    );
    return venda;
  }

  public static toPersistence(venda: Venda): VendaPersistence {
    return {
      id: venda.id.toString(),
      clienteId: venda.clienteId,
      produtoId: venda.produtoId,
      empresaId: venda.empresaId,
      dataVenda: venda.dataVenda,
    };
  }
}
