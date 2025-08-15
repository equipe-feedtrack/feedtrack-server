import { StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";

export interface AtualizarClienteInputDTO {
  id: string;
  nome?: string;
  email?: string | null;
  telefone?: string;
  cidade?: string | null;
  status?: StatusCliente;
  empresaId?: string;
}