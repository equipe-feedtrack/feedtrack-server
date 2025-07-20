// src/application/repositories/IFormularioRepository.

import { IRepository } from "@shared/domain/repository.inteface";
import { Formulario } from "../domain/formulario/formulario.entity";
import { IFormulario } from "../domain/formulario/formulario.types";

export interface IFormularioRepository<T> extends IRepository<T> {

  /**
   * Lista formulários, com possibilidade de filtros.
   */
  listar(filtros?: { ativo?: boolean }): Promise<Formulario[]>;
}