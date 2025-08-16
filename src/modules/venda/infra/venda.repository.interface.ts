import { Venda } from '../domain/venda.entity';

export interface IVendaRepository {
  save(venda: Venda): Promise<Venda>;
  findById(id: string): Promise<Venda | null>;
  findAll(empresaId: string): Promise<Venda[]>; // agora recebe empresaId
  buscarNovasVendas(empresaId: string, produtoId: string): Promise<Venda[]>;
}
