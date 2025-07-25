"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domain_exception_1 = require("@shared/domain/domain.exception"); // Assumindo que seu IDEntityUUIDInvalid está aqui
const vitest_1 = require("vitest"); // Adicionado vi para controle de tempo
const pergunta_entity_1 = require("../pergunta.entity");
const pergunta_exception_1 = require("../pergunta.exception");
(0, vitest_1.describe)('Entidade Pergunta: Criar Pergunta', () => {
    (0, vitest_1.it)('deve criar uma pergunta do tipo nota com sucesso e opções padrão', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Qual a sua nota para o atendimento?',
            tipo: 'nota',
            opcoes: undefined, // Testando opções undefined para tipo nota
            formularioId: 'form-001',
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.id).toBeDefined();
        (0, vitest_1.expect)(pergunta.texto).toBe('Qual a sua nota para o atendimento?');
        (0, vitest_1.expect)(pergunta.tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']); // Opções padrão para 'nota'
        (0, vitest_1.expect)(pergunta.formularioId).toBe('form-001'); // Agora deve passar
        (0, vitest_1.expect)(pergunta.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(pergunta.dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(pergunta.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo nota com sucesso e opções customizadas', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Classifique de 1 a 3',
            tipo: 'nota',
            opcoes: ['1', '2', '3'], // Opções customizadas
            formularioId: 'form-008',
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta.opcoes).toEqual(['1', '2', '3']);
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo texto corretamente', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'O que você achou do tênis Corre 4?',
            tipo: 'texto',
            opcoes: undefined,
            formularioId: 'form-002',
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.texto).toBe('O que você achou do tênis Corre 4?');
        (0, vitest_1.expect)(pergunta.tipo).toBe('texto');
        (0, vitest_1.expect)(pergunta.opcoes).toBeUndefined(); // Tipo texto não deve ter opções
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo multipla_escolha com opções válidas', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Qual o seu nível de satisfação?',
            tipo: 'multipla_escolha',
            opcoes: ['ruim', 'bom', 'excelente'],
            formularioId: 'form-003',
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.texto).toBe('Qual o seu nível de satisfação?');
        (0, vitest_1.expect)(pergunta.tipo).toBe('multipla_escolha');
        (0, vitest_1.expect)(pergunta.opcoes).toEqual(['ruim', 'bom', 'excelente']);
    });
    (0, vitest_1.it)('deve lançar exceção se o texto estiver vazio', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: '',
            tipo: 'texto',
            opcoes: undefined,
            formularioId: 'form-004',
        })).toThrow(pergunta_exception_1.PerguntaTextoVazioException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for inválido', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: 'Texto',
            tipo: 'escolha_unica', // Forçando tipo inválido para teste
            opcoes: undefined,
            formularioId: 'form-005',
        })).toThrow(pergunta_exception_1.TipoPerguntaInvalidoException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: 'Escolha uma opção',
            tipo: 'multipla_escolha',
            opcoes: ['Sim'],
            formularioId: 'form-006',
        })).toThrow(pergunta_exception_1.QuantidadeMinimaOpcoesException);
    });
    (0, vitest_1.it)('deve lançar exceção se houver opções duplicadas para multipla_escolha', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: 'Escolha uma opção',
            tipo: 'multipla_escolha',
            opcoes: ['Sim', 'Não', 'Sim'],
            formularioId: 'form-007',
        })).toThrow(pergunta_exception_1.OpcaoDuplicadaException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for texto e tiver opções', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: 'Qual seu nome?',
            tipo: 'texto',
            opcoes: ['João', 'Maria'],
            formularioId: 'form-009',
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException); // "Perguntas do tipo texto não devem ter opções."
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for nota e as opções não forem numéricas', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            texto: 'Sua avaliação?',
            tipo: 'nota',
            opcoes: ['bom', 'ruim'],
            formularioId: 'form-010',
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException); // "Opções de nota devem ser apenas números."
    });
});
(0, vitest_1.describe)('Entidade Pergunta: Recuperar Pergunta', () => {
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo nota com sucesso', () => {
        const perguntaValida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual a sua nota?',
            tipo: 'nota',
            opcoes: ['1', '2', '3', '4', '5'],
            ativo: true,
            formularioId: 'form-010',
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.id).toBe(perguntaValida.id);
        (0, vitest_1.expect)(pergunta.texto).toBe('Qual a sua nota?');
        (0, vitest_1.expect)(pergunta.tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']);
        (0, vitest_1.expect)(pergunta.ativo).toBe(true);
    });
    (0, vitest_1.it)('não deve recuperar uma pergunta com ID inválido (UUID inválido)', () => {
        const perguntaInvalida = {
            id: '1234', // ID inválido
            texto: 'Qual a sua nota?',
            tipo: 'nota',
            formularioId: 'form-010.1',
            ativo: true,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        // Assumindo que a validação de UUID ocorre na classe base Entity ou na construção do ID
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.recuperar(perguntaInvalida)).toThrow(domain_exception_1.IDEntityUUIDInvalid);
    });
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo texto sem opções', () => {
        const perguntaValida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Descreva sua experiência com o produto.',
            tipo: 'texto',
            formularioId: 'form-011',
            ativo: true,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.texto).toBe('Descreva sua experiência com o produto.');
        (0, vitest_1.expect)(pergunta.tipo).toBe('texto');
        (0, vitest_1.expect)(pergunta.opcoes).toBeUndefined();
        (0, vitest_1.expect)(pergunta.ativo).toBe(true);
    });
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
        const perguntaValida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual é a sua cor favorita?',
            tipo: 'multipla_escolha',
            opcoes: ['Azul', 'Verde', 'Vermelho'],
            ativo: true,
            formularioId: 'form-012',
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta.texto).toBe('Qual é a sua cor favorita?');
        (0, vitest_1.expect)(pergunta.tipo).toBe('multipla_escolha');
        (0, vitest_1.expect)(pergunta.opcoes).toEqual(['Azul', 'Verde', 'Vermelho']);
        (0, vitest_1.expect)(pergunta.ativo).toBe(true);
    });
    (0, vitest_1.it)('deve lançar exceção se recuperar uma pergunta do tipo multipla_escolha com opções vazias', () => {
        const perguntaInvalida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual é a sua fruta favorita?',
            tipo: 'multipla_escolha',
            opcoes: [], // opções vazias
            formularioId: 'form-013',
            ativo: true,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.recuperar(perguntaInvalida)).toThrow(pergunta_exception_1.QuantidadeMinimaOpcoesException);
    });
    (0, vitest_1.it)('deve lançar exceção se recuperar uma pergunta do tipo texto com opções', () => {
        const perguntaInvalida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Comentário',
            tipo: 'texto',
            opcoes: ['Opção 1'],
            formularioId: 'form-014',
            ativo: true,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.recuperar(perguntaInvalida)).toThrow(pergunta_exception_1.ValidacaoPerguntaException);
    });
});
(0, vitest_1.describe)('Entidade Pergunta: Métodos de Comportamento', () => {
    // Configurações para controlar o tempo nos testes
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers(); // Habilita os timers falsos do Vitest
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers(); // Restaura os timers reais após cada teste
    });
    (0, vitest_1.it)('deve vincular a um formulário se a pergunta não estiver vinculada', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Teste de vínculo',
            tipo: 'texto',
            formularioId: undefined, // Pergunta não vinculada
        });
        const oldUpdateDate = pergunta.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(1); // Avança o tempo em 1ms para garantir que a nova data seja maior
        pergunta.vincularFormulario('novo-formulario-id');
        (0, vitest_1.expect)(pergunta.formularioId).toBe('novo-formulario-id');
        (0, vitest_1.expect)(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('não deve vincular a outro formulário se já estiver vinculada a um diferente', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Teste de vínculo existente',
            tipo: 'texto',
            formularioId: 'formulario-existente',
        });
        (0, vitest_1.expect)(() => pergunta.vincularFormulario('novo-formulario-id')).toThrow('Esta pergunta já está vinculada a outro formulário.');
    });
    (0, vitest_1.it)('deve permitir vincular ao mesmo formulário sem lançar exceção', () => {
        const formularioId = 'formulario-abc';
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Teste de mesmo vínculo',
            tipo: 'texto',
            formularioId: formularioId,
        });
        const oldUpdateDate = pergunta.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(1); // Avança o tempo em 1ms
        (0, vitest_1.expect)(() => pergunta.vincularFormulario(formularioId)).not.toThrow();
        (0, vitest_1.expect)(pergunta.formularioId).toBe(formularioId);
        (0, vitest_1.expect)(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('deve inativar a pergunta com sucesso', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Pergunta para inativar',
            tipo: 'texto',
            formularioId: 'form-inativar',
        });
        (0, vitest_1.expect)(pergunta.ativo).toBe(false);
        (0, vitest_1.expect)(pergunta.dataExclusao).toBeNull();
        const oldUpdateDate = pergunta.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(1); // Avança o tempo em 1ms
        pergunta.inativar();
        (0, vitest_1.expect)(pergunta.ativo).toBe(false);
        (0, vitest_1.expect)(pergunta.dataExclusao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    });
    (0, vitest_1.it)('não deve inativar uma pergunta já inativa', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Pergunta já inativa',
            tipo: 'texto',
            formularioId: 'form-inativa',
        });
        pergunta.inativar(); // Inativa pela primeira vez
        (0, vitest_1.expect)(() => pergunta.inativar()).toThrow('Esta pergunta já está inativa.');
    });
});
//# sourceMappingURL=pergunta.spec.js.map