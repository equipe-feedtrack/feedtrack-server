import { IFormularioRepository } from "../domain/formulario/formulario.repository.interface";
import { Formulario } from "../domain/formulario/formulario.entity";
import { PrismaClient } from "@prisma/client";
import { FormularioMap } from "../mappers/formulario.map";

const prisma = new PrismaClient();

export class FormularioRepositoryPrisma implements IFormularioRepository<Formulario> {
  constructor(private prisma: PrismaClient) {}

  async recuperarPorUuid(uuid: string): Promise<Formulario | null> {
    const formularioPrisma = await this.prisma.formulario.findUnique({ where: { id: uuid } });
    if (!formularioPrisma) return null;

    return FormularioMap.toDomain({
      id: formularioPrisma.id,
      titulo: formularioPrisma.titulo,
      dataCriacao: formularioPrisma.data_criacao,
      dataAtualizacao: formularioPrisma.data_atualizacao,
      dataExclusao: formularioPrisma.data_exclusao ?? null,
      clienteId: formularioPrisma.cliente_id,
      produtoId: formularioPrisma.produto_id,
      funcionarioId: formularioPrisma.funcionario_id,
    });
  }

  async recuperarTodos(): Promise<Formulario[]> {
    const formularios = await this.prisma.formulario.findMany();

    return formularios.map((f) =>
      FormularioMap.toDomain({
        id: f.id,
        titulo: f.titulo,
        dataCriacao: f.data_criacao,
        dataAtualizacao: f.data_atualizacao,
        dataExclusao: f.data_exclusao ?? null,
        clienteId: f.cliente_id,
        produtoId: f.produto_id,
        funcionarioId: f.funcionario_id,
      })
    );
  }

  async existe(uuid: string): Promise<boolean> {
    const count = await this.prisma.formulario.count({ where: { id: uuid } });
    return count > 0;
  }

  async inserir(entity: Formulario): Promise<Formulario> {
    const formularioCriado = await this.prisma.formulario.create({
      data: {
        id: entity.id,
        titulo: entity.titulo,
        data_criacao: entity.dataCriacao,
        data_atualizacao: entity.dataAtualizacao,
        data_exclusao: entity.dataExclusao ?? null,
        cliente_id: entity.clienteId,
        produto_id: entity.produtoId,
        funcionario_id: entity.funcionarioId,
      },
    });

    return FormularioMap.toDomain({
      id: formularioCriado.id,
      titulo: formularioCriado.titulo,
      dataCriacao: formularioCriado.data_criacao,
      dataAtualizacao: formularioCriado.data_atualizacao,
      dataExclusao: formularioCriado.data_exclusao ?? null,
      clienteId: formularioCriado.cliente_id,
      produtoId: formularioCriado.produto_id,
      funcionarioId: formularioCriado.funcionario_id,
    });
  }

  async atualizar(uuid: string, entity: Partial<Formulario>): Promise<boolean> {
    const result = await this.prisma.formulario.updateMany({
      where: { id: uuid },
      data: {
        titulo: entity.titulo,
        data_atualizacao: new Date(),
        data_exclusao: entity.dataExclusao ?? undefined,
        cliente_id: entity.clienteId,
        produto_id: entity.produtoId,
        funcionario_id: entity.funcionarioId,
      },
    });

    return result.count > 0;
  }

  async deletar(uuid: string): Promise<boolean> {
    const result = await this.prisma.formulario.deleteMany({ where: { id: uuid } });
    return result.count > 0;
  }
}