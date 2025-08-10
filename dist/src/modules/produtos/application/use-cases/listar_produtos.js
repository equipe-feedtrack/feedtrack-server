"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarProdutosUseCase = void 0;
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
class ListarProdutosUseCase {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    async execute(filtros) {
        // Você precisará adicionar um método `listar` ao seu IProdutoRepository
        // e implementá-lo em ProdutoRepositoryPrisma.
        const produtos = await this.produtoRepository.listar(filtros);
        return produtos.map(produto_map_1.ProdutoMap.toDTO);
    }
}
exports.ListarProdutosUseCase = ListarProdutosUseCase;
//# sourceMappingURL=listar_produtos.js.map