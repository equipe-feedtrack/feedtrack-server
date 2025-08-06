import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { ListarFormulariosInputDTO, ListarFormulariosResponseDTO } from "../../dto/formulario/ListarFormulariosResponseDTO";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";

export class ListarFormulariosUseCase implements IUseCase<ListarFormulariosInputDTO | undefined, ListarFormulariosResponseDTO[]> {
  private readonly _formularioRepository: IFormularioRepository<Formulario>;

  constructor(formularioRepository:  IFormularioRepository<Formulario>) {
    this._formularioRepository = formularioRepository;
  }

  /**
   * Executa a listagem de formulários.
   * @param filtros Um objeto opcional com os filtros a serem aplicados.
   * @returns Uma promessa que resolve com um array de DTOs de cliente.
   */
  async execute(filtros?: ListarFormulariosInputDTO): Promise<ListarFormulariosResponseDTO[]> {
    const formularios = await this._formularioRepository.listar(filtros);
    
    // Mapeia a lista de entidades de domínio para uma lista de DTOs resumidos.
    return formularios.map(form => FormularioMap.toListDTO(form));
  }
}
