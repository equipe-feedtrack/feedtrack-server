import { FormularioMap } from "@modules/formulario/mappers/formulario.map";
import { ListarFormulariosResponseDTO } from "../dto/formulario/ListarFormulariosResponseDTO";
import { IFormularioRepository } from "@modules/formulario/infra/formulario.repository.interface";
import { IFormulario } from "@modules/formulario/domain/formulario/formulario.types";

interface ListarFormulariosRequest {
  apenasAtivos?: boolean;
}

export class ListarFormulariosUseCase {
  constructor(private readonly formularioRepository: IFormularioRepository<IFormulario>) {}

  async execute(request: ListarFormulariosRequest): Promise<ListarFormulariosResponseDTO[]> {
    // 1. Busca a lista de entidades no repositório com filtros opcionais.
    const formularios = await this.formularioRepository.listar({
      ativo: request.apenasAtivos,
    });

    // 2. Mapeia cada entidade da lista para seu DTO de lista correspondente.
    return formularios.map(FormularioMap.toListDTO);
  }
}