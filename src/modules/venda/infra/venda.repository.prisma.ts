import { PrismaClient } from "@prisma/client";
import { Venda } from "../domain/venda.entity";
import { IVendaRepository } from "./venda.repository.interface";
import { VendaMap } from "./mappers/venda.map";

const prisma = new PrismaClient();

export class VendaRepositoryPrisma implements IVendaRepository {
  async save(venda: Venda): Promise<Venda> {
    const vendaPersistence = VendaMap.toPersistence(venda);

    const empresaExists = await prisma.empresa.findUnique({
      where: { id: vendaPersistence.empresaId },
    });

    if (!empresaExists) {
      throw new Error(
        `Empresa com id ${vendaPersistence.empresaId} não existe.`
      );
    }

const createdVenda = await prisma.venda.create({
  data: {
    id: vendaPersistence.id,
    dataVenda: vendaPersistence.dataVenda,
    clienteId: vendaPersistence.clienteId,
    empresaId: vendaPersistence.empresaId,
    produtos: {
      create: venda.produtoId.map((id) => ({ produtoId: id })),
    },
  },
  include: {
    produtos: {
      include: { produto: true },
    },
  },
});

    return VendaMap.toDomain(createdVenda);
  }

  async findById(id: string): Promise<Venda | null> {
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        cliente: { select: { nome: true, telefone: true, email: true } },
        produtos: { include: { produto: true } }, // relação N:N
        empresa: { select: { nome: true } },
      },
    });

    return venda ? VendaMap.toDomain(venda) : null;
  }

  async findAll(empresaId: string): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany({
      where: { empresaId },
      include: {
        cliente: { select: { nome: true, telefone: true, email: true } },
        produtos: { include: { produto: true } },
        empresa: { select: { nome: true } },
      },
    });

    return vendas.map(VendaMap.toDomain);
  }

  async buscarNovasVendas(empresaId: string, produtoId: string): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany({
      where: {
        empresaId,
        produtos: { some: { produtoId } }, // filtro N:N
      },
      include: {
        cliente: { select: { nome: true, telefone: true, email: true } },
        produtos: { include: { produto: true } },
        empresa: { select: { nome: true } },
      },
    });

    return vendas.map(VendaMap.toDomain);
  }
}
