import { IProdutoRepository } from "@modules/produtos/infra/produto.repository.interface";

export class DeletarProdutoUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: string, empresaId: string): Promise<void> {
    const produto = await this.produtoRepository.recuperarPorUuid(id, empresaId);
    if (!produto) {
      throw new Error(`Produto com ID ${id} não encontrado.`); // Exceção específica
    }

    // Realiza exclusão lógica na entidade
    produto.inativar(); // Reutiliza o método de inativação (ou você pode ter um 'deletarLogicamente()'
    
    // Persiste a mudança
    await this.produtoRepository.atualizar(produto);

    // Opcional: Se a exclusão fosse física:
    // await this.produtoRepository.deletar(id);
  }
}