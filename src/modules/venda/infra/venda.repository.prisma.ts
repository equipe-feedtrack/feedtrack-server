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

    const createdVenda = await prisma.venda.create({ data: vendaPersistence });
    return VendaMap.toDomain(createdVenda);
  }

  async findById(id: string): Promise<Venda | null> {
    const venda = await prisma.venda.findUnique({ 
      where: { id },
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true
          }
        },
        produto: {
          select: {
            nome: true
          }
        },
        empresa: {
          select: {
            nome: true
          }
        }
      }
    
    });
    return venda ? VendaMap.toDomain(venda) : null;
  }
  async findAll(empresaId: string): Promise<Venda[]> {
    const vendas = await prisma.venda.findMany({
      where: { empresaId }, // remove o filtro por id
      select: {
        id: true, // garante que o id venha
        clienteId: true,
        produtoId: true,
        // ... outros campos
      },
    });

    return vendas.map(VendaMap.toDomain);
  }
  
async buscarNovasVendas(empresaId: string, produtoId: string): Promise<Venda[]> {
  const vendas = await prisma.venda.findMany({
    where: {
      empresaId,
      produtoId,
      // você pode adicionar mais filtros, por exemplo, vendas criadas recentemente
      // dataVenda: { gte: new Date(/* última verificação */) }
    },
    include: {
      cliente: {
        select: {
          nome: true,
          telefone: true,
          email: true,
        },
      },
      produto: {
        select: {
          nome: true,
        },
      },
      empresa: {
        select: {
          nome: true,
        },
      },
    },
  });

  return vendas.map(VendaMap.toDomain);
}


}
