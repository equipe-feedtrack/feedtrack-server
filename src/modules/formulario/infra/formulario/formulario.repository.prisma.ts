import { PrismaClient } from "@prisma/client";
import { Formulario } from "../../domain/formulario/formulario.entity";
import { FormularioMap } from "../mappers/formulario.map";
import { IFormularioRepository } from "./formulario.repository.interface";


export class FormularioRepositoryPrisma implements IFormularioRepository<Formulario> {
  constructor(private prisma: PrismaClient) {}
  
  
  async inserir(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);

    await this.prisma.formulario.create({
      data: dadosFormulario,
      include: {
        perguntas: true,
      },
    });
  }


  recuperarTodos(): Promise<Formulario[]> {
    throw new Error("Method not implemented.");
  }
  
  async recuperarPorUuid(id: string): Promise<Formulario | null> {
    const formularioDb = await this.prisma.formulario.findUnique({
      where: { id },
    });

    if (!formularioDb) return null;

    return FormularioMap.toDomain(formularioDb);
  }
  
  async listar(filtros?: { ativo?: boolean, empresaId?: string }): Promise<Formulario[]> {
    const whereClause: any = {};

    if (filtros?.ativo !== undefined) {
      whereClause.ativo = filtros.ativo;
    }
    if (filtros?.empresaId) {
      whereClause.empresaId = filtros.empresaId;
    }

    const formulariosDb = await this.prisma.formulario.findMany({
      where: whereClause,
    });
    return formulariosDb.map(form => FormularioMap.toDomain(form));
  }


   async atualizar(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);
    const { id, ...dadosEscalares } = dadosFormulario;

    await this.prisma.formulario.update({
        where: { id: formulario.id },
        data: dadosEscalares
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.formulario.count({
      where: { id },
    });
    return count > 0;
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.formulario.delete({
      where: { id },
    });
  }
}