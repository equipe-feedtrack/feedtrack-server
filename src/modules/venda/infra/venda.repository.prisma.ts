import { PrismaClient } from "@prisma/client";
import { Venda } from "../domain/venda.entity";
import { IVendaRepository } from "./venda.repository.interface";
import { VendaMap } from "./mappers/venda.map";

const prisma = new PrismaClient();

export class VendaRepositoryPrisma implements IVendaRepository {
  async save(venda: Venda): Promise<Venda> {
    const vendaPersistence = VendaMap.toPersistence(venda);
    const createdVenda = await prisma.venda.create({
      data: vendaPersistence,
    });
    return VendaMap.toDomain(createdVenda);
  }

  async findById(id: string): Promise<Venda | null> {
    const venda = await prisma.venda.findUnique({
      where: { id },
    });
    return venda ? VendaMap.toDomain(venda) : null;
  }

  async findAll(): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany();
    return vendas.map(VendaMap.toDomain);
  }
}
