"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domain_exception_1 = require("@shared/domain/domain.exception"); // Assumindo que seu IDEntityUUIDInvalid está aqui
const vitest_1 = require("vitest"); // Adicionado vi para controle de tempo
const pergunta_entity_1 = require("../pergunta.entity");
const pergunta_exception_1 = require("../pergunta.exception");
(0, vitest_1.describe)('Entidade Pergunta: Criar Pergunta', () => {
    (0, vitest_1.it)('deve criar uma pergunta do tipo nota com sucesso e opções padrão', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            _texto: 'Qual a sua nota para o atendimento?',
            _tipo: 'nota',
            _opcoes: undefined, // Testando opções undefined para tipo nota
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._id).toBeDefined();
        (0, vitest_1.expect)(pergunta._texto).toBe('Qual a sua nota para o atendimento?');
        (0, vitest_1.expect)(pergunta._tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta._opcoes).toEqual(['1', '2', '3', '4', '5']); // Opções padrão para 'nota'
        (0, vitest_1.expect)(pergunta._dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(pergunta._dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(pergunta._dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo nota com sucesso e opções customizadas', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            _texto: 'Classifique de 1 a 3',
            _tipo: 'nota',
            _opcoes: ['1', '2', '3'], // Opções customizadas
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta._opcoes).toEqual(['1', '2', '3']);
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo texto corretamente', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            _texto: 'O que você achou do tênis Corre 4?',
            _tipo: 'texto',
            _opcoes: undefined,
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._texto).toBe('O que você achou do tênis Corre 4?');
        (0, vitest_1.expect)(pergunta._tipo).toBe('texto');
        (0, vitest_1.expect)(pergunta._opcoes).toBeUndefined(); // Tipo texto não deve ter opções
    });
    (0, vitest_1.it)('deve criar uma pergunta do tipo multipla_escolha com opções válidas', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            _texto: 'Qual o seu nível de satisfação?',
            _tipo: 'multipla_escolha',
            _opcoes: ['ruim', 'bom', 'excelente']
        });
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._texto).toBe('Qual o seu nível de satisfação?');
        (0, vitest_1.expect)(pergunta._tipo).toBe('multipla_escolha');
        (0, vitest_1.expect)(pergunta._opcoes).toEqual(['ruim', 'bom', 'excelente']);
    });
    (0, vitest_1.it)('deve lançar exceção se o texto estiver vazio', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: '',
            _tipo: 'texto',
            _opcoes: undefined,
        })).toThrow(pergunta_exception_1.PerguntaTextoVazioException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for inválido', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: 'Texto',
            _tipo: 'escolha_unica', // Forçando tipo inválido para teste
            _opcoes: undefined,
        })).toThrow(pergunta_exception_1.TipoPerguntaInvalidoException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: 'Escolha uma opção',
            _tipo: 'multipla_escolha',
            _opcoes: ['Sim'],
        })).toThrow(pergunta_exception_1.QuantidadeMinimaOpcoesException);
    });
    (0, vitest_1.it)('deve lançar exceção se houver opções duplicadas para multipla_escolha', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: 'Escolha uma opção',
            _tipo: 'multipla_escolha',
            _opcoes: ['Sim', 'Não', 'Sim'],
        })).toThrow(pergunta_exception_1.OpcaoDuplicadaException);
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for texto e tiver opções', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: 'Qual seu nome?',
            _tipo: 'texto',
            _opcoes: ['João', 'Maria'],
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException); // "Perguntas do tipo texto não devem ter opções."
    });
    (0, vitest_1.it)('deve lançar exceção se o tipo for nota e as opções não forem numéricas', () => {
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.criar({
            _texto: 'Sua avaliação?',
            _tipo: 'nota',
            _opcoes: ['bom', 'ruim'],
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException); // "Opções de nota devem ser apenas números."
    });
});
(0, vitest_1.describe)('Entidade Pergunta: Recuperar Pergunta', () => {
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo nota com sucesso', () => {
        const perguntaValida = {
            _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            _texto: 'Qual a sua nota?',
            _tipo: 'nota',
            _opcoes: ['1', '2', '3', '4', '5'],
            _ativo: true,
            _dataCriacao: new Date(),
            _dataAtualizacao: new Date(),
            _dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._id).toBe(perguntaValida._id);
        (0, vitest_1.expect)(pergunta._texto).toBe('Qual a sua nota?');
        (0, vitest_1.expect)(pergunta._tipo).toBe('nota');
        (0, vitest_1.expect)(pergunta._opcoes).toEqual(['1', '2', '3', '4', '5']);
        (0, vitest_1.expect)(pergunta._ativo).toBe(true);
    });
    (0, vitest_1.it)('não deve recuperar uma pergunta com ID inválido (UUID inválido)', () => {
        const perguntaInvalida = {
            _id: '1234', // ID inválido
            _texto: 'Qual a sua nota?',
            _tipo: 'nota',
            _ativo: true,
            _dataCriacao: new Date(),
            _dataAtualizacao: new Date(),
            _dataExclusao: null,
        };
        // Assumindo que a validação de UUID ocorre na classe base Entity ou na construção do ID
        (0, vitest_1.expect)(() => pergunta_entity_1.Pergunta.recuperar(perguntaInvalida)).toThrow(domain_exception_1.IDEntityUUIDInvalid);
    });
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo texto sem opções', () => {
        const perguntaValida = {
            _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            _texto: 'Descreva sua experiência com o produto.',
            _tipo: 'texto',
            _ativo: true,
            _dataCriacao: new Date(),
            _dataAtualizacao: new Date(),
            _dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._texto).toBe('Descreva sua experiência com o produto.');
        (0, vitest_1.expect)(pergunta._tipo).toBe('texto');
        (0, vitest_1.expect)(pergunta._opcoes).toBeUndefined();
        (0, vitest_1.expect)(pergunta._ativo).toBe(true);
    });
    (0, vitest_1.it)('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
        const perguntaValida = {
            _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            _texto: 'Qual é a sua cor favorita?',
            _tipo: 'multipla_escolha',
            _opcoes: ['Azul', 'Verde', 'Vermelho'],
            _ativo: true,
            _dataCriacao: new Date(),
            _dataAtualizacao: new Date(),
            _dataExclusao: null,
        };
        const pergunta = pergunta_entity_1.Pergunta.recuperar(perguntaValida);
        (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(pergunta._texto).toBe('Qual é a sua cor favorita?');
        (0, vitest_1.expect)(pergunta._tipo).toBe('multipla_escolha');
        (0, vitest_1.expect)(pergunta._opcoes).toEqual(['Azul', 'Verde', 'Vermelho']);
        (0, vitest_1.expect)(pergunta._ativo).toBe(true);
    });
    (0, vitest_1.it)('deve lançar exceção se recuperar uma pergunta do tipo multipla_escolha com opções vazias', () => {
        const perguntaInvalida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual é a sua fruta favorita?',
            tipo: 'multipla_escolha',
            opcoes: [], // opções vazias
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
    (0, vitest_1.it)('deve inativar a pergunta com sucesso', () => {
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Pergunta para inativar',
            tipo: 'texto',
        });
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
        });
        pergunta.inativar(); // Inativa pela primeira vez
        (0, vitest_1.expect)(() => pergunta.inativar()).toThrowError();
    });
});
//# sourceMappingURL=pergunta.spec.js.map