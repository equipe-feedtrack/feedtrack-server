"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaRepositoryPrisma = void 0;
const pergunta_map_1 = require("../mappers/pergunta.map");
/**
 * Repositório de Pergunta implementado com o Prisma.
 * É responsável por persistir e recuperar a entidade de domínio Pergunta.
 */
class PerguntaRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(filtros) {
        const perguntasPrisma = await this.prisma.pergunta.findMany({
            where: {
                ativo: filtros?.ativo, // Filtro opcional por status 'ativo'
            }
        });
        return perguntasPrisma.map(p => pergunta_map_1.PerguntaMap.toDomain(p));
    }
    async recuperarPorUuid(id) {
        const perguntaPrisma = await this.prisma.pergunta.findUnique({
            where: { id },
        });
        if (!perguntaPrisma)
            return null;
        // O Mapper converte o modelo de dados do Prisma para a entidade de domínio.
        return pergunta_map_1.PerguntaMap.toDomain(perguntaPrisma);
    }
    async buscarMuitosPorId(ids) {
        const filteredIds = ids.filter((id) => !!id); // filtra só strings válidas
        const perguntasPrisma = await this.prisma.pergunta.findMany({
            where: {
                id: {
                    in: filteredIds,
                },
            },
        });
        return perguntasPrisma.map(p => pergunta_map_1.PerguntaMap.toDomain(p));
    }
    async inserir(pergunta) {
        const dadosParaPersistencia = pergunta_map_1.PerguntaMap.toPersistence(pergunta);
        await this.prisma.pergunta.create({
            data: dadosParaPersistencia,
        });
    }
    async atualizar(pergunta) {
        const dadosParaPersistencia = pergunta_map_1.PerguntaMap.toPersistence(pergunta);
        await this.prisma.pergunta.update({
            where: { id: pergunta.id },
            data: dadosParaPersistencia,
        });
    }
    async existe(id) {
        const count = await this.prisma.pergunta.count({
            where: { id },
        });
        return count > 0;
    }
    async deletar(id) {
        // Antes de deletar a pergunta, removemos todas as suas associações
        // na tabela de junção para evitar erros de restrição de chave estrangeira.
        await this.prisma.perguntasOnFormularios.deleteMany({
            where: { perguntaId: id },
        });
        // Agora podemos deletar a pergunta com segurança.
        await this.prisma.pergunta.delete({
            where: { id },
        });
    }
}
exports.PerguntaRepositoryPrisma = PerguntaRepositoryPrisma;
//# sourceMappingURL=pergunta.repository.prisma.js.map