"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarProdutoPorIdUseCase = void 0;
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
class BuscarProdutoPorIdUseCase {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    async execute(id) {
        const produto = await this.produtoRepository.recuperarPorUuid(id);
        if (!produto) {
            return null;
        }
        return produto_map_1.ProdutoMap.toDTO(produto);
    }
}
exports.BuscarProdutoPorIdUseCase = BuscarProdutoPorIdUseCase;
//# sourceMappingURL=buscar_produto_por_id.js.map