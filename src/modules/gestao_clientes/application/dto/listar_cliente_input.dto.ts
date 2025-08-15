import { SegmentoAlvo } from "@modules/campanha/domain/campanha.types";
import { StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";

// DTO para os filtros de entrada. Todas as propriedades são opcionais.
export interface ListarClientesInputDTO {
  status?: StatusCliente;
  segmentoAlvo?: SegmentoAlvo;
  empresaId?: string;

  // Outros filtros como nome, cidade, etc., podem ser adicionados aqui.
}