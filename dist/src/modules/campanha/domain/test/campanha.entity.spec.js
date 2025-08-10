"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const campanha_entity_1 = require("../campanha.entity");
const campanha_types_1 = require("../campanha.types");
(0, vitest_1.describe)('Entidade Campanha', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers(); // Controla o tempo para testes de data
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    // Props base para criar Campanhas nos testes
    const baseProps = {
        titulo: 'Campanha de Verão 2025',
        descricao: 'Promoção para novos clientes de verão',
        tipoCampanha: campanha_types_1.TipoCampanha.PROMOCIONAL,
        segmentoAlvo: campanha_types_1.SegmentoAlvo.NOVOS_CLIENTES,
        dataInicio: new Date('2025-01-01T00:00:00Z'),
        dataFim: new Date('2025-03-31T23:59:59Z'),
        templateMensagem: 'Olá, {{cliente_nome}}! Aproveite nossa promoção de verão: ...',
        formularioId: 'form-id-campanha-1',
    };
    // --- Testes para o método 'criar' ---
    (0, vitest_1.it)('deve criar uma nova campanha com todos os dados e status ativo por padrão', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        (0, vitest_1.expect)(campanha).toBeInstanceOf(campanha_entity_1.Campanha);
        (0, vitest_1.expect)(campanha.id).toBeDefined();
        (0, vitest_1.expect)(campanha.titulo).toBe(baseProps.titulo);
        (0, vitest_1.expect)(campanha.descricao).toBe(baseProps.descricao);
        (0, vitest_1.expect)(campanha.tipoCampanha).toBe(baseProps.tipoCampanha);
        (0, vitest_1.expect)(campanha.segmentoAlvo).toBe(baseProps.segmentoAlvo);
        (0, vitest_1.expect)(campanha.dataInicio).toEqual(baseProps.dataInicio);
        (0, vitest_1.expect)(campanha.dataFim).toEqual(baseProps.dataFim);
        (0, vitest_1.expect)(campanha.templateMensagem).toBe(baseProps.templateMensagem);
        (0, vitest_1.expect)(campanha.formularioId).toBe(baseProps.formularioId);
        (0, vitest_1.expect)(campanha.ativo).toBe(true); // Padrão
        (0, vitest_1.expect)(campanha.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(campanha.dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(campanha.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve criar uma campanha sem descrição e sem data fim', () => {
        const campanha = campanha_entity_1.Campanha.criar({
            ...baseProps,
            descricao: undefined,
            dataFim: null,
        });
        (0, vitest_1.expect)(campanha.descricao).toBeUndefined();
        (0, vitest_1.expect)(campanha.dataFim).toBeNull();
    });
    (0, vitest_1.it)('deve lançar erro ao criar campanha com título vazio', () => {
        (0, vitest_1.expect)(() => campanha_entity_1.Campanha.criar({ ...baseProps, titulo: '' })).toThrowError('Título da campanha não pode ser vazio.');
    });
    (0, vitest_1.it)('deve lançar erro ao criar campanha com template de mensagem vazio', () => {
        (0, vitest_1.expect)(() => campanha_entity_1.Campanha.criar({ ...baseProps, templateMensagem: ' ' })).toThrowError('Template da mensagem não pode ser vazio.');
    });
    (0, vitest_1.it)('deve lançar erro ao criar campanha com ID de formulário vazio', () => {
        (0, vitest_1.expect)(() => campanha_entity_1.Campanha.criar({ ...baseProps, formularioId: '' })).toThrowError('ID do formulário não pode ser vazio.');
    });
    // --- Testes para o método 'recuperar' ---
    (0, vitest_1.it)('deve recuperar uma campanha existente corretamente', () => {
        const recuperacaoProps = {
            id: '1da68d4a-5c24-4f81-a7e8-e5f3b7c2a1d9',
            titulo: 'Campanha Antiga',
            descricao: 'Descrição antiga',
            tipoCampanha: campanha_types_1.TipoCampanha.SATISFACAO,
            segmentoAlvo: campanha_types_1.SegmentoAlvo.TODOS_CLIENTES,
            dataInicio: new Date('2024-01-01T00:00:00Z'),
            dataFim: null,
            templateMensagem: 'Template antigo',
            formularioId: '1da68d4a-5c24-4f81-a7e8-e5f3b7c2a1d9',
            ativo: false, // Pode ser inativa
            dataCriacao: new Date('2024-01-01T00:00:00Z'),
            dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
            dataExclusao: new Date('2024-02-01T00:00:00Z'),
        };
        const campanha = campanha_entity_1.Campanha.recuperar(recuperacaoProps);
        (0, vitest_1.expect)(campanha).toBeInstanceOf(campanha_entity_1.Campanha);
        (0, vitest_1.expect)(campanha.id).toBe(recuperacaoProps.id);
        (0, vitest_1.expect)(campanha.titulo).toBe(recuperacaoProps.titulo);
        (0, vitest_1.expect)(campanha.ativo).toBe(false);
        (0, vitest_1.expect)(campanha.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
    });
    // --- Testes para Métodos de Comportamento ---
    (0, vitest_1.it)('deve ativar uma campanha inativa com sucesso', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        campanha.desativar(); // Coloca em estado inativo para testar ativação
        (0, vitest_1.expect)(campanha.ativo).toBe(false);
        const oldUpdateDate = campanha.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(100);
        campanha.ativar();
        (0, vitest_1.expect)(campanha.ativo).toBe(true);
        (0, vitest_1.expect)(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('não deve ativar uma campanha já ativa', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps); // Já é ativa
        (0, vitest_1.expect)(() => campanha.ativar()).toThrowError('Campanha já está ativa.');
    });
    (0, vitest_1.it)('deve desativar uma campanha ativa com sucesso', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps); // É ativa
        (0, vitest_1.expect)(campanha.ativo).toBe(true);
        (0, vitest_1.expect)(campanha.dataExclusao).toBeNull();
        const oldUpdateDate = campanha.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(100);
        campanha.desativar();
        (0, vitest_1.expect)(campanha.ativo).toBe(false);
        (0, vitest_1.expect)(campanha.dataExclusao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('não deve desativar uma campanha já inativa', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        campanha.desativar(); // Coloca em estado inativo
        (0, vitest_1.expect)(() => campanha.desativar()).toThrowError('Campanha já está inativa.');
    });
    (0, vitest_1.it)('deve atualizar o período da campanha com sucesso', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        const oldDataInicio = campanha.dataInicio;
        const oldDataAtualizacao = campanha.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(100);
        const novaDataInicio = new Date('2025-04-01T00:00:00Z');
        const novaDataFim = new Date('2025-06-30T23:59:59Z');
        campanha.atualizarPeriodo(novaDataInicio, novaDataFim);
        (0, vitest_1.expect)(campanha.dataInicio).toEqual(novaDataInicio);
        (0, vitest_1.expect)(campanha.dataFim).toEqual(novaDataFim);
        (0, vitest_1.expect)(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldDataAtualizacao.getTime());
    });
    (0, vitest_1.it)('deve lançar erro ao atualizar período com data fim anterior à data início', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        const dataInicioInvalida = new Date('2025-05-01T00:00:00Z');
        const dataFimInvalida = new Date('2025-04-30T23:59:59Z');
        (0, vitest_1.expect)(() => campanha.atualizarPeriodo(dataInicioInvalida, dataFimInvalida)).toThrowError('Data de fim da campanha não pode ser anterior à data de início.');
    });
    (0, vitest_1.it)('deve atualizar o template da mensagem com sucesso', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        const oldTemplate = campanha.templateMensagem;
        const oldUpdateDate = campanha.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(100);
        const novoTemplate = 'Novo template de mensagem para clientes';
        campanha.atualizarTemplate(novoTemplate);
        (0, vitest_1.expect)(campanha.templateMensagem).toBe(novoTemplate);
        (0, vitest_1.expect)(campanha.templateMensagem).not.toBe(oldTemplate);
        (0, vitest_1.expect)(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('deve lançar erro ao atualizar o template da mensagem com template vazio', () => {
        const campanha = campanha_entity_1.Campanha.criar(baseProps);
        (0, vitest_1.expect)(() => campanha.atualizarTemplate('')).toThrowError('Template da mensagem não pode ser vazio.');
        (0, vitest_1.expect)(() => campanha.atualizarTemplate('   ')).toThrowError('Template da mensagem não pode ser vazio.');
    });
});
//# sourceMappingURL=campanha.entity.spec.js.map