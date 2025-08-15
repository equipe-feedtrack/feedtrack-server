import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class BuscarUsuarioPorIdUseCase implements IUseCase<string, Usuario | null> {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Usuario | null> {
    return await this.usuarioRepository.buscarPorId(id);
  }
}
