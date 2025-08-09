"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCampanhaUseCase = void 0;
const campanha_entity_1 = require("@modules/campanha/domain/campanha.entity");
const campanha_map_1 = require("@modules/campanha/infra/mappers/campanha.map");
class CriarCampanhaUseCase {
    constructor(campanhaRepository, formularioRepository) {
        this._campanhaRepository = campanhaRepository;
        this._formularioRepository = formularioRepository;
    }
    async execute(input) {
        // 1. Validar se o formulário associado existe
        const formularioExiste = await this._formularioRepository.existe(input.formularioId);
        if (!formularioExiste) {
            throw new Error(`Formulário com ID ${input.formularioId} não encontrado.`);
        }
        // 2. Criar a entidade de domínio Campanha
        const campanha = campanha_entity_1.Campanha.criar(input);
        // 3. Persistir a nova entidade
        await this._campanhaRepository.inserir(campanha);
        // 4. Retornar o DTO de resposta
        return campanha_map_1.CampanhaMap.toResponseDTO(campanha);
    }
}
exports.CriarCampanhaUseCase = CriarCampanhaUseCase;
//# sourceMappingURL=criarCampanhaUseCase.js.map