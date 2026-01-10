import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { IFuncionarioRepository } from '@modules/acesso_e_identidade/infra/funcionario/funcionario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class AtualizarFuncionarioUseCase implements IUseCase<Funcionario, Funcionario> {
  constructor(private funcionarioRepository: IFuncionarioRepository) {}

  async execute(funcionario: Funcionario): Promise<Funcionario> {
    return await this.funcionarioRepository.alterar(funcionario);
  }
}
