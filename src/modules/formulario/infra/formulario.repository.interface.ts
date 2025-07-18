import { IRepository } from "@shared/domain/repository.inteface";
import { Formulario } from "../domain/formulario/formulario.entity";

export interface IFormularioRepository<T = Formulario> extends IRepository<T> {}
