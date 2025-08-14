import { PrismaClient } from "@prisma/client";
import { Formulario } from "../../domain/formulario/formulario.entity";
import { FormularioMap } from "../mappers/formulario.map";
import { IFormularioRepository } from "./formulario.repository.interface";


export class FormularioRepositoryPrisma implements IFormularioRepository<Formulario> {
  constructor(private prisma: PrismaClient) {}
  
  
  async inserir(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);

    await this.prisma.formulario.create({
      data: {
        ...dadosFormulario,
        perguntas: {
          create: formulario.perguntas.map((p, index) => ({
            ordemNaLista: index, // Fornece o valor para o campo obrigatório.
            pergunta: {
              connect: { id: p.id },
            },
            
          })),
        },
      },
    });
  }


  recuperarTodos(): Promise<Formulario[]> {
    throw new Error("Method not implemented.");
  }
  
  async recuperarPorUuid(id: string): Promise<Formulario | null> {
    const formularioDb = await this.prisma.formulario.findUnique({
      where: { id },
      // ✅ CORREÇÃO: Para uma relação N-N explícita, o include precisa ser aninhado
      // para buscar os dados da Pergunta através da tabela de junção.
      include: {
        
        perguntas: {
          include: {
            pergunta: true,
          },
        },
      },
    });

    if (!formularioDb) return null;

    // O Mapper lida com a conversão da estrutura aninhada para o domínio.
    return FormularioMap.toDomain(formularioDb);
  }
  
  async listar(filtros?: { ativo?: boolean }): Promise<Formulario[]> {
    const formulariosDb = await this.prisma.formulario.findMany({
      where: {
        ativo: filtros?.ativo,
      },
      include: {
        perguntas: {
          include: {
            pergunta: {
              select:{
                id: true,
                tipo: true,
                opcoes: true,
                texto: true

              }
            }
          },
        },
      },
    });
    return formulariosDb.map(form => FormularioMap.toDomain(form));
  }


   async atualizar(formulario: Formulario): Promise<void> {
    const dadosFormulario = FormularioMap.toPersistence(formulario);
    const { id, ...dadosEscalares } = dadosFormulario;

    await this.prisma.formulario.update({
        where: { id: formulario.id },
        data: {
            ...dadosEscalares,
            perguntas: {
                deleteMany: {},
                create: formulario.perguntas.map((p, index) => ({
                    ordemNaLista: index,
                    pergunta: {
                        connect: { id: p.id }
                    }
                }))
            }
        }
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.formulario.count({
      where: { id },
    });
    return count > 0;
  }

  async deletar(id: string): Promise<void> {
    // Garante que as entradas na tabela de junção sejam deletadas primeiro.
    await this.prisma.perguntasOnFormularios.deleteMany({
        where: { formularioId: id }
    });
    await this.prisma.formulario.delete({
      where: { id },
    });
  }
}
