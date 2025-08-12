export interface CriarProdutoInputDTO {
  nome: string;
  descricao: string;
  valor: number;
  cliente_id: string; // Obrigatório ao criar um produto
}