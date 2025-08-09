"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampanhaRepositoryPrisma = void 0;
const campanha_map_1 = require("../mappers/campanha.map");
class CampanhaRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async inserir(campanha) {
        const dadosParaPersistencia = campanha_map_1.CampanhaMap.toPersistence(campanha);
        await this.prisma.campanha.create({
            data: dadosParaPersistencia,
        });
    }
    async atualizar(campanha) {
        const dadosParaPersistencia = campanha_map_1.CampanhaMap.toPersistence(campanha);
        // Removemos a relação do objeto principal para o Prisma lidar com ela separadamente
        const { formulario, ...dadosEscalares } = dadosParaPersistencia;
        await this.prisma.campanha.update({
            where: { id: campanha.id },
            data: {
                ...dadosEscalares, // Atualiza campos como titulo, descricao, etc.
                formulario: {
                    connect: { id: campanha.formularioId },
                },
            },
        });
    }
    async recuperarPorUuid(id) {
        const campanhaPrisma = await this.prisma.campanha.findUnique({
            where: { id },
        });
        if (!campanhaPrisma)
            return null;
        return campanha_map_1.CampanhaMap.toDomain(campanhaPrisma);
    }
    async listar() {
        const campanhasPrisma = await this.prisma.campanha.findMany({
            orderBy: { dataCriacao: 'desc' }
        });
        return campanhasPrisma.map(campanha => campanha_map_1.CampanhaMap.toDomain(campanha));
    }
    async deletar(id) {
        await this.prisma.campanha.delete({
            where: { id },
        });
    }
    async existe(id) {
        const count = await this.prisma.campanha.count({
            where: { id },
        });
        return count > 0;
    }
}
exports.CampanhaRepositoryPrisma = CampanhaRepositoryPrisma;
//# sourceMappingURL=campanha.repository.prisma.js.map