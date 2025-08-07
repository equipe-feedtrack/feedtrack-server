export type GerenciarProdutosAction = 'adicionar' | 'remover' | 'editar';

export interface GerenciarProdutosInput {
  clienteId: string;
  action: GerenciarProdutosAction;
  produtoId: string;
  novoProdutoId?: string;
}