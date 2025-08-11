import { Usuario as UsuarioPrisma } from '@prisma/client';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { StatusUsuario, TipoUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class UsuarioMap {
  public static toDomain(usuarioPrisma: UsuarioPrisma): Usuario {
    return Usuario.recuperar({
      id: usuarioPrisma.id,
      nomeUsuario: usuarioPrisma.nome_usuario,
      senhaHash: usuarioPrisma.senha_hash,
      tipo: usuarioPrisma.tipo as TipoUsuario,
      status: usuarioPrisma.status as StatusUsuario,
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
      status: usuario.status,
      data_criacao: usuario.dataCriacao,
      data_atualizacao: usuario.dataAtualizacao,
      data_exclusao: usuario.dataExclusao,
    };
  }
}
