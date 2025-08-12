import { PrismaClient } from '@prisma/client';
import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { IFuncionarioRepository } from './funcionario.repository.interface';
import { FuncionarioMap } from '../mappers/funcionario.map';

export class FuncionarioRepositoryPrisma implements IFuncionarioRepository {
  constructor(private prisma: PrismaClient) {}

async inserir(funcionario: Funcionario): Promise<Funcionario> {
const funcionarioPrisma = FuncionarioMap.toPersistence(funcionario);

console.log('Inserindo funcionário:', funcionarioPrisma);

const novoFuncionario = await this.prisma.funcionario.create({
  data: funcionarioPrisma, // passe o objeto completo, sem remover o id
});
  return FuncionarioMap.toDomain(novoFuncionario);
}


  async buscarPorId(id: string): Promise<Funcionario | null> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id },
    });
    if (!funcionario) {
      return null;
    }
    return FuncionarioMap.toDomain(funcionario);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Funcionario | null> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id: usuarioId },
    });
    if (!funcionario) {
      return null;
    }
    return FuncionarioMap.toDomain(funcionario);
  }

  async alterar(funcionario: Funcionario): Promise<Funcionario> {
    const funcionarioPrisma = FuncionarioMap.toPersistence(funcionario);
    const funcionarioAtualizado = await this.prisma.funcionario.update({
      where: { id: funcionario.id },
      data: funcionarioPrisma,
    });
    return FuncionarioMap.toDomain(funcionarioAtualizado);
  }

  async deletar(id: string): Promise<boolean> {
    const funcionario = await this.prisma.funcionario.delete({
      where: { id },
    });
    return !!funcionario;
  }
}
