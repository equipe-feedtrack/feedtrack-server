import { Venda } from '../../domain/venda.entity';

export class VendaMap {
  public static toDomain(raw: any): Venda {
    const venda = Venda.create({
      id: raw.id,
      dataVenda: raw.dataVenda,
      clienteId: raw.clienteId,
      produtoId: raw.produtos?.map((p: any) => p.produtoId) ?? [], // array de IDs
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

    // Mapear dados dos produtos (array)
    if (raw.produtos) {
      venda.produto = raw.produtos.map((p: any) => ({
        nome: p.produto.nome ?? undefined,
        valor: p.produto.valor ?? undefined,
        descricao: p.produto.descricao ?? undefined,
      }));
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
      empresaId: venda.empresaId,
      produtos: {
        create: venda.produtoId.map((id) => ({ produtoId: id })), // cria relação N:N
      },
    };
  }
}
