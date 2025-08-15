import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { IFuncionarioRepository } from '@modules/acesso_e_identidade/infra/funcionario/funcionario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';

export class BuscarFuncionarioPorIdUseCase implements IUseCase<string, Funcionario | null> {
  constructor(private funcionarioRepository: IFuncionarioRepository) {}

  async execute(id: string): Promise<Funcionario | null> {
    return await this.funcionarioRepository.buscarPorId(id);
  }
}
