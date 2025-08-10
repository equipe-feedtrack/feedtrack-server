"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoRepositoryPrisma = void 0;
const prisma_repository_1 = require("@shared/infra/prisma.repository");
const produto_map_1 = require("./mappers/produto.map");
class ProdutoRepositoryPrisma extends prisma_repository_1.PrismaRepository {
    constructor(prisma) {
        super(prisma);
    }
    /**
     * Insere um novo Produto no banco de dados.
     */
    async inserir(produto) {
        const dadosParaPersistencia = produto_map_1.ProdutoMap.toPersistence(produto);
        await this._datasource.produto.create({
            data: {
                id: dadosParaPersistencia.id,
                nome: dadosParaPersistencia.nome,
                descricao: dadosParaPersistencia.descricao,
                valor: dadosParaPersistencia.valor,
                dataCriacao: dadosParaPersistencia.data_criacao,
                dataAtualizacao: dadosParaPersistencia.data_atualizacao,
                dataExclusao: dadosParaPersistencia.data_exclusao,
                ativo: dadosParaPersistencia.ativo,
            },
        });
    }
    /**
     * Recupera um Produto pelo seu ID único.
     */
    async recuperarPorUuid(id) {
        const produtoPrisma = await this._datasource.produto.findUnique({
            where: { id },
        });
        if (!produtoPrisma)
            return null;
        return produto_map_1.ProdutoMap.toDomain(produtoPrisma);
    }
    /**
     * Atualiza um Produto existente no banco de dados.
     */
    async atualizar(produto) {
        const dadosParaPersistencia = produto_map_1.ProdutoMap.toPersistence(produto);
        await this._datasource.produto.update({
            where: { id: produto.id },
            data: {
                nome: dadosParaPersistencia.nome,
                descricao: dadosParaPersistencia.descricao,
                valor: dadosParaPersistencia.valor,
                dataAtualizacao: dadosParaPersistencia.data_atualizacao,
                dataExclusao: dadosParaPersistencia.data_exclusao, // Pode ser null
                ativo: dadosParaPersistencia.ativo,
            },
        });
    }
    async listar(filtros) {
        const whereClause = {};
        if (filtros?.status) {
            whereClause.status = filtros.status; // Filtra por status
        }
        if (filtros?.ativo !== undefined) {
            whereClause.ativo = filtros.ativo; // Filtra por ativo
        }
        if (filtros?.cliente_id) {
            whereClause.cliente_id = filtros.cliente_id; // Filtra por cliente
        }
        // Adicione mais lógica de filtro aqui
        const produtosPrisma = await this._datasource.produto.findMany({
            where: whereClause,
        });
        return produtosPrisma.map(produto_map_1.ProdutoMap.toDomain);
    }
}
exports.ProdutoRepositoryPrisma = ProdutoRepositoryPrisma;
//# sourceMappingURL=produto.repository.prisma.js.map