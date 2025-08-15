import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';

export interface IFuncionarioRepository {
  inserir(funcionario: Funcionario): Promise<Funcionario>;
  buscarPorId(id: string): Promise<Funcionario | null>;
  buscarPorUsuarioId(usuarioId: string): Promise<Funcionario | null>;
  buscarTodos(): Promise<Funcionario[]>;
  alterar(funcionario: Funcionario): Promise<Funcionario>;
  deletar(id: string): Promise<boolean>;
}
