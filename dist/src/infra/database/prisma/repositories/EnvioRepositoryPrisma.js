"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioRepositoryPrisma = void 0;
const EnvioMap_1 = require("@modules/formulario/mappers/EnvioMap");
class EnvioRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async salvar(envio) {
        // 1. Usa o Mapper para converter a entidade de domínio para o formato do Prisma
        const dadosParaPersistencia = EnvioMap_1.EnvioMap.toPersistence(envio);
        // 2. Usa 'upsert' para criar ou atualizar o registro de forma atômica
        await this.prisma.envio_formulario.upsert({
            where: { id: envio.id },
            create: dadosParaPersistencia,
            update: dadosParaPersistencia,
        });
    }
    async buscarPorId(id) {
        // 1. Busca o registro no banco de dados
        const envioPrisma = await this.prisma.envio_formulario.findUnique({
            where: { id },
        });
        if (!envioPrisma)
            return null;
        // 2. Se encontrar, usa o Mapper para converter de volta para a entidade de domínio
        return EnvioMap_1.EnvioMap.toDomain(envioPrisma);
    }
}
exports.EnvioRepositoryPrisma = EnvioRepositoryPrisma;
//# sourceMappingURL=EnvioRepositoryPrisma.js.map