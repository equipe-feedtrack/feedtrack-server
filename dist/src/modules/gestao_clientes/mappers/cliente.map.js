"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteMap = void 0;
const produto_map_1 = require("@modules/produtos/mappers/produto.map");
class ClienteMap {
    static toDTO(cliente) {
        return {
            id: cliente.id,
            pessoa: cliente.pessoa,
            cidade: cliente.cidade,
            // dataCadastro: cliente.dataCadastro, //Ajustar 
            // ativo: cliente.ativo, //Ajustar
            vendedorResponsavel: cliente.vendedorResponsavel,
            produtos: cliente.produtos.map((produto) => { return produto_map_1.ProdutoMap.toDTO(produto); }),
        };
    }
}
exports.ClienteMap = ClienteMap;
//# sourceMappingURL=cliente.map.js.map