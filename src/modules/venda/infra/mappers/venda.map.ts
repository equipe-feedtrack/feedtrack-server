import { Venda as VendaPersistence } from "@prisma/client";
import { Venda, VendaPersistenceWithRelations } from "../../domain/venda.entity";
export class VendaMap {
  public static toDomain(raw: VendaPersistenceWithRelations): Venda {
  return Venda.create({
    id: raw.id,
    clienteId: raw.clienteId,
    produtoId: raw.produtoId,
    empresaId: raw.empresaId,
    dataVenda: raw.dataVenda,
    cliente: raw.cliente
      ? {
          email: raw.cliente.email ?? undefined,
          telefone: raw.cliente.telefone ?? undefined,
        }
      : undefined,
    produto: raw.produto
      ? {
          nome: raw.produto.nome ?? undefined,
          valor: raw.produto.valor ?? undefined,
          descricao: raw.produto.descricao ?? undefined,
        }
      : undefined,
  });
}


public static toPersistence(venda: Venda): Omit<VendaPersistence, 'cliente' | 'produto'> {
  return {
    id: venda.id.toString(),
    clienteId: venda.clienteId,
    produtoId: venda.produtoId,
    empresaId: venda.empresaId,
    dataVenda: venda.dataVenda,
  };
}

}
