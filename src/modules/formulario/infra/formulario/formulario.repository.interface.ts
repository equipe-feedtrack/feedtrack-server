import { Formulario } from "../../domain/formulario/formulario.entity";

export interface IFormularioRepository {
  listar(empresaId: string): Promise<Formulario[]>;

  inserir(formulario: Formulario, empresaId: string): Promise<void>;
  atualizar(formulario: Formulario, empresaId: string): Promise<void>;
  
  // Alterado para receber empresaId
  recuperarPorUuid(id: string, empresaId: string): Promise<Formulario | null>;
  
  deletar(id: string, empresaId: string): Promise<void>; // também pode ser alterado
  existe(id: string, empresaId: string): Promise<boolean>; // idem
}
