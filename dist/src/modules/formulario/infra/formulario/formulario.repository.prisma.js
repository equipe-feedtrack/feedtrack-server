"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioRepositoryPrisma = void 0;
const formulario_map_1 = require("../../mappers/formulario.map");
class FormularioRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recuperarPorUuid(id) {
        const formularioDb = await this.prisma.formulario.findUnique({
            where: { id },
            include: { perguntas: true }, // Sempre inclua as partes do agregado
        });
        if (!formularioDb)
            return null;
        // A complexidade da tradução fica 100% no Mapper
        return formulario_map_1.FormularioMap.toDomain(formularioDb);
    }
    async listar(filtros) {
        const formulariosDb = await this.prisma.formulario.findMany({
            where: {
                ativo: filtros?.ativo, // Filtro opcional por status
            },
            include: { perguntas: true },
        });
        return formulariosDb.map(formulario_map_1.FormularioMap.toDomain);
    }
    async inserir(formulario) {
        const dadosFormulario = formulario_map_1.FormularioMap.toPersistence(formulario);
        // 2. CORREÇÃO AQUI:
        // Usamos o PerguntaMap.toPersistence para converter cada entidade 'Pergunta'
        // para o formato de dados que o Prisma espera (com snake_case).
        const perguntasConnect = formulario.perguntas.map(p => ({ id: p.id }));
        await this.prisma.formulario.upsert({
            where: { id: formulario.id },
            create: {
                ...dadosFormulario,
                perguntas: {
                    // Ao criar, conecta o formulário às perguntas existentes pelos seus IDs
                    connect: perguntasConnect,
                },
            },
            update: {
                texto: dadosFormulario.texto,
                descricao: dadosFormulario.descricao,
                ativo: dadosFormulario.ativo,
                perguntas: {
                    // Ao atualizar, 'set' substitui a lista de conexões pela nova
                    set: perguntasConnect,
                },
            },
        });
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
exports.FormularioRepositoryPrisma = FormularioRepositoryPrisma;
//# sourceMappingURL=formulario.repository.prisma.js.map