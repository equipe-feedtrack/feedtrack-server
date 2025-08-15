import { IFuncionarioRepository } from '@modules/acesso_e_identidade/infra/funcionario/funcionario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class DeletarFuncionarioUseCase implements IUseCase<string, boolean> {
  constructor(private funcionarioRepository: IFuncionarioRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.funcionarioRepository.deletar(id);
  }
}
