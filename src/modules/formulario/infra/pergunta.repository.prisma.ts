import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { PerguntaMap } from "../mappers/pergunta.map";
import { IPerguntaRepository } from "./pergunta.repository.interface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PerguntaRepositoryPrisma implements IPerguntaRepository<Pergunta> {
  constructor(private prisma: PrismaClient) {}

  async recuperarPorUuid(uuid: string): Promise<Pergunta | null> {
    const perguntaPrisma = await this.prisma.pergunta.findUnique({ where: { id: uuid } });
    if (!perguntaPrisma) return null;

    return PerguntaMap.toDomain({
      id: perguntaPrisma.id,
      texto: perguntaPrisma.texto,
      tipo: perguntaPrisma.tipo,
      opcoes: perguntaPrisma.opcoes as string[],
      dataCriacao: perguntaPrisma.data_criacao,
      dataAtualizacao: perguntaPrisma.data_atualizacao,
      dataExclusao: perguntaPrisma.data_exclusao ?? null,
      formularioId: perguntaPrisma.formulario_id,
    });
  }

  async recuperarTodos(): Promise<Pergunta[]> {
    const perguntasPrisma = await this.prisma.pergunta.findMany();

    return perguntasPrisma.map((p) =>
      PerguntaMap.toDomain({
        id: p.id,
        texto: p.texto,
        tipo: p.tipo,
        opcoes: p.opcoes as string[],
        dataCriacao: p.data_criacao,
        dataAtualizacao: p.data_atualizacao,
        dataExclusao: p.data_exclusao ?? null,
        formularioId: p.formulario_id,
      })
    );
  }

  async existe(uuid: string): Promise<boolean> {
    const count = await this.prisma.pergunta.count({ where: { id: uuid } });
    return count > 0;
  }

  async inserir(pergunta: Pergunta): Promise<Pergunta> {
    const perguntaCriada = await this.prisma.pergunta.create({
      data: {
        id: pergunta.id,
        texto: pergunta.texto,
        tipo: pergunta.tipo,
        opcoes: pergunta.opcoes ?? [],
        data_criacao: pergunta.dataCriacao,
        data_atualizacao: pergunta.dataAtualizacao,
        data_exclusao: pergunta.dataExclusao ?? null,
        formulario_id: pergunta.formularioId,
      },
    });

    return PerguntaMap.toDomain({
      id: perguntaCriada.id,
      texto: perguntaCriada.texto,
      tipo: perguntaCriada.tipo,
      opcoes: perguntaCriada.opcoes as string[],
      dataCriacao: perguntaCriada.data_criacao,
      dataAtualizacao: perguntaCriada.data_atualizacao,
      dataExclusao: perguntaCriada.data_exclusao ?? null,
      formularioId: perguntaCriada.formulario_id,
    });
  }

  async atualizar(uuid: string, pergunta: Partial<Pergunta>): Promise<boolean> {
    const result = await this.prisma.pergunta.updateMany({
      where: { id: uuid },
      data: {
        texto: pergunta.texto,
        tipo: pergunta.tipo,
        opcoes: pergunta.opcoes ?? [],
        data_atualizacao: new Date(),
        data_exclusao: pergunta.dataExclusao ?? undefined,
      },
    });

    return result.count > 0;
  }

  async deletar(uuid: string): Promise<boolean> {
    const result = await this.prisma.pergunta.deleteMany({ where: { id: uuid } });
    return result.count > 0;
  }
}
