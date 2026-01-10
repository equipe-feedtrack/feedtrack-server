export interface AtualizarProdutoInputDTO {
  id: string; // ID do produto a ser atualizado
  nome?: string;
  descricao?: string;
  valor?: number;
  ativo?: boolean;
  empresaId: string;

  // cliente_id não deve ser atualizado diretamente via DTO de produto,
  // pois implica em mudança de vínculo, que deve ter um caso de uso específico.
}