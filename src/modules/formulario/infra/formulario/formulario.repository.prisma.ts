import { PrismaClient } from "@prisma/client";
import { Formulario } from "../../domain/formulario/formulario.entity";
import { IFormulario } from "../../domain/formulario/formulario.types";
import { FormularioMap } from "../mappers/formulario.map";
import { IFormularioRepository } from "./formulario.repository.interface";

export class FormularioRepositoryPrisma implements IFormularioRepository<IFormulario> {
  constructor(private prisma: PrismaClient) {}
 
  async recuperarPorUuid(id: string): Promise<Formulario | null> {
    const formularioDb = await this.prisma.formulario.findUnique({
      where: { id },
      include: { perguntas: true }, // Sempre inclua as partes do agregado
    });

    if (!formularioDb) return null;

    // A complexidade da tradução fica 100% no Mapper
    return FormularioMap.toDomain(formularioDb);
  }

  async listar(filtros?: { ativo?: boolean }): Promise<Formulario[]> {
    const formulariosDb = await this.prisma.formulario.findMany({
      where: {
        ativo: filtros?.ativo, // Filtro opcional por status
      },
      include: { perguntas: true },
    });

    return formulariosDb.map(FormularioMap.toDomain);
  }

  async inserir(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);

    // 2. CORREÇÃO AQUI:
    // Usamos o PerguntaMap.toPersistence para converter cada entidade 'Pergunta'
    // para o formato de dados que o Prisma espera (com snake_case).
     const perguntasConnect = formulario.perguntas.map(p => ({ id: p.id }));
    await this.prisma.formulario.upsert({
      where: { id: formulario.id },
      create: {
        ...dadosFormulario,
        perguntas: {
          // Ao criar, conecta o formulário às perguntas existentes pelos seus IDs
          connect: perguntasConnect,
        },
      },
      update: {
        texto: dadosFormulario.texto,
        descricao: dadosFormulario.descricao,
        ativo: dadosFormulario.ativo,
        perguntas: {
          // Ao atualizar, 'set' substitui a lista de conexões pela nova
          set: perguntasConnect,
        },
      },
  });
  
  }

  recuperarTodos(): Promise<IFormulario[]> {
    throw new Error("Method not implemented.");
  }

  existe(uuid: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  atualizar(uuid: string, entity: Partial<IFormulario>): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
  deletar(uuid: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}