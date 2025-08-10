"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoMap = void 0;
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
class ProdutoMap {
    static toDomain(produto) {
        const produtoProps = {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            dataCriacao: produto.dataCriacao,
            dataAtualizacao: produto.dataAtualizacao,
            dataExclusao: produto.dataExclusao ?? null,
            ativo: produto.ativo,
        };
        return produto_entity_1.Produto.recuperar(produtoProps);
    }
    /**
     * Converte a entidade de domínio Produto para um objeto de persistência do Prisma.
     * Usado ao salvar/atualizar dados no banco.
     */
    static toPersistence(produto) {
        // Mapeia o status do domínio para o enum do Prisma (se nomes forem diferentes, ou se Prisma só aceitar strings)
        // Se StatusProduto e Status_produtos (do Prisma) tiverem os mesmos valores, um casting direto é comum.
        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            ativo: produto.ativo,
            data_criacao: produto.dataCriacao,
            data_atualizacao: produto.dataAtualizacao,
            data_exclusao: produto.dataExclusao ?? null, // undefined na entidade -> null no DB
        };
    }
    static toDTO(produto) {
        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            dataCriacao: produto.dataCriacao.toISOString(), // Converte Date para string ISO
            dataAtualizacao: produto.dataAtualizacao.toISOString(), // Converte Date para string ISO
            dataExclusao: produto.dataExclusao ? produto.dataExclusao.toISOString() : undefined, // Trata null/undefined
            ativo: produto.ativo,
        };
    }
}
exports.ProdutoMap = ProdutoMap;
//# sourceMappingURL=produto.map.js.map