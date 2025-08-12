import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { FormularioResponseDTO } from "../../dto/formulario/FormularioResponseDTO";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";
export class BuscarFormularioPorIdUseCase implements IUseCase<string, FormularioResponseDTO | null> {
  private readonly _formularioRepository: IFormularioRepository<Formulario>;

  constructor(formularioRepository:  IFormularioRepository<Formulario>) {
    this._formularioRepository = formularioRepository;
  }

  async execute(id: string): Promise<FormularioResponseDTO | null> {
    const formulario = await this._formularioRepository.recuperarPorUuid(id);

    if (!formulario) {
      return null;
    }

    return FormularioMap.toResponseDTO(formulario);
  }
}