// src/modules/campanha/infra/database/orm/prisma/repositories/campanha.repository.prisma.ts

import { PrismaClient } from '@prisma/client'; // Importa o Prisma Client
import { Campanha } from '@modules/campanha/domain/campanha.entity'; // Sua entidade Campanha
import { ICampanha } from '@modules/campanha/domain/campanha.types'; // Sua interface ICampanha
import { ICampanhaRepository } from './campanha.repository.interface'; // Sua interface de repositório
import { CampanhaMap } from '../mappers/campanha.map';

export class CampanhaRepositoryPrisma implements ICampanhaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Insere ou atualiza uma Campanha no banco de dados.
   * Utiliza upsert para tratar inserção ou atualização de forma transparente.
   */
  async inserir(campanha: Campanha): Promise<void> {
    const dadosParaPersistencia = CampanhaMap.toPersistence(campanha);

   await this.prisma.campanha.upsert({
      where: { id: campanha.id },
      update: {
        ...dadosParaPersistencia,
        id: dadosParaPersistencia.id, // O ID é usado no 'where'
        data_criacao: dadosParaPersistencia.data_criacao, // Geralmente não se atualiza a data de criação
      },
      create: { // Dados para criar uma nova campanha se ela não existe
      ...dadosParaPersistencia,
      },
    });
  }

  /**
   * Recupera uma Campanha pelo seu ID único.
   */
  async recuperarPorUuid(id: string): Promise<ICampanha | null> {
    const campanhaPrisma = await this.prisma.campanha.findUnique({
      where: { id },
    });

    if (!campanhaPrisma) return null;

    return CampanhaMap.toDomain(campanhaPrisma);
  }
}