import { PrismaClient } from "@prisma/client";
import { Venda } from "../domain/venda.entity";
import { IVendaRepository } from "./venda.repository.interface";
import { VendaMap } from "./mappers/venda.map";

const prisma = new PrismaClient();

export class VendaRepositoryPrisma implements IVendaRepository {
async save(venda: Venda): Promise<Venda> {
  const vendaPersistence = VendaMap.toPersistence(venda);

  // Verifica se a empresa existe
  const empresaExists = await prisma.empresa.findUnique({
    where: { id: vendaPersistence.empresaId },
  });

  if (!empresaExists) {
    throw new Error(`Empresa com id ${vendaPersistence.empresaId} não existe.`);
  }

  const createdVenda = await prisma.venda.create({
    data: vendaPersistence,
  });

  return VendaMap.toDomain(createdVenda);
}


async findById(id: string): Promise<Venda | null> {
  const venda = await prisma.venda.findUnique({
    where: { id },
    include: {
      cliente: { select: { email: true, telefone: true } },
      produto: { select: { nome: true, valor: true, descricao: true } }
    }
  });

  if (!venda) return null;

  return Venda.create({
    id: venda.id,
    clienteId: venda.clienteId,
    produtoId: venda.produtoId,
    empresaId: venda.empresaId,
    dataVenda: venda.dataVenda,
    cliente: venda.cliente
  ? {
      email: venda.cliente.email ?? undefined,
      telefone: venda.cliente.telefone ?? undefined
    }
  : undefined,
produto: venda.produto
  ? {
      nome: venda.produto.nome ?? undefined,
      valor: venda.produto.valor ?? undefined,
      descricao: venda.produto.descricao ?? undefined
    }
  : undefined

  });
}



  async findAll(): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany();
    return vendas.map(VendaMap.toDomain);
  }
}
