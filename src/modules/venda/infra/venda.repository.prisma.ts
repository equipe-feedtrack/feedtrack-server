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
      throw new Error(`Empresa com id ${vendaPersistence.empresaId} não existe.`);
    }

    const createdVenda = await prisma.venda.create({ data: vendaPersistence });
    return VendaMap.toDomain(createdVenda);
  }

  async findById(id: string): Promise<Venda | null> {
    const venda = await prisma.venda.findUnique({ where: { id } });
    return venda ? VendaMap.toDomain(venda) : null;
  }

  async findAll(empresaId: string): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany({
      where: { empresaId },
    });
    return vendas.map(VendaMap.toDomain);
  }
}
