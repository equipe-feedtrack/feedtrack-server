import { IRepository } from "@shared/domain/repository.inteface";
import { Formulario } from "../../domain/formulario/formulario.entity";

export interface IFormularioRepository<T> extends IRepository<T> {

  /**
   * Lista formulários, com possibilidade de filtros.
   */
  listar(filtros?: { ativo?: boolean }): Promise<Formulario[]>;
}