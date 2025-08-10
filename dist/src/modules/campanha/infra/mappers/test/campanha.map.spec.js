"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const campanha_entity_1 = require("@modules/campanha/domain/campanha.entity");
const client_1 = require("@prisma/client");
const campanha_types_1 = require("@modules/campanha/domain/campanha.types");
const campanha_map_1 = require("../campanha.map");
(0, vitest_1.describe)('CampanhaMap', () => {
    // =================================================================
    // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
    // =================================================================
    const dataFixaCriacao = new Date('2024-12-01T08:00:00.000Z');
    const dataFixaAtualizacao = new Date('2024-12-01T09:30:00.000Z');
    const dataFixaInicio = new Date('2025-01-01T10:00:00.000Z');
    const dataFixaFim = new Date('2025-01-31T23:59:59.000Z');
    const dataFixaExclusao = new Date('2025-03-05T10:00:00.000Z');
    // Instâncias da entidade Campanha
    const mockCampanhaDomain = campanha_entity_1.Campanha.recuperar({
        id: 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c',
        titulo: 'Campanha Teste Completa',
        descricao: 'Descrição do teste',
        tipoCampanha: campanha_types_1.TipoCampanha.POS_COMPRA,
        segmentoAlvo: campanha_types_1.SegmentoAlvo.NOVOS_CLIENTES,
        dataInicio: dataFixaInicio,
        dataFim: dataFixaFim,
        templateMensagem: 'Template de mensagem para clientes novos.',
        formularioId: 'form-uuid-01',
        canalEnvio: client_1.CanalEnvio.EMAIL,
        ativo: true,
        dataCriacao: dataFixaCriacao,
        dataAtualizacao: dataFixaAtualizacao,
        dataExclusao: null,
    });
    const mockCampanhaDomainSemOpcionais = campanha_entity_1.Campanha.recuperar({
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        titulo: 'Campanha Sem Opcionais',
        descricao: undefined,
        tipoCampanha: campanha_types_1.TipoCampanha.AUTOMATICO,
        segmentoAlvo: campanha_types_1.SegmentoAlvo.TODOS_CLIENTES,
        dataInicio: dataFixaInicio,
        dataFim: null,
        templateMensagem: 'Template simples.',
        formularioId: 'form-uuid-02',
        canalEnvio: client_1.CanalEnvio.EMAIL,
        ativo: true,
        dataCriacao: dataFixaCriacao,
        dataAtualizacao: dataFixaAtualizacao,
        dataExclusao: null,
    });
    const mockCampanhaDomainInativa = campanha_entity_1.Campanha.recuperar({
        id: 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5',
        titulo: 'Campanha Inativa',
        descricao: 'Campanha que foi desativada.',
        tipoCampanha: campanha_types_1.TipoCampanha.PROMOCIONAL,
        segmentoAlvo: campanha_types_1.SegmentoAlvo.CLIENTES_REGULARES,
        dataInicio: dataFixaInicio,
        dataFim: null,
        templateMensagem: 'Template de promoção.',
        formularioId: 'form-uuid-03',
        canalEnvio: client_1.CanalEnvio.EMAIL,
        ativo: false,
        dataCriacao: dataFixaCriacao,
        dataAtualizacao: dataFixaExclusao,
        dataExclusao: dataFixaExclusao,
    });
    // --- Testes para toDomain ---
    (0, vitest_1.describe)('toDomain', () => {
        (0, vitest_1.it)('deve converter dados crus do Prisma para uma entidade Campanha completa', () => {
            const rawPrisma = {
                id: mockCampanhaDomain.id,
                titulo: mockCampanhaDomain.titulo,
                descricao: mockCampanhaDomain.descricao,
                tipoCampanha: mockCampanhaDomain.tipoCampanha,
                segmentoAlvo: mockCampanhaDomain.segmentoAlvo,
                dataInicio: mockCampanhaDomain.dataInicio,
                dataFim: mockCampanhaDomain.dataFim,
                templateMensagem: mockCampanhaDomain.templateMensagem,
                formularioId: mockCampanhaDomain.formularioId,
                canalEnvio: mockCampanhaDomain.canalEnvio,
                ativo: mockCampanhaDomain.ativo,
                dataCriacao: mockCampanhaDomain.dataCriacao,
                dataAtualizacao: mockCampanhaDomain.dataAtualizacao,
                dataExclusao: mockCampanhaDomain.dataExclusao,
            };
            const campanha = campanha_map_1.CampanhaMap.toDomain(rawPrisma);
            (0, vitest_1.expect)(campanha).toBeInstanceOf(campanha_entity_1.Campanha);
            (0, vitest_1.expect)(campanha.id).toBe(mockCampanhaDomain.id);
            (0, vitest_1.expect)(campanha.titulo).toBe(mockCampanhaDomain.titulo);
        });
        (0, vitest_1.it)('deve converter campos null do Prisma para undefined/null na entidade', () => {
            const rawPrisma = {
                id: mockCampanhaDomainSemOpcionais.id,
                titulo: mockCampanhaDomainSemOpcionais.titulo,
                descricao: null,
                tipoCampanha: mockCampanhaDomainSemOpcionais.tipoCampanha,
                segmentoAlvo: mockCampanhaDomainSemOpcionais.segmentoAlvo,
                dataInicio: mockCampanhaDomainSemOpcionais.dataInicio,
                dataFim: null,
                templateMensagem: mockCampanhaDomainSemOpcionais.templateMensagem,
                formularioId: mockCampanhaDomainSemOpcionais.formularioId,
                canalEnvio: mockCampanhaDomain.canalEnvio,
                ativo: mockCampanhaDomainSemOpcionais.ativo,
                dataCriacao: mockCampanhaDomainSemOpcionais.dataCriacao,
                dataAtualizacao: mockCampanhaDomainSemOpcionais.dataAtualizacao,
                dataExclusao: null,
            };
            const campanha = campanha_map_1.CampanhaMap.toDomain(rawPrisma);
            (0, vitest_1.expect)(campanha.descricao).toBeUndefined();
            (0, vitest_1.expect)(campanha.dataFim).toBeNull();
        });
    });
    // --- Testes para toPersistence ---
    (0, vitest_1.describe)('toPersistence', () => {
        (0, vitest_1.it)('deve converter uma entidade Campanha completa para um objeto de persistência do Prisma', () => {
            const persistenceData = campanha_map_1.CampanhaMap.toPersistence(mockCampanhaDomain);
            // ✅ A expectativa agora corresponde à estrutura de 'connect' do Prisma.
            (0, vitest_1.expect)(persistenceData).toEqual({
                id: mockCampanhaDomain.id,
                titulo: mockCampanhaDomain.titulo,
                descricao: mockCampanhaDomain.descricao,
                tipoCampanha: mockCampanhaDomain.tipoCampanha,
                segmentoAlvo: mockCampanhaDomain.segmentoAlvo,
                dataInicio: mockCampanhaDomain.dataInicio,
                dataFim: mockCampanhaDomain.dataFim,
                templateMensagem: mockCampanhaDomain.templateMensagem,
                CanalEnvio: mockCampanhaDomain.canalEnvio,
                ativo: mockCampanhaDomain.ativo,
                dataCriacao: mockCampanhaDomain.dataCriacao,
                dataAtualizacao: mockCampanhaDomain.dataAtualizacao,
                dataExclusao: mockCampanhaDomain.dataExclusao,
                formulario: { connect: { id: mockCampanhaDomain.formularioId } },
            });
        });
        (0, vitest_1.it)('deve converter uma entidade inativa para persistência', () => {
            const persistenceData = campanha_map_1.CampanhaMap.toPersistence(mockCampanhaDomainInativa);
            (0, vitest_1.expect)(persistenceData.ativo).toBe(false);
            (0, vitest_1.expect)(persistenceData.dataExclusao).toEqual(dataFixaExclusao);
        });
    });
    // --- Testes para toResponseDTO ---
    (0, vitest_1.describe)('toResponseDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Campanha completa para CampanhaResponseDTO', () => {
            const dto = campanha_map_1.CampanhaMap.toResponseDTO(mockCampanhaDomain);
            (0, vitest_1.expect)(dto.id).toBe(mockCampanhaDomain.id);
            (0, vitest_1.expect)(dto.titulo).toBe(mockCampanhaDomain.titulo);
            (0, vitest_1.expect)(dto.dataInicio).toBe(dataFixaInicio.toISOString());
            (0, vitest_1.expect)(dto.dataFim).toBe(dataFixaFim.toISOString());
        });
        (0, vitest_1.it)('deve converter uma entidade Campanha sem opcionais para DTO', () => {
            const dto = campanha_map_1.CampanhaMap.toResponseDTO(mockCampanhaDomainSemOpcionais);
            (0, vitest_1.expect)(dto.descricao).toBeUndefined();
            (0, vitest_1.expect)(dto.dataFim).toBeNull();
        });
    });
});
//# sourceMappingURL=campanha.map.spec.js.map