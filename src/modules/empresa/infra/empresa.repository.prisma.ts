import { PrismaClient } from "@prisma/client";
import { Empresa } from "../domain/empresa.entity";
import { IEmpresaRepository } from "./empresa.repository.interface";
import { EmpresaMap } from "./mappers/empresa.map";

const prisma = new PrismaClient();

export class EmpresaRepositoryPrisma implements IEmpresaRepository {
async save(empresa: Empresa): Promise<Empresa> {
  const empresaPersistence = EmpresaMap.toPersistence(empresa);

  // Garante que cnpj vazio seja undefined
  if (!empresaPersistence.cnpj?.trim()) {
    empresaPersistence.cnpj = null;
  }

  const createdEmpresa = await prisma.empresa.create({
    data: empresaPersistence,
  });

  return EmpresaMap.toDomain(createdEmpresa);
}


async findById(id: string): Promise<Empresa | null> {
  const empresa = await prisma.empresa.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      cnpj: true,
      email: true,
      status: true,
      plano: true,
      dataCriacao: true,
      dataAtualizacao: true,
      dataExclusao: true
    }
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
