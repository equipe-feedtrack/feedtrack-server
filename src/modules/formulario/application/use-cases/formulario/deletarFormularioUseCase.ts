// modules/formulario/application/use-case/deletar-formulario.usecase.ts
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";

interface DeletarFormularioInput {
  id: string;
  empresaId: string;
}

export class DeletarFormularioUseCase implements IUseCase<DeletarFormularioInput, void> {
  constructor(private readonly _formularioRepository: IFormularioRepository) {}

  async execute(input: DeletarFormularioInput): Promise<void> {
    const { id, empresaId } = input;

    const existe = await this._formularioRepository.existe(id, empresaId);
    if (!existe) {
      throw new Error(`Formulário com ID ${id} não encontrado.`);
    }

    await this._formularioRepository.deletar(id, empresaId);
  }
}
