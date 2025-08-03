import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { IEnvioRepository } from "@modules/formulario/infra/envio/IEnvioRepository";
import { EnvioMap } from "../mappers/EnvioMap";
import { PrismaClient } from "@prisma/client";

export class EnvioRepositoryPrisma implements IEnvioRepository {
  constructor(private readonly prisma: PrismaClient) {}
 
  /**
   * Salva ou atualiza um registro de Envio.
   * Usa o método 'upsert' do Prisma para lidar com ambos os cenários de forma atômica.
   * Se o ID do envio já existir, ele será atualizado. Caso contrário, será criado.
   *
   * @param envio A entidade de domínio Envio a ser salva.
   */
  async salvar(envio: Envio): Promise<void> {
    // Converte a entidade de domínio para o formato de persistência do Prisma.
    // Isso garante que os dados estão corretos para o banco.
    const dadosParaPersistencia = EnvioMap.toPersistence(envio);

    await this.prisma.envioFormulario.upsert({
      where: { id: envio.id },
      create: dadosParaPersistencia,
      update: {
        // Para evitar a reescrita de dados que não mudam,
        // focamos apenas nos campos que a entidade 'Envio'
        // pode alterar através de seus comportamentos, conforme o schema.
        status: dadosParaPersistencia.status,
        dataEnvio: dadosParaPersistencia.dataEnvio,
        tentativasEnvio: dadosParaPersistencia.tentativasEnvio,
        ultimaMensagemErro: dadosParaPersistencia.ultimaMensagemErro,
      },
    });
  }


   atualizar(envio: Envio): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Busca um envio pelo seu ID, incluindo os dados de relacionamento.
   *
   * @param id O ID do envio a ser buscado.
   * @returns A entidade de domínio Envio ou null se não for encontrado.
   */
  async buscarPorId(id: string): Promise<Envio | null> {
    // 1. Busca o registro no banco de dados.
    const envioPrisma = await this.prisma.envioFormulario.findUnique({
      where: { id },
      // Inclui os relacionamentos definidos no EnvioMap para garantir que
      // a entidade de domínio seja criada com todas as informações.
      // Neste caso, se a relação com 'feedback' for necessária, ela seria
      // buscada no FeedbackRepository. O envio agora não tem feedbackId.
      include: {
        formulario: true,
        cliente: true,
        usuario: true,
        feedback: true,
      }
    });

    if (!envioPrisma) {
      return null;
    }

    // 2. Se encontrar, usa o Mapper para converter de volta para a entidade de domínio.
    return EnvioMap.toDomain(envioPrisma);
  }
}