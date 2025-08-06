import { StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";

export interface AtualizarClienteInputDTO {
  id: string; // O ID do cliente a ser atualizado é obrigatório.
  pessoa?: {
    nome?: string;
    email?: string | null;
    telefone?: string;
  };
  cidade: string ;
  vendedorResponsavel: string;
  status?: StatusCliente;
  idsProdutosParaAdicionar?: string[];
  idsProdutosParaRemover?: string[];
}