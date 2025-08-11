import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';

export interface IUsuarioRepository {
  inserir(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorNomeUsuario(nomeUsuario: string): Promise<Usuario | null>;
  alterar(usuario: Usuario): Promise<Usuario>;
  deletar(id: string): Promise<boolean>;
}
