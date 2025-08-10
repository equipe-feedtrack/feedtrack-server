"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampanhaMap = void 0;
const campanha_entity_1 = require("@modules/campanha/domain/campanha.entity");
class CampanhaMap {
    // Funções privadas para mapear enums de forma segura, evitando acoplamento frágil.
    static tipoToDomain(tipo) {
        return tipo; // Mapeamento direto se os nomes forem idênticos
    }
    static tipoToPersistence(tipo) {
        return tipo;
    }
    static segmentoToDomain(segmento) {
        return segmento;
    }
    static segmentoToPersistence(segmento) {
        return segmento;
    }
    /**
     * Converte o dado bruto do Prisma para a Entidade de Domínio Campanha.
     */
    static toDomain(raw) {
        const campanhaProps = {
            id: raw.id,
            titulo: raw.titulo,
            descricao: raw.descricao ?? undefined,
            tipoCampanha: this.tipoToDomain(raw.tipoCampanha),
            segmentoAlvo: this.segmentoToDomain(raw.segmentoAlvo),
            dataInicio: raw.dataInicio,
            dataFim: raw.dataFim,
            templateMensagem: raw.templateMensagem,
            formularioId: raw.formularioId,
            canalEnvio: raw.canalEnvio,
            ativo: raw.ativo,
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao,
        };
        return campanha_entity_1.Campanha.recuperar(campanhaProps);
    }
    /**
     * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
     */
    static toPersistence(campanha) {
        return {
            id: campanha.id,
            titulo: campanha.titulo,
            descricao: campanha.descricao,
            tipoCampanha: this.tipoToPersistence(campanha.tipoCampanha),
            segmentoAlvo: this.segmentoToPersistence(campanha.segmentoAlvo),
            dataInicio: campanha.dataInicio,
            dataFim: campanha.dataFim,
            templateMensagem: campanha.templateMensagem,
            canalEnvio: campanha.canalEnvio,
            ativo: campanha.ativo,
            dataCriacao: campanha.dataCriacao,
            dataAtualizacao: campanha.dataAtualizacao,
            dataExclusao: campanha.dataExclusao,
            // A conexão com o formulário é feita através do ID
            formulario: {
                connect: { id: campanha.formularioId },
            },
        };
    }
    /**
     * Converte a entidade Campanha para um DTO de resposta da API.
     */
    static toResponseDTO(campanha) {
        return {
            id: campanha.id,
            titulo: campanha.titulo,
            descricao: campanha.descricao,
            tipoCampanha: campanha.tipoCampanha,
            segmentoAlvo: campanha.segmentoAlvo,
            dataInicio: new Date(campanha.dataInicio).toISOString(),
            dataFim: campanha.dataFim ? new Date(campanha.dataFim).toISOString() : null,
            templateMensagem: campanha.templateMensagem,
            formularioId: campanha.formularioId,
            canalEnvio: campanha.canalEnvio,
            ativo: campanha.ativo,
            dataCriacao: new Date(campanha.dataCriacao).toISOString(),
            dataAtualizacao: new Date(campanha.dataAtualizacao).toISOString(),
        };
    }
}
exports.CampanhaMap = CampanhaMap;
//# sourceMappingURL=campanha.map.js.map