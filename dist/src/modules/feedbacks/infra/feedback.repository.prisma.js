"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRepositoryPrisma = void 0;
const feedback_map_1 = require("./mappers/feedback.map");
class FeedbackRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Salva ou atualiza um registro de Feedback.
     * Usa o método 'upsert' do Prisma para lidar com ambos os cenários de forma atômica.
     *
     * @param feedback A entidade de domínio Feedback a ser salva.
     */
    async salvar(feedback) {
        const dadosParaPersistencia = feedback_map_1.FeedbackMap.toPersistence(feedback);
        await this.prisma.feedback.upsert({
            where: { id: feedback.id },
            create: dadosParaPersistencia,
            update: {
                // A entidade de Feedback tem poucos campos mutáveis.
                // Focamos naqueles que podem ser alterados, como a exclusão lógica.
                resposta: dadosParaPersistencia.resposta,
                dataExclusao: dadosParaPersistencia.dataExclusao,
            },
        });
    }
    /**
     * Busca um registro de Feedback pelo seu ID.
     *
     * @param id O ID do feedback a ser buscado.
     * @returns A entidade de domínio Feedback ou null se não for encontrado.
     */
    async recuperarPorUuid(id) {
        const raw = await this.prisma.feedback.findUnique({
            where: { id },
        });
        if (!raw) {
            return null;
        }
        return feedback_map_1.FeedbackMap.toDomain(raw);
    }
    /**
     * Realiza a exclusão lógica de um registro de Feedback.
     *
     * @param feedback A entidade de domínio Feedback a ser excluída.
     */
    async excluirLogicamente(feedback) {
        await this.prisma.feedback.update({
            where: { id: feedback.id },
            data: {
                dataExclusao: feedback.dataExclusao,
            },
        });
    }
    /**
     * Busca um Feedback pelo ID do EnvioFormulario associado.
     * No seu schema, a relação é 1:1, com a FK 'envioId' na tabela 'Feedback'.
     *
     * @param envioId O ID do envio associado ao feedback.
     * @returns A entidade de domínio Feedback ou null se não for encontrado.
     */
    async buscarPorEnvioId(envioId) {
        const raw = await this.prisma.feedback.findUnique({
            where: { envioId },
        });
        if (!raw) {
            return null;
        }
        return feedback_map_1.FeedbackMap.toDomain(raw);
    }
    async buscarTodos() {
        const rawFeedbacks = await this.prisma.feedback.findMany();
        if (!rawFeedbacks || rawFeedbacks.length === 0) {
            return [];
        }
        // Mapeia cada objeto do Prisma para uma entidade de domínio.
        return rawFeedbacks.map(feedback_map_1.FeedbackMap.toDomain);
    }
}
exports.FeedbackRepositoryPrisma = FeedbackRepositoryPrisma;
//# sourceMappingURL=feedback.repository.prisma.js.map