import { PrismaClient } from "@prisma/client";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";
import { IEnvioRepository } from "./IEnvioRepository";
import { EnvioMap } from "../mappers/EnvioMap";

/**
 * @description Repositório para a entidade Envio, utilizando o Prisma Client.
 * Ele traduz as operações do domínio para as operações do banco de dados.
 */
export class EnvioRepositoryPrisma implements IEnvioRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
  /**
   * Salva ou atualiza um registro de Envio.
   * @param envio A entidade de domínio Envio a ser salva.
  */
 async salvar(envio: Envio): Promise<void> {
   const dadosParaPersistencia = EnvioMap.toPersistence(envio);
   console.log('Dados para persistência:', envio.id);

   const usuarioExiste = await this.prisma.usuario.findUnique({
  where: { id: envio.usuarioId }
});

if (!usuarioExiste) {
  throw new Error(`Usuário com ID ${envio.usuarioId} não encontrado.`);
}

   
   await this.prisma.envioFormulario.upsert({
     where: { id: envio.id },
     create: dadosParaPersistencia,
     update: {
       status: envio.status,
       dataEnvio: envio.dataEnvio,
       tentativasEnvio: envio.tentativasEnvio,
       ultimaMensagemErro: envio.ultimaMensagemErro,
      },
    });
  }
  
  /**
   * Busca um registro de Envio pelo seu ID.
  *
  * @param id O ID do envio a ser buscado.
  * @returns A entidade de domínio Envio ou null se não for encontrado.
  */
 async buscarPorId(id: string): Promise<Envio | null> {
   const raw = await this.prisma.envioFormulario.findUnique({
     where: { id },
    });
    
    if (!raw) {
      return null;
    }
    
    return EnvioMap.toDomain(raw);
  }
  
  /**
   * Busca todos os envios no banco de dados.
  *
  * @returns Uma lista de entidades de domínio Envio.
  */
 async buscarTodos(): Promise<Envio[]> {
   const rawFeedbacks = await this.prisma.envioFormulario.findMany();
   
   if (!rawFeedbacks || rawFeedbacks.length === 0) {
     return [];
    }
    
    return rawFeedbacks.map(EnvioMap.toDomain);
  }
  
  
  atualizar(envio: Envio): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  
  /**
   * Busca envios pendentes para um cliente específico.
  *
  * @param clienteId O ID do cliente.
  * @returns Uma lista de entidades de domínio Envio pendentes.
  */
 
  async buscarPendentesPorCliente(clienteId: string): Promise<Envio[]> {
    const rawEnvios = await this.prisma.envioFormulario.findMany({
      where: {
        clienteId,
        status: 'PENDENTE',
      },
    });
    return rawEnvios.map(EnvioMap.toDomain);
  }

  /**
   * Busca envios pendentes para uma campanha específica.
   *
   * @param campanhaId O ID da campanha.
   * @returns Uma lista de entidades de domínio Envio pendentes.
   */
  async buscarPendentesPorCampanha(campanhaId: string): Promise<Envio[]> {
    const rawEnvios = await this.prisma.envioFormulario.findMany({
      where: {
        campanhaId,
        status: 'PENDENTE',
      },
    });
    return rawEnvios.map(EnvioMap.toDomain);
  }

  async buscarPendentes(): Promise<Envio[]> {
    const rawEnvios = await this.prisma.envioFormulario.findMany({
      where: {
        status: 'PENDENTE',
      },
    });
    return rawEnvios.map(EnvioMap.toDomain);
  }

  /**
   * Salva múltiplas entidades de Envio em uma única transação.
   *
   * @param envios Uma lista de entidades de domínio Envio.
   */
  async salvarVarios(envios: Envio[]): Promise<void> {
    const operacoes = envios.map(envio => {
      const dadosParaPersistencia = EnvioMap.toPersistence(envio);
      return this.prisma.envioFormulario.upsert({
        where: { id: envio.id },
        create: dadosParaPersistencia,
        update: {
          status: envio.status,
          dataEnvio: envio.dataEnvio,
          tentativasEnvio: envio.tentativasEnvio,
          ultimaMensagemErro: envio.ultimaMensagemErro,
        },
      });
    });

    await this.prisma.$transaction(operacoes);
  }
}
