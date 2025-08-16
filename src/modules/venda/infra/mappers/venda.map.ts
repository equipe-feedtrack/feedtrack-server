import { Venda } from '../../domain/venda.entity';

export class VendaMap {
public static toDomain(raw: any): Venda {
  const venda = Venda.create({
    id: raw.id,
    dataVenda: raw.dataVenda,
    clienteId: raw.clienteId,
    produtoId: raw.produtoId,
    empresaId: raw.empresaId,
  });

  // Mapear dados do cliente
  if (raw.cliente) {
    venda.cliente = {
      nome: raw.cliente.nome ?? undefined,
      email: raw.cliente.email ?? undefined,
      telefone: raw.cliente.telefone ?? undefined,
    };
  }

  // Mapear dados do produto
  if (raw.produto) {
    venda.produto = {
      nome: raw.produto.nome ?? undefined,
    };
  }

  // Mapear dados da empresa
  if (raw.empresa) {
    venda.empresa = {
      nome: raw.empresa.nome ?? undefined,
    };
  }

  return venda;
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

