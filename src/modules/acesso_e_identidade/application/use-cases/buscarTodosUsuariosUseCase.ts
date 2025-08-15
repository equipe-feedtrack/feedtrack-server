import { Usuario } from "../../domain/usuario/usuario.entity";
import { IUsuarioRepository } from "../../infra/usuario/usuario.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

export class BuscarTodosUsuariosUseCase implements IUseCase<BuscarTodosUsuariosUseCase, Usuario[]> {
    constructor(private readonly usuarioRepository: IUsuarioRepository) {}

    async execute(): Promise<Usuario[]> {
        return await this.usuarioRepository.buscarTodos();
    }
}
