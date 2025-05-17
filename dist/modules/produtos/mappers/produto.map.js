"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoMap = void 0;
const produto_entity_1 = require("modules/produtos/produto.entity");
class ProdutoMap {
    static toDTO(produto) {
        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            estoque: produto.estoque,
            dataCriacao: produto.dataCriacao,
            dataAtualizacao: produto.dataAtualizacao,
            dataExclusao: produto.dataExclusao,
            status: produto.status
        };
    }
    static toDomain(produto) {
        return produto_entity_1.Produto.recuperar(produto);
    }
}
exports.ProdutoMap = ProdutoMap;
//# sourceMappingURL=produto.map.js.map