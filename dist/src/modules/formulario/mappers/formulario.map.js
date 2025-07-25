"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioMap = void 0;
const formulario_entity_1 = require("../domain/formulario/formulario.entity");
const pergunta_entity_1 = require("../domain/pergunta/domain/pergunta.entity");
const pergunta_map_1 = require("./pergunta.map");
class FormularioMap {
    /**
     * Converte o dado bruto do Prisma para a Entidade de Domínio.
     */
    static toDomain(raw) {
        const perguntas = raw.perguntas.map((p_prisma) => pergunta_entity_1.Pergunta.recuperar({
            id: p_prisma.id,
            texto: p_prisma.texto,
            tipo: p_prisma.tipo,
            opcoes: Array.isArray(p_prisma.opcoes) ? p_prisma.opcoes.map(String) : undefined,
            dataCriacao: p_prisma.data_criacao,
            dataAtualizacao: p_prisma.data_atualizacao,
            dataExclusao: p_prisma.data_exclusao,
        }));
        // 2. Mapeamento do Formulário
        return formulario_entity_1.Formulario.recuperar({
            id: raw.id,
            titulo: raw.texto,
            descricao: raw.descricao,
            perguntas: perguntas,
            ativo: raw.ativo,
            dataCriacao: raw.data_criacao,
            dataAtualizacao: raw.data_atualizacao,
            dataExclusao: raw.data_exclusao ?? null,
        });
    }
    /**
     * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
     */
    static toPersistence(formulario) {
        // CORREÇÃO: Garantimos que o dado enviado ao Prisma corresponde ao schema.
        // Se o seu Prisma espera 'texto' para o título, usamos 'texto'.
        return {
            id: formulario.id,
            texto: formulario.titulo, // Mapeando 'titulo' do domínio para 'texto' do Prisma
            descricao: formulario.descricao ?? " ",
            ativo: formulario.ativo,
            data_criacao: formulario.dataCriacao,
            data_atualizacao: formulario.dataAtualizacao,
            data_exclusao: formulario.dataExclusao,
        };
    }
    static toResponseDTO(formulario) {
        return {
            id: formulario.id,
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao.toISOString(),
            dataAtualizacao: formulario.dataAtualizacao.toISOString(),
            // Mapeia cada entidade Pergunta para seu respectivo DTO
            perguntas: formulario.perguntas.map(pergunta => pergunta_map_1.PerguntaMap.toDTO(pergunta)),
        };
    }
    static toListDTO(formulario) {
        return {
            id: formulario.id,
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao.toISOString(),
            // Calcula a quantidade de perguntas sem expor os detalhes de cada uma
            quantidadePerguntas: formulario.perguntas.length,
        };
    }
}
exports.FormularioMap = FormularioMap;
//# sourceMappingURL=formulario.map.js.map