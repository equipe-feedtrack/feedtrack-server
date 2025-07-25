"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaRepositoryPrisma = void 0;
const pergunta_map_1 = require("../../mappers/pergunta.map");
class PerguntaRepositoryPrisma {
    // Recebemos o prisma via injeção de dependência, o que é ótimo.
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recuperarPorUuid(id) {
        const perguntaPrisma = await this.prisma.pergunta.findUnique({
            where: { id },
        });
        if (!perguntaPrisma)
            return null;
        // Apenas chamamos o Mapper. Ele faz todo o trabalho de tradução.
        return pergunta_map_1.PerguntaMap.toDomain(perguntaPrisma);
    }
    async inserir(pergunta) {
        const dadosParaPersistencia = pergunta_map_1.PerguntaMap.toPersistence(pergunta);
        await this.prisma.pergunta.upsert({
            where: { id: pergunta.id },
            // Para o 'update', omitimos 'opcoes' se for null para evitar erros.
            update: {
                texto: dadosParaPersistencia.texto,
                tipo: dadosParaPersistencia.tipo,
                opcoes: dadosParaPersistencia.opcoes ?? undefined, // Omitir se for null
                data_atualizacao: dadosParaPersistencia.data_atualizacao,
                data_exclusao: dadosParaPersistencia.data_exclusao,
            },
            // Para o 'create', garantimos que todos os campos obrigatórios estejam presentes e com os tipos corretos.
            create: {
                id: dadosParaPersistencia.id,
                texto: dadosParaPersistencia.texto,
                tipo: dadosParaPersistencia.tipo,
                opcoes: dadosParaPersistencia.opcoes ?? null, // 'null' é um valor JSON válido na criação
                data_criacao: dadosParaPersistencia.data_criacao ?? new Date(),
                data_atualizacao: dadosParaPersistencia.data_atualizacao ?? new Date(),
                data_exclusao: dadosParaPersistencia.data_exclusao,
            },
        });
    }
    async buscarMuitosPorId(ids) {
        const perguntasPrisma = await this.prisma.pergunta.findMany({
            where: {
                id: {
                    in: ids, // Usa o filtro 'in' para encontrar todos os IDs na lista
                },
            },
        });
        return perguntasPrisma.map(pergunta_map_1.PerguntaMap.toDomain);
    }
    recuperarTodos() {
        throw new Error("Method not implemented.");
    }
    existe(uuid) {
        throw new Error("Method not implemented.");
    }
    atualizar(uuid, entity) {
        throw new Error("Method not implemented.");
    }
    deletar(uuid) {
        throw new Error("Method not implemented.");
    }
}
exports.PerguntaRepositoryPrisma = PerguntaRepositoryPrisma;
//# sourceMappingURL=pergunta.repository.prisma.js.map