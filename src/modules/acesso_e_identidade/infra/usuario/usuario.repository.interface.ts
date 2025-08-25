import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';

export interface IUsuarioRepository {
  inserir(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorNomeUsuario(nomeUsuario: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorTokenRecuperacao(token: string): Promise<Usuario | null>;
  buscarTodos(empresaId: string): Promise<Usuario[]>;
  alterar(usuario: Usuario): Promise<Usuario>;
  deletar(id: string): Promise<boolean>;
}
