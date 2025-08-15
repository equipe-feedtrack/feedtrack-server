import { Empresa } from "../domain/empresa.entity";

export interface IEmpresaRepository {
  save(empresa: Empresa): Promise<Empresa>;
  findById(id: string): Promise<Empresa | null>;
  findByCnpj(cnpj: string): Promise<Empresa | null>;
  findAll(): Promise<Empresa[]>;
}
