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
      nomeEmpresa: usuarioPrisma.nome_empresa || null, // Pode ser null para usuários que não são do tipo EMPRESA
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
      nome_empresa: usuario.nomeEmpresa, // Pode ser null para usuários que não são do tipo EMPRESA
      data_criacao: usuario.dataCriacao,
      data_atualizacao: usuario.dataAtualizacao,
      data_exclusao: usuario.dataExclusao,
    };
  }
}
