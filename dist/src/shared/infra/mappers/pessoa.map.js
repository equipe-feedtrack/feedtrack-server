"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaMap = void 0;
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
class PessoaMap {
    /**
     * Converte um objeto de dados brutos (do Prisma, que contém os dados da Pessoa) para a entidade de domínio Pessoa.
     * @param raw Dados brutos (ex: ClientePrisma) que contêm as propriedades da Pessoa.
     * @returns Uma entidade Pessoa.
     */
    static toDomain(raw) {
        const pessoaProps = {
            nome: raw.nome,
            email: raw.email ?? null,
            telefone: raw.telefone ?? null,
        };
        return pessoa_entity_1.Pessoa.recuperar(pessoaProps); // Usa o método de recuperação da entidade Pessoa
    }
    /**
     * Converte a entidade de domínio Pessoa para um objeto de persistência (partes que vão para ClientePrisma).
     * @param pessoa A entidade Pessoa.
     * @returns Um objeto com as propriedades da Pessoa no formato do Prisma.
     */
    static toPersistence(pessoa) {
        return {
            nome: pessoa.nome,
            email: pessoa.email ?? null,
            telefone: pessoa.telefone ?? null,
            // Se Pessoa tivesse ID próprio e fosse uma relação, seria pessoaId: pessoa.id
        };
    }
    /**
     * Converte a entidade de domínio Pessoa para um DTO de resposta (ex: para ClienteResponseDTO).
     * @param pessoa A entidade Pessoa.
     * @returns Um DTO com as propriedades essenciais da Pessoa.
     */
    static toDTO(pessoa) {
        return {
            nome: pessoa.nome,
            email: pessoa.email,
            telefone: pessoa.telefone,
        };
    }
}
exports.PessoaMap = PessoaMap;
//# sourceMappingURL=pessoa.map.js.map