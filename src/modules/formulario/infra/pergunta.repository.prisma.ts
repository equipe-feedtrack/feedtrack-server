import { PrismaClient } from "@prisma/client";
import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { IPergunta } from "../domain/pergunta/domain/pergunta.types";
import { PerguntaMap } from "../mappers/pergunta.map";
import { IPerguntaRepository } from "./pergunta.repository.interface";

export class PerguntaRepositoryPrisma implements IPerguntaRepository<IPergunta> {
  // Recebemos o prisma via injeção de dependência, o que é ótimo.
  constructor(private readonly prisma: PrismaClient) {}
  
  async recuperarPorUuid(id: string): Promise<IPergunta | null> {
    const perguntaPrisma = await this.prisma.pergunta.findUnique({
      where: { id },
    });

    if (!perguntaPrisma) return null;

    // Apenas chamamos o Mapper. Ele faz todo o trabalho de tradução.
    return PerguntaMap.toDomain(perguntaPrisma);
  }
  
  async inserir(pergunta: Pergunta): Promise<void> {
   const dadosParaPersistencia = PerguntaMap.toPersistence(pergunta);

    await this.prisma.pergunta.upsert({
      where: { id: pergunta.id },
      // Para o 'update', omitimos 'opcoes' se for null para evitar erros.
      update: {
        texto: dadosParaPersistencia.texto,
        tipo: dadosParaPersistencia.tipo,
        opcoes: dadosParaPersistencia.opcoes ?? undefined, // Omitir se for null
        data_atualizacao: dadosParaPersistencia.data_atualizacao,
        data_exclusao: dadosParaPersistencia.data_exclusao,
      },
      // Para o 'create', garantimos que todos os campos obrigatórios estejam presentes e com os tipos corretos.
      create: {
        id: dadosParaPersistencia.id,
        texto: dadosParaPersistencia.texto,
        tipo: dadosParaPersistencia.tipo,
        opcoes: dadosParaPersistencia.opcoes ?? null, // 'null' é um valor JSON válido na criação
        data_criacao: dadosParaPersistencia.data_criacao ?? new Date(),
        data_atualizacao: dadosParaPersistencia.data_atualizacao ?? new Date(),
        data_exclusao: dadosParaPersistencia.data_exclusao,
      },
    });
  }

  async buscarMuitosPorId(ids: string[]): Promise<Pergunta[]> {
    const perguntasPrisma = await this.prisma.pergunta.findMany({
      where: {
        id: {
          in: ids, // Usa o filtro 'in' para encontrar todos os IDs na lista
        },
      },
    });

    return perguntasPrisma.map(PerguntaMap.toDomain);
  }

  recuperarTodos(): Promise<IPergunta[]> {
    throw new Error("Method not implemented.");
  }

  existe(uuid: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  atualizar(uuid: string, entity: Partial<IPergunta>): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
  deletar(uuid: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}

  