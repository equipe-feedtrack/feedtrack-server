import { Venda } from "../domain/venda.entity";

export interface IVendaRepository {
  save(venda: Venda): Promise<Venda>;
  findById(id: string): Promise<Venda | null>;
  findAll(): Promise<Venda[]>;
}
