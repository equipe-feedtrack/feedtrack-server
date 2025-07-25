import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { IEnvioRepository } from "@modules/formulario/infra/envio/IEnvioRepository";
import { EnvioMap } from "@modules/formulario/mappers/EnvioMap";
import { PrismaClient } from "@prisma/client";

export class EnvioRepositoryPrisma implements IEnvioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(envio: Envio): Promise<void> {
    // 1. Usa o Mapper para converter a entidade de domínio para o formato do Prisma
    const dadosParaPersistencia = EnvioMap.toPersistence(envio);

    // 2. Usa 'upsert' para criar ou atualizar o registro de forma atômica
    await this.prisma.envio_formulario.upsert({
      where: { id: envio.id },
      create: dadosParaPersistencia,
      update: dadosParaPersistencia,
    });
  }

  async buscarPorId(id: string): Promise<Envio | null> {
    // 1. Busca o registro no banco de dados
    const envioPrisma = await this.prisma.envio_formulario.findUnique({
      where: { id },
    });

    if (!envioPrisma) return null;

    // 2. Se encontrar, usa o Mapper para converter de volta para a entidade de domínio
    return EnvioMap.toDomain(envioPrisma);
  }
}