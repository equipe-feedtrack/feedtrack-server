import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { ListarFormulariosInputDTO, ListarFormulariosResponseDTO } from "../../dto/formulario/ListarFormulariosResponseDTO";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";

export class ListarFormulariosUseCase implements IUseCase<ListarFormulariosInputDTO, ListarFormulariosResponseDTO[]> {
  constructor(private readonly _formularioRepository: IFormularioRepository) {}

  async execute(input: ListarFormulariosInputDTO): Promise<ListarFormulariosResponseDTO[]> {
    // Chama o repositório apenas com o empresaId
    const formularios = await this._formularioRepository.listar(input.empresaId);
    
    // Mapeia para DTOs
    return formularios.map(FormularioMap.toListDTO);
  }
}
