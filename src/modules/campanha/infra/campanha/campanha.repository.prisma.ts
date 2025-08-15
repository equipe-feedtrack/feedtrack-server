import { PrismaClient } from '@prisma/client';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { CampanhaMap } from '../mappers/campanha.map';
import { ICampanhaRepository } from './campanha.repository.interface';

export class CampanhaRepositoryPrisma implements ICampanhaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async inserir(campanha: Campanha): Promise<void> {
    const dadosParaPersistencia = CampanhaMap.toPersistence(campanha);
    await this.prisma.campanha.create({
      data: dadosParaPersistencia,
    });
  }

  async atualizar(campanha: Campanha): Promise<void> {
    const dadosParaPersistencia = CampanhaMap.toPersistence(campanha);
    // Removemos a relação do objeto principal para o Prisma lidar com ela separadamente
    const { formulario, empresa, ...dadosEscalares } = dadosParaPersistencia;

    await this.prisma.campanha.update({
      where: { id: campanha.id },
      data: {
        ...dadosEscalares, // Atualiza campos como titulo, descricao, etc.
        formulario: { // Conecta ao formulário, caso o ID tenha mudado
          connect: { id: campanha.formularioId },
        },
        empresa: { connect: { id: campanha.empresaId } },
      },
    });
  }

  async recuperarPorUuid(id: string): Promise<Campanha | null> {
    const campanhaPrisma = await this.prisma.campanha.findUnique({
      where: { id },
    });

    if (!campanhaPrisma) return null;

    return CampanhaMap.toDomain(campanhaPrisma);
  }

  async listar(filtros?: any): Promise<Campanha[]> {
    const whereClause: any = {};

    if (filtros?.empresaId) {
      whereClause.empresaId = filtros.empresaId;
    }

    const campanhasPrisma = await this.prisma.campanha.findMany({
        where: whereClause,
        orderBy: { dataCriacao: 'desc' }
    });
    return campanhasPrisma.map(campanha => CampanhaMap.toDomain(campanha));
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.campanha.delete({
      where: { id },
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.campanha.count({
      where: { id },
    });
    return count > 0;
  }
}