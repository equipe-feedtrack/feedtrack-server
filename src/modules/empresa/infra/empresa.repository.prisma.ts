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

async findAll(): Promise<any> {
  const empresas = await prisma.empresa.findMany({
    include: {
      usuarios: true,
      campanhas: true,
      formularios: true,
      envios: true,
      feedbacks: true,
      clientes: true,
      produtos: true,
      vendas: true,
      funcionarios: true,
      perguntas: true,
      
    },
  });

  return EmpresaMap.allWithRelationsCount(empresas);
}


async update(id: string, dados: Partial<Empresa>): Promise<Empresa> {
  // Garante que cnpj vazio seja null
  if (dados.props?.cnpj !== undefined && !dados.props.cnpj?.trim()) {
    dados.props.cnpj = undefined;
  }

  // Desenrola os campos de props
  const dataParaPrisma: any = {};
  if (dados.props?.nome !== undefined) dataParaPrisma.nome = dados.props.nome;
  if (dados.props?.cnpj !== undefined) dataParaPrisma.cnpj = dados.props.cnpj;
  if (dados.props?.email !== undefined) dataParaPrisma.email = dados.props.email;
  if (dados.props?.status !== undefined) dataParaPrisma.status = dados.props.status;
  if (dados.props?.plano !== undefined) dataParaPrisma.plano = dados.props.plano;
  if (dados.props?.dataExclusao !== undefined) dataParaPrisma.dataExclusao = dados.props.dataExclusao;

  // Atualiza timestamp
  dataParaPrisma.dataAtualizacao = new Date();

  const updated = await prisma.empresa.update({
    where: { id },
    data: dataParaPrisma,
  });

  return EmpresaMap.toDomain(updated);
}



  async delete(id: string): Promise<void> {
    await prisma.empresa.delete({
      where: { id },
    });
  }
}
