import { Usuario as UsuarioPrisma } from '@prisma/client';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { StatusUsuario, TipoUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class UsuarioMap {
  public static toDomain(usuarioPrisma: UsuarioPrisma): Usuario {
    return Usuario.recuperar({
      id: usuarioPrisma.id,
      nomeUsuario: usuarioPrisma.nome_usuario,
      senhaHash: usuarioPrisma.senha_hash,
      email: usuarioPrisma.email || null, // Pode ser null se não houver email
      tipo: usuarioPrisma.tipo as TipoUsuario,
      status: usuarioPrisma.status as StatusUsuario,
      empresaId: usuarioPrisma.empresaId,
      dataCriacao: usuarioPrisma.data_criacao,
      dataAtualizacao: usuarioPrisma.data_atualizacao,
      dataExclusao: usuarioPrisma.data_exclusao,
    });
  }

  public static toPersistence(usuario: Usuario): any {


    return {
      id: usuario.id,
      nome_usuario: usuario.nomeUsuario,
      senha_hash: usuario.senhaHash,
      tipo: usuario.tipo,
      email: usuario.email, // Adicionei email aqui, se necessário
      status: usuario.status,
      empresaId: usuario.empresaId,
      data_criacao: usuario.dataCriacao,
      data_atualizacao: usuario.dataAtualizacao,
      data_exclusao: usuario.dataExclusao,
    };
  }

  public static toDTO(usuario: Usuario): any {
    return {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      tipo: usuario.tipo,
      email: usuario.email,
      status: usuario.status,
      empresaId: usuario.empresaId,
    };
  }
}


