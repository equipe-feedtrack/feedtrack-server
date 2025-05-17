"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaMap = void 0;
const pergunta_entity_1 = require("../domain/pergunta/pergunta.entity");
class PerguntaMap {
    static toDTO(pergunta) {
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes,
            ordem: pergunta.ordem
        };
    }
    static toDomain(categoria) {
        return pergunta_entity_1.Pergunta.recuperar(categoria);
    }
}
exports.PerguntaMap = PerguntaMap;
//# sourceMappingURL=pergunta.map.js.map