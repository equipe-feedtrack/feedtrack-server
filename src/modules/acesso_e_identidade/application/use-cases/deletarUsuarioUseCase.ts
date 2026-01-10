import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class DeletarUsuarioUseCase implements IUseCase<string, boolean> {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.usuarioRepository.deletar(id);
  }
}
