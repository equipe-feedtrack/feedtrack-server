"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioRepositoryPrisma = void 0;
const EnvioMap_1 = require("../mappers/EnvioMap");
/**
 * @description Repositório para a entidade Envio, utilizando o Prisma Client.
 * Ele traduz as operações do domínio para as operações do banco de dados.
 */
class EnvioRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    atualizar(envio) {
        throw new Error("Method not implemented.");
    }
    /**
     * Salva ou atualiza um registro de Envio.
     * @param envio A entidade de domínio Envio a ser salva.
     */
    async salvar(envio) {
        const dadosParaPersistencia = EnvioMap_1.EnvioMap.toPersistence(envio);
        await this.prisma.envioFormulario.upsert({
            where: { id: envio.id },
            create: dadosParaPersistencia,
            update: {
                status: envio.status,
                dataEnvio: envio.dataEnvio,
                tentativasEnvio: envio.tentativasEnvio,
                ultimaMensagemErro: envio.ultimaMensagemErro,
            },
        });
    }
    /**
     * Busca um registro de Envio pelo seu ID.
     *
     * @param id O ID do envio a ser buscado.
     * @returns A entidade de domínio Envio ou null se não for encontrado.
     */
    async buscarPorId(id) {
        const raw = await this.prisma.envioFormulario.findUnique({
            where: { id },
        });
        if (!raw) {
            return null;
        }
        return EnvioMap_1.EnvioMap.toDomain(raw);
    }
    /**
     * Busca todos os envios no banco de dados.
     *
     * @returns Uma lista de entidades de domínio Envio.
     */
    async buscarTodos() {
        const rawFeedbacks = await this.prisma.envioFormulario.findMany();
        if (!rawFeedbacks || rawFeedbacks.length === 0) {
            return [];
        }
        return rawFeedbacks.map(EnvioMap_1.EnvioMap.toDomain);
    }
    /**
     * Busca envios pendentes para um cliente específico.
     *
     * @param clienteId O ID do cliente.
     * @returns Uma lista de entidades de domínio Envio pendentes.
     */
    async buscarPendentesPorCliente(clienteId) {
        const rawEnvios = await this.prisma.envioFormulario.findMany({
            where: {
                clienteId,
                status: 'PENDENTE',
            },
        });
        return rawEnvios.map(EnvioMap_1.EnvioMap.toDomain);
    }
    /**
     * Busca envios pendentes para uma campanha específica.
     *
     * @param campanhaId O ID da campanha.
     * @returns Uma lista de entidades de domínio Envio pendentes.
     */
    async buscarPendentesPorCampanha(campanhaId) {
        const rawEnvios = await this.prisma.envioFormulario.findMany({
            where: {
                campanhaId,
                status: 'PENDENTE',
            },
        });
        return rawEnvios.map(EnvioMap_1.EnvioMap.toDomain);
    }
    /**
     * Salva múltiplas entidades de Envio em uma única transação.
     *
     * @param envios Uma lista de entidades de domínio Envio.
     */
    async salvarVarios(envios) {
        const operacoes = envios.map(envio => {
            const dadosParaPersistencia = EnvioMap_1.EnvioMap.toPersistence(envio);
            return this.prisma.envioFormulario.upsert({
                where: { id: envio.id },
                create: dadosParaPersistencia,
                update: {
                    status: envio.status,
                    dataEnvio: envio.dataEnvio,
                    tentativasEnvio: envio.tentativasEnvio,
                    ultimaMensagemErro: envio.ultimaMensagemErro,
                },
            });
        });
        await this.prisma.$transaction(operacoes);
    }
}
exports.EnvioRepositoryPrisma = EnvioRepositoryPrisma;
//# sourceMappingURL=EnvioRepositoryPrisma.js.map