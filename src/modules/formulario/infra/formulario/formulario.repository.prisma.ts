import { PrismaClient } from "@prisma/client";
import { Formulario } from "../../domain/formulario/formulario.entity";
import { FormularioMap } from "../mappers/formulario.map";
import { IFormularioRepository } from "./formulario.repository.interface";

export class FormularioRepositoryPrisma implements IFormularioRepository {
  constructor(private prisma: PrismaClient) {}

async inserir(formulario: Formulario): Promise<void> {
  const dadosFormulario = FormularioMap.toPersistence(formulario);

  await this.prisma.formulario.create({
    data: {
      ...dadosFormulario,
      perguntas: {
        create: formulario.perguntas.map((p) => ({
          pergunta: { connect: { id: p.id } },
        })),
      },
    },
  });
}


async recuperarPorUuid(id: string, empresaId: string): Promise<Formulario | null> {
  const formularioDb = await this.prisma.formulario.findFirst({
    where: {
      id,
      empresaId,
    },
    include: {
      perguntas: {
        include: {
          pergunta: true,
        },
      },
    },
  });

  if (!formularioDb) return null;

  return FormularioMap.toDomain(formularioDb);
}


  // Lista todos os formulários de uma empresa
  async listar(empresaId: string): Promise<Formulario[]> {
const formulariosDb = await this.prisma.formulario.findMany({
  where: { empresaId },
  include: {
    perguntas: {
      include: {
        pergunta: true, // isso traz os dados completos da pergunta
      },
    },
  },
});



    return formulariosDb.map(FormularioMap.toDomain);
  }

  async atualizar(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);
    const { id, ...dadosEscalares } = dadosFormulario;

    await this.prisma.formulario.update({
      where: { id: formulario.id },
      data: dadosEscalares,
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
