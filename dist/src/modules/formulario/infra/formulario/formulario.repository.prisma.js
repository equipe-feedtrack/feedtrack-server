"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioRepositoryPrisma = void 0;
const formulario_map_1 = require("../mappers/formulario.map");
class FormularioRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async inserir(formulario) {
        const dadosFormulario = formulario_map_1.FormularioMap.toPersistence(formulario);
        await this.prisma.formulario.create({
            data: {
                ...dadosFormulario,
                perguntas: {
                    create: formulario.perguntas.map((p, index) => ({
                        ordemNaLista: index, // Fornece o valor para o campo obrigatório.
                        pergunta: {
                            connect: { id: p.id },
                        },
                    })),
                },
            },
        });
    }
    recuperarTodos() {
        throw new Error("Method not implemented.");
    }
    async recuperarPorUuid(id) {
        const formularioDb = await this.prisma.formulario.findUnique({
            where: { id },
            // ✅ CORREÇÃO: Para uma relação N-N explícita, o include precisa ser aninhado
            // para buscar os dados da Pergunta através da tabela de junção.
            include: {
                perguntas: {
                    include: {
                        pergunta: true,
                    },
                },
            },
        });
        if (!formularioDb)
            return null;
        // O Mapper lida com a conversão da estrutura aninhada para o domínio.
        return formulario_map_1.FormularioMap.toDomain(formularioDb);
    }
    async listar(filtros) {
        const formulariosDb = await this.prisma.formulario.findMany({
            where: {
                ativo: filtros?.ativo,
            },
            include: {
                perguntas: {
                    include: {
                        pergunta: true,
                    },
                },
            },
        });
        return formulariosDb.map(form => formulario_map_1.FormularioMap.toDomain(form));
    }
    async atualizar(formulario) {
        const dadosFormulario = formulario_map_1.FormularioMap.toPersistence(formulario);
        const { id, ...dadosEscalares } = dadosFormulario;
        await this.prisma.formulario.update({
            where: { id: formulario.id },
            data: {
                ...dadosEscalares,
                perguntas: {
                    deleteMany: {},
                    create: formulario.perguntas.map((p, index) => ({
                        ordemNaLista: index,
                        pergunta: {
                            connect: { id: p.id }
                        }
                    }))
                }
            }
        });
    }
    async existe(id) {
        const count = await this.prisma.formulario.count({
            where: { id },
        });
        return count > 0;
    }
    async deletar(id) {
        // Garante que as entradas na tabela de junção sejam deletadas primeiro.
        await this.prisma.perguntasOnFormularios.deleteMany({
            where: { formularioId: id }
        });
        await this.prisma.formulario.delete({
            where: { id },
        });
    }
}
exports.FormularioRepositoryPrisma = FormularioRepositoryPrisma;
//# sourceMappingURL=formulario.repository.prisma.js.map