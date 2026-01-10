import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class AtualizarUsuarioUseCase implements IUseCase<Usuario, Usuario> {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(usuario: Usuario): Promise<Usuario> {
    return await this.usuarioRepository.alterar(usuario);
  }
}
