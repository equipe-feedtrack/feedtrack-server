import { Venda as VendaPersistence } from "@prisma/client";
import { Venda } from "../../domain/venda.entity";
import { UniqueEntityID } from "@shared/domain/unique-entity-id";

export class VendaMap {
  public static toDomain(raw: VendaPersistence): Venda {
    const venda = Venda.create(
      {
        clienteId: raw.clienteId,
        produtoId: raw.produtoId,
        empresaId: raw.empresaId,
        dataVenda: raw.dataVenda,
      },
      new UniqueEntityID(raw.id)
    );
    return venda;
  }

  public static toPersistence(venda: Venda): VendaPersistence {
    return {
      id: venda.id.toString(),
      clienteId: venda.props.clienteId,
      produtoId: venda.props.produtoId,
      empresaId: venda.props.empresaId,
      dataVenda: venda.props.dataVenda,
    };
  }
}
