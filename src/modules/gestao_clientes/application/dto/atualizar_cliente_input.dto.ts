import { StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";

/**
 * DTO para os dados de entrada do Caso de Uso AtualizarCliente.
 * Permite atualização parcial das propriedades do cliente.
 */
export interface AtualizarClienteInputDTO {
  id: string; // ID do cliente a ser atualizado
  // Propriedades da Pessoa podem ser atualizadas diretamente
  pessoa?: {
    nome?: string;
    email?: string;
    telefone?: string;
  };
  cidade?: string;
  vendedorResponsavel?: string;
  status?: StatusCliente;
  // `produtos` deve ser atualizado via um caso de uso específico (ex: `AssociarProdutosAoCliente`)
}