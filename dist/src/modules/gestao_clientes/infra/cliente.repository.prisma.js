"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepositoryPrisma = void 0;
const client_1 = require("@prisma/client");
const prisma_repository_1 = require("@shared/infra/prisma.repository");
const cliente_map_1 = require("./mappers/cliente.map");
class ClienteRepositoryPrisma extends prisma_repository_1.PrismaRepository {
    constructor(prismaClient) {
        super(prismaClient);
    }
    // ... métodos inserir e atualizar ...
    async inserir(cliente) {
        const dadosParaPersistencia = cliente_map_1.ClienteMap.toPersistence(cliente);
        await this._datasource.cliente.create({
            data: {
                ...dadosParaPersistencia,
                produtos: {
                    create: cliente.produtos.map(p => ({
                        produto: {
                            connect: { id: p.id }
                        }
                    }))
                }
            },
        });
    }
    async recuperarPorUuid(id) {
        const clientePrisma = await this._datasource.cliente.findUnique({
            where: { id },
            include: {
                produtos: {
                    include: {
                        produto: true
                    }
                }
            },
        });
        if (!clientePrisma)
            return null;
        // ✅ CORREÇÃO: Usando a função anônima para manter o contexto do 'this'
        return cliente_map_1.ClienteMap.toDomain(clientePrisma);
    }
    async atualizar(cliente) {
        const dadosParaPersistencia = cliente_map_1.ClienteMap.toPersistence(cliente);
        const { id, ...dadosEscalares } = dadosParaPersistencia;
        await this._datasource.cliente.update({
            where: { id: cliente.id },
            data: {
                ...dadosEscalares,
                produtos: {
                    deleteMany: {},
                    create: cliente.produtos.map(p => ({
                        produto: {
                            connect: { id: p.id }
                        }
                    }))
                }
            },
        });
    }
    async buscarPorSegmento(segmento) {
        const whereClause = {};
        // ... sua lógica de switch para os filtros ...
        switch (segmento) {
            case client_1.SegmentoAlvo.TODOS_CLIENTES:
                break;
            case client_1.SegmentoAlvo.NOVOS_CLIENTES:
                const trintaDiasAtras = new Date();
                trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
                whereClause.dataCriacao = { gte: trintaDiasAtras };
                whereClause.status = client_1.StatusUsuario.ATIVO;
                break;
            case client_1.SegmentoAlvo.CLIENTES_REGULARES:
                const dataLimiteRegulares = new Date();
                dataLimiteRegulares.setDate(dataLimiteRegulares.getDate() - 30);
                whereClause.dataCriacao = { lt: dataLimiteRegulares };
                whereClause.status = client_1.StatusUsuario.ATIVO;
                break;
            case client_1.SegmentoAlvo.CLIENTES_PREMIUM:
                whereClause.status = client_1.StatusUsuario.ATIVO;
                break;
            default:
                whereClause.status = client_1.StatusUsuario.ATIVO;
                break;
        }
        const clientesPrisma = await this._datasource.cliente.findMany({
            where: whereClause,
            include: {
                produtos: {
                    include: {
                        produto: true
                    }
                }
            },
        });
        // ✅ CORREÇÃO: Usando a função anônima para manter o contexto do 'this'
        return clientesPrisma.map(cliente => cliente_map_1.ClienteMap.toDomain(cliente));
    }
    async existe(id) {
        const count = await this._datasource.cliente.count({
            where: { id },
        });
        return count > 0;
    }
    async listar(filtros) {
        const clientesPrisma = await this._datasource.cliente.findMany({
            where: filtros,
            include: {
                produtos: {
                    include: {
                        produto: true
                    }
                }
            },
        });
        // ✅ CORREÇÃO: Usando a função anônima para manter o contexto do 'this'
        return clientesPrisma.map(cliente => cliente_map_1.ClienteMap.toDomain(cliente));
    }
}
exports.ClienteRepositoryPrisma = ClienteRepositoryPrisma;
//# sourceMappingURL=cliente.repository.prisma.js.map