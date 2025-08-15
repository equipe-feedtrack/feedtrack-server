import { PrismaClient } from '@prisma/client';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { IUsuarioRepository } from './usuario.repository.interface';
import { UsuarioMap } from '../mappers/usuario.map';

export class UsuarioRepositoryPrisma implements IUsuarioRepository {
  constructor(private prisma: PrismaClient) {}

async inserir(usuario: Usuario): Promise<Usuario> {
  // Verifica se já existe usuário com o mesmo nome
  const usuarioExistente = await this.prisma.usuario.findUnique({
    where: { nome_usuario: usuario.nomeUsuario },
  });

  if (usuarioExistente) {
    throw new Error(`Usuário com nome '${usuario.nomeUsuario}' já existe.`);
  }

  const usuarioPrisma = UsuarioMap.toPersistence(usuario);
  const novoUsuario = await this.prisma.usuario.create({
    data: usuarioPrisma,
  });
  return UsuarioMap.toDomain(novoUsuario);
}


  async buscarPorId(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if (!usuario) {
      return null;
    }
    return UsuarioMap.toDomain(usuario);
  }

  async buscarPorNomeUsuario(nomeUsuario: string): Promise<Usuario | null> {

      if (!nomeUsuario) {
    throw new Error("nomeUsuario não pode ser vazio ou undefined");
  }

    const usuario = await this.prisma.usuario.findUnique({
      where: { nome_usuario: nomeUsuario },
    });
    if (!usuario) {
      return null;
    }
    return UsuarioMap.toDomain(usuario);
  }

  async buscarTodos(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map(UsuarioMap.toDomain);
  }

  async alterar(usuario: Usuario): Promise<Usuario> {
    const usuarioPrisma = UsuarioMap.toPersistence(usuario);
    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: usuarioPrisma,
    });
    return UsuarioMap.toDomain(usuarioAtualizado);
  }

  async deletar(id: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.delete({
      where: { id: id },
    });
    return !!usuario;
  }
}
