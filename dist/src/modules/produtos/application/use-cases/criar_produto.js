"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarProdutoUseCase = void 0;
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
class CriarProdutoUseCase {
    constructor(produtoRepository, clienteRepository) {
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
    }
    async execute(input) {
        // 2. Cria a entidade Produto
        const produto = produto_entity_1.Produto.criarProduto({
            nome: input.nome,
            descricao: input.descricao,
            valor: input.valor,
        });
        // 3. Persiste o Produto (e conecta ao Cliente)
        await this.produtoRepository.inserir(produto);
        // 4. Retorna o DTO de resposta
        return produto_map_1.ProdutoMap.toDTO(produto);
    }
}
exports.CriarProdutoUseCase = CriarProdutoUseCase;
//# sourceMappingURL=criar_produto.js.map