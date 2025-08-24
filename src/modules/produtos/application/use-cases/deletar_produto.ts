import { IProdutoRepository } from "@modules/produtos/infra/produto.repository.interface";

export class DeletarProdutoUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: string, empresaId: string): Promise<void> {
    // Tenta recuperar o produto para validar se existe e pertence à empresa
    const produto = await this.produtoRepository.recuperarPorUuid(id, empresaId);
    if (!produto) {
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }

    // Exclusão física
    await this.produtoRepository.deletar(id);
  }
}
