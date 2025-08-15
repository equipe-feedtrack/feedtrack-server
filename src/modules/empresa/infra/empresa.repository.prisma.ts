import { PrismaClient } from "@prisma/client";
import { Empresa } from "../domain/empresa.entity";
import { IEmpresaRepository } from "./empresa.repository.interface";
import { EmpresaMap } from "./mappers/empresa.map";

const prisma = new PrismaClient();

export class EmpresaRepositoryPrisma implements IEmpresaRepository {
 constructor(private readonly prisma: PrismaClient) {}

  async save(empresa: Empresa): Promise<Empresa> {
    const empresaPersistence = EmpresaMap.toPersistence(empresa);

    const upsertedEmpresa = await this.prisma.empresa.upsert({
      where: { id: empresa.id },
      update: empresaPersistence,
      create: empresaPersistence,
    });

    return EmpresaMap.toDomain(upsertedEmpresa);
  }


  async findById(id: string): Promise<Empresa | null> {
    const empresa = await prisma.empresa.findUnique({
      where: { id },
    });
    return empresa ? EmpresaMap.toDomain(empresa) : null;
  }

  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj },
    });
    return empresa ? EmpresaMap.toDomain(empresa) : null;
  }

  async findAll(): Promise<Empresa[]> {
    const empresas = await prisma.empresa.findMany();
    return empresas.map(EmpresaMap.toDomain);
  }
}
