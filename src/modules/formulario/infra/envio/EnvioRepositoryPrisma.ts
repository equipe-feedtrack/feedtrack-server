import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { IEnvioRepository } from "@modules/formulario/infra/envio/IEnvioRepository";
import { EnvioMap } from "../mappers/EnvioMap";
import { PrismaClient } from "@prisma/client";

export class EnvioRepositoryPrisma implements IEnvioRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
  async salvar(envio: Envio): Promise<void> {
    // 1. Usa o Mapper para converter a entidade de domínio para o formato do Prisma
    const dadosParaPersistencia = EnvioMap.toPersistence(envio);
    
    // 2. Usa 'upsert' para criar ou atualizar o registro de forma atômica
    await this.prisma.envioFormulario.upsert({
      where: { id: envio.id },
      create: dadosParaPersistencia,
      update: dadosParaPersistencia,
    });
  }
  
  async atualizar(envio: Envio): Promise<void> {
    // Atualiza um registro de envio existente.
    // Focamos nos campos que a entidade 'Envio' muda através de seus comportamentos.
    const dadosParaPersistencia = EnvioMap.toPersistence(envio); // Mapeia o estado atualizado da entidade

    await this.prisma.envioFormulario.update({
      where: { id: envio.id }, // Usa o ID da entidade para encontrar o registro
      data: {
        status: dadosParaPersistencia.status, // Atualiza o status
        dataEnvio: dadosParaPersistencia.dataEnvio, // Atualiza a data de envio (se for o caso)
        tentativasEnvio: dadosParaPersistencia.tentativasEnvio, // Atualiza o contador de tentativas
        ultimaMensagemErro: dadosParaPersistencia.ultimaMensagemErro, // Atualiza a mensagem de erro
        // Inclua outros campos que podem ser atualizados se o Envio tiver 'dataAtualizacao'
        // data_atualizacao: new Date(), // Se Envio tivesse dataAtualizacao no schema e na entidade
      },
    });
  }

  async buscarPorId(id: string): Promise<Envio | null> {
    // 1. Busca o registro no banco de dados
    const envioPrisma = await this.prisma.envioFormulario.findUnique({
      where: { id },
    });

    if (!envioPrisma) return null;

    // 2. Se encontrar, usa o Mapper para converter de volta para a entidade de domínio
    return EnvioMap.toDomain(envioPrisma);
  }
}