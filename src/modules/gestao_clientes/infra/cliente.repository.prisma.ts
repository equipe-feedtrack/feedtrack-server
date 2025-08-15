import { SegmentoAlvo, StatusUsuario } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '@shared/infra/prisma.repository';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from './cliente.repository.interface';
import { ClienteMap } from './mappers/cliente.map';



export class ClienteRepositoryPrisma extends PrismaRepository implements IClienteRepository {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }
  deletar?(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }


  async buscarClientesParaCampanha(segmento: SegmentoAlvo): Promise<Cliente[]> {
    const clientesRaw = await this._datasource.cliente.findMany({
      where: { status: 'ATIVO' },
    });

    return clientesRaw.map(ClienteMap.toDomain);
  }


  // ... métodos inserir e atualizar ...
  async inserir(cliente: Cliente): Promise<void> {
    const dadosParaPersistencia = ClienteMap.toPersistence(cliente);

    await this._datasource.cliente.create({
      data: dadosParaPersistencia
    });
  }

  async recuperarPorUuid(id: string): Promise<Cliente | null> {
    const clientePrisma = await this._datasource.cliente.findUnique({
      where: { id },
    });

    if (!clientePrisma) return null;

    return ClienteMap.toDomain(clientePrisma);
  }

  async atualizar(cliente: Cliente): Promise<void> {
    const dadosParaPersistencia = ClienteMap.toPersistence(cliente);

    await this._datasource.cliente.update({
      where: { id: cliente.id },
      data: dadosParaPersistencia
    });
  }

async buscarPorSegmento(segmento: SegmentoAlvo, empresaId?: string): Promise<Cliente[]> {
  const whereClause: any = {};

  switch (segmento) {
    case SegmentoAlvo.TODOS_CLIENTES:
      break;
    case SegmentoAlvo.NOVOS_CLIENTES:
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
      whereClause.dataCriacao = { gte: trintaDiasAtras };
      whereClause.status = StatusUsuario.ATIVO;
      break;
    case SegmentoAlvo.CLIENTES_REGULARES:
      const dataLimiteRegulares = new Date();
      dataLimiteRegulares.setDate(dataLimiteRegulares.getDate() - 30);
      whereClause.dataCriacao = { lt: dataLimiteRegulares };
      whereClause.status = StatusUsuario.ATIVO;
      break;
    case SegmentoAlvo.CLIENTES_PREMIUM:
      whereClause.status = StatusUsuario.ATIVO;
      break;
    default:
      whereClause.status = StatusUsuario.ATIVO;
      break;
  }

  if (empresaId) {
    whereClause.empresaId = empresaId; // filtra por empresa
  }

  const clientesPrisma = await this._datasource.cliente.findMany({
    where: whereClause,
  });

  return clientesPrisma.map(cliente => ClienteMap.toDomain(cliente));
}

  async existe(id: string): Promise<boolean> {
    const count = await this._datasource.cliente.count({
      where: { id },
    });
    return count > 0;
  }

async listar(filtros?: { status?: StatusUsuario; empresaId?: string }): Promise<Cliente[]> {
  const whereClause: any = { ...filtros };

  const clientesPrisma = await this._datasource.cliente.findMany({
    where: whereClause,
  });

  return clientesPrisma.map(cliente => ClienteMap.toDomain(cliente));
}

}