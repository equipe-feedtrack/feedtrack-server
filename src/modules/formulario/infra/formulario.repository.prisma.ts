import { PrismaClient } from "@prisma/client";
import { Formulario } from "../domain/formulario/formulario.entity";
import { FormularioMap } from "../mappers/formulario.map";
import { IFormularioRepository } from "./formulario.repository.interface";

export class FormularioRepositoryPrisma implements IFormularioRepository<Formulario> {
  constructor(private prisma: PrismaClient) {}

  async recuperarPorUuid(uuid: string): Promise<Formulario | null> {
    const f = await this.prisma.formulario.findUnique({
      where: { id: uuid },
      include: { perguntas: true },
    });
    if (!f) return null;
    const perguntasTratadas = f.perguntas.map(p => ({
    ...p,
    // Prisma pode retornar opcoes como null ou qualquer JSON
    opcoes: p.opcoes === null ? undefined : Array.isArray(p.opcoes) ? p.opcoes.map(String) : undefined,
    formularioId: p.formularioId, // converter nome para camelCase esperado no domínio
    dataCriacao: p.data_criacao,
    dataAtualizacao: p.data_atualizacao,
    dataExclusao: p.data_exclusao,
    }));

    return FormularioMap.toDomain({
      id: f.id,
      titulo: f.texto,
      descricao: f.descricao,
      perguntas: perguntasTratadas,
      ativo: f.ativo,
      dataCriacao: f.data_criacao,
      dataAtualizacao: f.data_atualizacao,
      dataExclusao: f.data_exclusao ?? null,
    });
  }

  async recuperarTodos(): Promise<Formulario[]> {
  const formularios = await this.prisma.formulario.findMany({
    include: { perguntas: true },
  });

  return formularios.map(f => {
    // Normalizar perguntas
    const perguntasTratadas = f.perguntas.map(p => ({
      ...p,
      opcoes: p.opcoes === null 
        ? undefined 
        : Array.isArray(p.opcoes) 
          ? p.opcoes.map(String) 
          : undefined,
      formularioId: p.formularioId,
      dataCriacao: p.data_criacao,
      dataAtualizacao: p.data_atualizacao,
      dataExclusao: p.data_exclusao,
    }));

    return FormularioMap.toDomain({
      id: f.id,
      titulo: f.texto,
      descricao: f.descricao,
      perguntas: perguntasTratadas,
      ativo: f.ativo,
      dataCriacao: f.data_criacao,
      dataAtualizacao: f.data_atualizacao,
      dataExclusao: f.data_exclusao ?? null,
    });
  });
}

  async existe(uuid: string): Promise<boolean> {
    const count = await this.prisma.formulario.count({ where: { id: uuid } });
    return count > 0;
  }

  async inserir(formulario: Formulario): Promise<Formulario> {
    const fCriado = await this.prisma.formulario.create({
      data: {
        id: formulario.id,
        texto: formulario.titulo,
        descricao: formulario.descricao ?? '',
        ativo: formulario.ativo,
        data_criacao: formulario.dataCriacao,
        data_atualizacao: formulario.dataAtualizacao,
        data_exclusao: formulario.dataExclusao ?? null,
        // perguntas devem ser inseridas separadamente
      },
    });

    return FormularioMap.toDomain({
      id: fCriado.id,
      titulo: fCriado.texto,
      descricao: fCriado.descricao,
      perguntas: [], // perguntas vazias ao criar
      ativo: fCriado.ativo,
      dataCriacao: fCriado.data_criacao,
      dataAtualizacao: fCriado.data_atualizacao,
      dataExclusao: fCriado.data_exclusao ?? null,
    });
  }

  async atualizar(uuid: string, formulario: Partial<Formulario>): Promise<boolean> {
    const result = await this.prisma.formulario.updateMany({
      where: { id: uuid },
      data: {
        texto: formulario.titulo,
        descricao: formulario.descricao,
        ativo: formulario.ativo,
        data_atualizacao: new Date(),
        data_exclusao: formulario.dataExclusao ?? undefined,
      },
    });

    return result.count > 0;
  }

  async deletar(uuid: string): Promise<boolean> {
    const result = await this.prisma.formulario.deleteMany({ where: { id: uuid } });
    return result.count > 0;
  }
}
