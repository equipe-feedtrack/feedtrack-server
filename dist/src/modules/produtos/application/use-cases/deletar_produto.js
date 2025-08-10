"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarProdutoUseCase = void 0;
class DeletarProdutoUseCase {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    async execute(id) {
        const produto = await this.produtoRepository.recuperarPorUuid(id);
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
exports.DeletarProdutoUseCase = DeletarProdutoUseCase;
//# sourceMappingURL=deletar_produto.js.map