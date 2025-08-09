"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaMap = void 0;
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/pergunta.entity");
const client_1 = require("@prisma/client");
// Usaremos a interface de Props da entidade
class PerguntaMap {
    /**
     * Converte uma entidade de domínio Pergunta para um DTO (Data Transfer Object).
     * O DTO é um objeto simples para ser usado pela camada de apresentação (ex: API).
     */
    static toDTO(pergunta) {
        // 2. O tipo de retorno agora é PerguntaResponseDTO
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            ativo: pergunta.ativo,
            // 3. Converte 'null' em 'undefined' para respeitar o DTO
            opcoes: pergunta.opcoes ?? undefined,
            // 4. Converte as datas para o formato string ISO 8601
            dataCriacao: pergunta.dataCriacao.toISOString(),
            dataAtualizacao: pergunta.dataAtualizacao.toISOString(),
            // O campo dataExclusao não faz parte do DTO de resposta, então é omitido.
        };
    }
    /**
     * Converte dados crus do Prisma para uma entidade de domínio Pergunta.
     * Usado para "hidratar" a entidade após uma consulta ao banco.
     */
    static toDomain(raw) {
        const tipoPergunta = raw.tipo;
        let opcoesTratadas;
        if (tipoPergunta === 'nota') {
            // Se for uma pergunta tipo 'nota':
            // Se raw.opcoes for null/undefined/vazio do banco, aplique o padrão.
            if (!raw.opcoes || (Array.isArray(raw.opcoes) && raw.opcoes.length === 0)) {
                opcoesTratadas = ['1', '2', '3', '4', '5'];
            }
            else {
                // Se houver opções customizadas para 'nota', use-as (garantindo que são strings)
                opcoesTratadas = Array.isArray(raw.opcoes) ? raw.opcoes.map(String) : undefined;
            }
        }
        else if (tipoPergunta === 'texto') {
            // Perguntas tipo 'texto' nunca devem ter opções.
            opcoesTratadas = undefined;
        }
        else {
            // Para 'multipla_escolha' e outros tipos, use o que veio do banco.
            opcoesTratadas = Array.isArray(raw.opcoes) ? raw.opcoes.map(String) : undefined;
        }
        const propsParaEntidade = {
            id: raw.id,
            texto: raw.texto,
            tipo: tipoPergunta,
            opcoes: opcoesTratadas, // Passa as opções já tratadas
            ativo: raw.ativo,
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao,
        };
        // A entidade Pergunta.recuperar apenas "hidrata" com os dados já preparados.
        return pergunta_entity_1.Pergunta.recuperar(propsParaEntidade);
    }
    static toPersistence(pergunta) {
        // Aqui fazemos a "tradução" de camelCase (domínio) para snake_case (banco).
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes ?? client_1.Prisma.JsonNull,
            ativo: pergunta.ativo,
            dataCriacao: pergunta.dataCriacao,
            dataAtualizacao: pergunta.dataAtualizacao,
            dataExclusao: pergunta.dataExclusao,
        };
    }
}
exports.PerguntaMap = PerguntaMap;
//# sourceMappingURL=pergunta.map.js.map