import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { CriarUsuarioProps } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class CriarUsuarioUseCase implements IUseCase<CriarUsuarioProps, Usuario> {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(props: CriarUsuarioProps): Promise<Usuario> {
    const usuario = Usuario.criarUsuario(props);
    return await this.usuarioRepository.inserir(usuario);
  }
}
