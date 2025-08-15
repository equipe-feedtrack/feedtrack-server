import { Funcionario as FuncionarioPrisma } from '@prisma/client';
import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class FuncionarioMap {
  public static toDomain(funcionarioPrisma: FuncionarioPrisma): Funcionario {
    return Funcionario.recuperar({
      id: funcionarioPrisma.id,
      usuarioId: funcionarioPrisma.usuarioId,
      cargo: funcionarioPrisma.cargo,
      dataAdmissao: funcionarioPrisma.dataAdmissao,
      status: funcionarioPrisma.status as StatusUsuario,
      empresaId: funcionarioPrisma.empresaId,
      dataCriacao: funcionarioPrisma.dataCriacao,
      dataAtualizacao: funcionarioPrisma.dataAtualizacao,
      dataExclusao: funcionarioPrisma.dataExclusao,
    });
  }

public static toPersistence(funcionario: Funcionario): any {
  return {
    id: funcionario.id,
    usuario_id: funcionario.usuarioId,
    cargo: funcionario.cargo,
    data_admissao: funcionario.dataAdmissao,
    status: funcionario.status,
    empresaId: funcionario.empresaId,
    data_criacao: funcionario.dataCriacao,
    data_atualizacao: funcionario.dataAtualizacao,
    data_exclusao: funcionario.dataExclusao,
  };
}


}