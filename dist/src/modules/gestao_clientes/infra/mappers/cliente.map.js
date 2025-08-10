"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteMap = void 0;
const cliente_entity_1 = require("@modules/gestao_clientes/domain/cliente.entity");
const cliente_types_1 = require("@modules/gestao_clientes/domain/cliente.types");
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
const client_1 = require("@prisma/client");
const pessoa_map_1 = require("@shared/infra/mappers/pessoa.map");
class ClienteMap {
    static statusToDomain(status) {
        switch (status) {
            case client_1.StatusUsuario.ATIVO: return cliente_types_1.StatusCliente.ATIVO;
            case client_1.StatusUsuario.INATIVO: return cliente_types_1.StatusCliente.INATIVO;
            default: throw new Error(`Status de usuário desconhecido: ${status}`);
        }
    }
    static statusToPersistence(status) {
        switch (status) {
            case cliente_types_1.StatusCliente.ATIVO: return client_1.StatusUsuario.ATIVO;
            case cliente_types_1.StatusCliente.INATIVO: return client_1.StatusUsuario.INATIVO;
            default: throw new Error(`Status de cliente desconhecido: ${status}`);
        }
    }
    /**
     * Converte um objeto de dados do Prisma (com relação N-N aninhada) para a entidade de domínio Cliente.
     */
    static toDomain(raw) {
        const pessoaDomain = pessoa_map_1.PessoaMap.toDomain(raw);
        // ✅ CORREÇÃO: Mapeia a estrutura aninhada para extrair apenas os produtos.
        const produtosDeDominio = (raw.produtos ?? []).map(itemDaJuncao => produto_map_1.ProdutoMap.toDomain(itemDaJuncao.produto));
        const clienteProps = {
            id: raw.id,
            pessoa: pessoaDomain,
            cidade: raw.cidade ?? null,
            vendedorResponsavel: raw.vendedorResponsavel,
            status: this.statusToDomain(raw.status),
            produtos: produtosDeDominio, // Usa a lista de produtos desembrulhada
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao ?? null,
        };
        return cliente_entity_1.Cliente.recuperar(clienteProps);
    }
    /**
     * Converte a entidade de domínio Cliente para um objeto de persistência do Prisma.
     * Nota: A relação com produtos não é tratada aqui, mas sim no repositório.
     */
    static toPersistence(cliente) {
        return {
            id: cliente.id,
            nome: cliente.pessoa.nome,
            email: cliente.pessoa.email ?? null,
            telefone: cliente.pessoa.telefone ?? '',
            cidade: cliente.cidade ?? '',
            vendedorResponsavel: cliente.vendedorResponsavel,
            status: this.statusToPersistence(cliente.status ?? cliente_types_1.StatusCliente.ATIVO),
            dataCriacao: cliente.dataCriacao,
            dataAtualizacao: cliente.dataAtualizacao,
            dataExclusao: cliente.dataExclusao,
        };
    }
    /**
     * Converte a entidade de domínio Cliente para um DTO de resposta da API.
     */
    static toResponseDTO(cliente) {
        const pessoaDTO = pessoa_map_1.PessoaMap.toDTO(cliente.pessoa);
        return {
            id: cliente.id,
            pessoa: pessoaDTO,
            cidade: cliente.cidade ?? null,
            vendedorResponsavel: cliente.vendedorResponsavel,
            status: cliente.status,
            produtos: cliente.produtos.map(produto => produto_map_1.ProdutoMap.toDTO(produto)),
            dataCriacao: cliente.dataCriacao.toISOString(),
            dataAtualizacao: cliente.dataAtualizacao.toISOString(),
            dataExclusao: cliente.dataExclusao ? cliente.dataExclusao.toISOString() : null,
        };
    }
}
exports.ClienteMap = ClienteMap;
//# sourceMappingURL=cliente.map.js.map