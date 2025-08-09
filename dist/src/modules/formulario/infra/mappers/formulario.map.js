"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioMap = void 0;
const formulario_entity_1 = require("@modules/formulario/domain/formulario/formulario.entity");
const pergunta_map_1 = require("./pergunta.map");
class FormularioMap {
    /**
     * Converte o dado bruto do Prisma para a Entidade de Domínio Formulario.
     */
    static toDomain(raw) {
        // ✅ CORREÇÃO: Delega a responsabilidade de mapear cada pergunta ao PerguntaMap.
        // O código "desembrulha" a estrutura da tabela de junção.
        const perguntasDeDominio = (raw.perguntas ?? []).map(itemDaJuncao => pergunta_map_1.PerguntaMap.toDomain(itemDaJuncao.pergunta));
        // Mapeamento do Formulário, assumindo que no schema a coluna é 'titulo'
        return formulario_entity_1.Formulario.recuperar({
            id: raw.id,
            titulo: raw.titulo, // Assumindo que o campo no Prisma é 'titulo'
            descricao: raw.descricao,
            perguntas: perguntasDeDominio,
            ativo: raw.ativo,
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao ?? null,
        });
    }
    /**
     * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
     * A gestão da relação com perguntas (usando 'connect' ou 'set') é feita no repositório.
     */
    static toPersistence(formulario) {
        return {
            id: formulario.id,
            titulo: formulario.titulo, // Mapeando 'titulo' do domínio para 'titulo' do Prisma
            descricao: formulario.descricao ?? "",
            ativo: formulario.ativo,
            // O Prisma client lida com a conversão de nomes (camelCase para snake_case) se @map for usado no schema.
            dataCriacao: formulario.dataCriacao,
            dataAtualizacao: formulario.dataAtualizacao,
            dataExclusao: formulario.dataExclusao,
        };
    }
    /**
     * Converte a entidade Formulario para um DTO de resposta detalhado.
     */
    static toResponseDTO(formulario) {
        return {
            id: formulario.id,
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao.toISOString(),
            dataAtualizacao: formulario.dataAtualizacao.toISOString(),
            // Delega a conversão de cada Pergunta para o PerguntaMap
            perguntas: formulario.perguntas.map(pergunta => pergunta_map_1.PerguntaMap.toDTO(pergunta)),
        };
    }
    /**
     * Converte a entidade Formulario para um DTO de resposta resumido para listas.
     */
    static toListDTO(formulario) {
        return {
            id: formulario.id,
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao.toISOString(),
            perguntas: formulario.perguntas,
        };
    }
}
exports.FormularioMap = FormularioMap;
//# sourceMappingURL=formulario.map.js.map