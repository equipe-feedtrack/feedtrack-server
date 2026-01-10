import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { IFuncionarioRepository } from '@modules/acesso_e_identidade/infra/funcionario/funcionario.repository.interface';
import { CriarFuncionarioProps } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.types';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class CriarFuncionarioUseCase implements IUseCase<CriarFuncionarioProps, Funcionario> {
  constructor(private funcionarioRepository: IFuncionarioRepository) {}

  async execute(props: CriarFuncionarioProps): Promise<Funcionario> {
    const funcionario = Funcionario.criarFuncionario(props);
    return await this.funcionarioRepository.inserir(funcionario);
  }
}
