"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarProdutoUseCase = void 0;
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
class AtualizarProdutoUseCase {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    async execute(input) {
        // 1. Recuperar a entidade existente
        const produto = await this.produtoRepository.recuperarPorUuid(input.id);
        if (!produto) {
            throw new Error(`Produto com ID ${input.id} não encontrado.`); // Exceção específica
        }
        // 2. Aplicar as atualizações (a entidade sabe como mudar seu estado)
        if (input.nome !== undefined) {
            produto.atualizarNome(input.nome); // Crie este método na entidade Produto
        }
        if (input.descricao !== undefined) {
            produto.atualizarDescricao(input.descricao); // Crie este método na entidade Produto
        }
        if (input.valor !== undefined) {
            produto.atualizarValor(input.valor); // Crie este método na entidade Produto
        }
        // 3. Persistir a entidade atualizada
        await this.produtoRepository.atualizar(produto);
        // 4. Retornar o DTO de resposta
        return produto_map_1.ProdutoMap.toDTO(produto);
    }
}
exports.AtualizarProdutoUseCase = AtualizarProdutoUseCase;
//# sourceMappingURL=atualizar_produto.js.map