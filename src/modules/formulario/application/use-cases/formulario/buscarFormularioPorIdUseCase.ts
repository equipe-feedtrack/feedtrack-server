import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { FormularioResponseDTO } from "../../dto/formulario/FormularioResponseDTO";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";
// DTO de input para buscar formulário
interface BuscarFormularioInput {
  id: string;
  empresaId: string;
}

export class BuscarFormularioPorIdUseCase 
  implements IUseCase<BuscarFormularioInput, FormularioResponseDTO | null> 
{
  constructor(private readonly _formularioRepository: IFormularioRepository) {}

  async execute(input: BuscarFormularioInput): Promise<FormularioResponseDTO | null> {
    const { id, empresaId } = input;

    const formulario = await this._formularioRepository.recuperarPorUuid(id, empresaId);

    if (!formulario) {
      return null;
    }

    return FormularioMap.toResponseDTO(formulario);
  }
}
