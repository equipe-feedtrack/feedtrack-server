import { IRepository } from "@shared/infra/repository.inteface";
import { Formulario } from "../../domain/formulario/formulario.entity";

export interface IFormularioRepository<T>  {

  /**
   * Lista formulários, com possibilidade de filtros.
   */
  listar(filtros?: { ativo?: boolean }): Promise<Formulario[]>;
  inserir(formulario: Formulario): Promise<void>;
  atualizar(formulario: Formulario): Promise<void>; 
  recuperarPorUuid(id: string): Promise<Formulario | null>;
  listar(filtros?: { ativo?: boolean }): Promise<Formulario[]>;
  deletar(id: string): Promise<void>;
  existe(id: string): Promise<boolean>;

  
}