import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

export class DeletarFormularioUseCase implements IUseCase<string, void> {
  private readonly _formularioRepository: IFormularioRepository<Formulario>;

  constructor(formularioRepository: IFormularioRepository<Formulario>) {
    this._formularioRepository = formularioRepository;
  }

  async execute(id: string): Promise<void> {
    const existe = await this._formularioRepository.existe(id);
    if (!existe) {
      throw new Error(`Formulário com ID ${id} não encontrado.`);
    }

    await this._formularioRepository.deletar(id);
  }
}