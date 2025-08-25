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

 async buscarPorEmail(email: string | undefined | null): Promise<Usuario | null> {
  if (!email) return null; // evita erro do Prisma

  const usuario = await this.prisma.usuario.findUnique({
    where: { email }, // agora email sempre será string válida
  });

  return usuario ? UsuarioMap.toDomain(usuario) : null;
}

  async buscarPorTokenRecuperacao(token: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findFirst({
      where: { tokenRecuperacao: token },
    });
    if (!usuario) {
      return null;
    }
    return UsuarioMap.toDomain(usuario);
  }

  async buscarTodos(empresaId: string): Promise<Usuario[]> {
console.log("empresaId recebido:", empresaId);
const usuarios = await this.prisma.usuario.findMany({ where: { empresaId } });
console.log("usuarios encontrados:", usuarios.length);
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

  async buscarPorNomeUsuario(nomeUsuario: string): Promise<Usuario | null> {
  const usuario = await this.prisma.usuario.findUnique({
    where: { nome_usuario: nomeUsuario },
  });
  if (!usuario) return null;
  return UsuarioMap.toDomain(usuario);
}


  async deletar(id: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.delete({
      where: { id: id },
    });
    return !!usuario;
  }
}
