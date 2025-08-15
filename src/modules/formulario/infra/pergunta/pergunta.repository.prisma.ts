import { PrismaClient } from "@prisma/client";
import { Pergunta } from "../../domain/pergunta/pergunta.entity";
import { PerguntaMap } from "../mappers/pergunta.map";
import { IPerguntaRepository } from "./pergunta.repository.interface";


/**
 * Repositório de Pergunta implementado com o Prisma.
 * É responsável por persistir e recuperar a entidade de domínio Pergunta.
 */
export class PerguntaRepositoryPrisma implements IPerguntaRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
  async listar(filtros?: { ativo?: boolean; }): Promise<Pergunta[]> {
    const perguntasPrisma = await this.prisma.pergunta.findMany({
      where: {
        ativo: filtros?.ativo, // Filtro opcional por status 'ativo'
      }
    });

    return perguntasPrisma.map(p => PerguntaMap.toDomain(p));
  }

  async recuperarPorUuid(id: string): Promise<Pergunta | null> {
    const perguntaPrisma = await this.prisma.pergunta.findUnique({
      where: { id },
    });

    if (!perguntaPrisma) return null;

    // O Mapper converte o modelo de dados do Prisma para a entidade de domínio.
    return PerguntaMap.toDomain(perguntaPrisma);
  }

async buscarMuitosPorId(ids: (string | null | undefined)[]): Promise<Pergunta[]> {
  const filteredIds = ids.filter((id): id is string => !!id); // filtra só strings válidas
  const perguntasPrisma = await this.prisma.pergunta.findMany({
    where: {
      id: {
        in: filteredIds,
      },
    },
  });

  return perguntasPrisma.map(p => PerguntaMap.toDomain(p));
}


async inserir(pergunta: Pergunta): Promise<void> {
  const dadosParaPersistencia = PerguntaMap.toPersistence(pergunta);

  if (!dadosParaPersistencia.empresaId) {
    throw new Error("O campo 'empresaId' é obrigatório ao criar uma pergunta.");
  }

  await this.prisma.pergunta.create({
    data: dadosParaPersistencia,
  });
}




  async atualizar(pergunta: Pergunta): Promise<void> {
    const dadosParaPersistencia = PerguntaMap.toPersistence(pergunta);
    await this.prisma.pergunta.update({
      where: { id: pergunta.id },
      data: dadosParaPersistencia,
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.pergunta.count({
      where: { id },
    });
    return count > 0;
  }

  async deletar(id: string): Promise<void> {
    // Antes de deletar a pergunta, removemos todas as suas associações
    // na tabela de junção para evitar erros de restrição de chave estrangeira.
    await this.prisma.perguntasOnFormularios.deleteMany({
      where: { perguntaId: id },
    });

    // Agora podemos deletar a pergunta com segurança.
    await this.prisma.pergunta.delete({
      where: { id },
    });
  }
}
