import { Usuario } from "../../domain/usuario/usuario.entity";
import { IUsuarioRepository } from "../../infra/usuario/usuario.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

// DTO de input
export type BuscarUsuariosInputDTO = {
  empresaId: string;
};

// UseCase ajustado
export class BuscarTodosUsuariosUseCase implements IUseCase<BuscarUsuariosInputDTO, Usuario[]> {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: BuscarUsuariosInputDTO): Promise<Usuario[]> {
    return await this.usuarioRepository.buscarTodos(input.empresaId);
  }
}

