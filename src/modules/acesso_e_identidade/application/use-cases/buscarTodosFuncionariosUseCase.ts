import { Funcionario } from "../../domain/funcionario/funcionario.entity";
import { IFuncionarioRepository } from "../../infra/funcionario/funcionario.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

export class BuscarTodosFuncionariosUseCase implements IUseCase<BuscarTodosFuncionariosUseCase, Funcionario[]> {
    constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

    async execute(): Promise<Funcionario[]> {
        return await this.funcionarioRepository.buscarTodos();
    }
}
