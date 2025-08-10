"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pergunta_map_1 = require("../pergunta.map");
const client_1 = require("@prisma/client"); // Renomeei Pergunta para PerguntaPrisma para evitar conflito
const pergunta_exception_1 = require("@modules/formulario/domain/pergunta/pergunta.exception");
const crypto_1 = require("crypto");
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/pergunta.entity");
(0, vitest_1.describe)('PerguntaMap', () => {
    // Cenário base para os testes da entidade
    const ids = (0, crypto_1.randomUUID)();
    const mockPerguntaData = {
        id: ids,
        texto: 'Qual é o seu nível de satisfação?',
        tipo: 'multipla_escolha',
        opcoes: ['Ruim', 'Bom', 'Excelente'],
        ativo: true,
        dataCriacao: new Date('2023-01-15T10:00:00.000Z'),
        dataAtualizacao: new Date('2023-01-15T10:00:00.000Z'),
        dataExclusao: null,
    };
    const mockPerguntaTextoData = {
        id: ids,
        texto: 'Deixe seu comentário.',
        tipo: 'texto',
        opcoes: undefined,
        ativo: true,
        dataCriacao: new Date('2023-02-20T11:30:00.000Z'),
        dataAtualizacao: new Date('2023-02-20T11:30:00.000Z'),
        dataExclusao: null,
    };
    const mockPerguntaNotaData = {
        id: ids,
        texto: 'Dê uma nota de 1 a 5.',
        tipo: 'nota',
        opcoes: ['1', '2', '3', '4', '5'], // Opções padrão definidas pela entidade
        ativo: true,
        dataCriacao: new Date('2023-03-25T14:00:00.000Z'),
        dataAtualizacao: new Date('2023-03-25T14:00:00.000Z'),
        dataExclusao: null,
    };
    // Instâncias da entidade de domínio (criadas usando Pergunta.recuperar para fins de mock)
    const mockPergunta = pergunta_entity_1.Pergunta.recuperar(mockPerguntaData);
    const mockPerguntaTexto = pergunta_entity_1.Pergunta.recuperar(mockPerguntaTextoData);
    const mockPerguntaNota = pergunta_entity_1.Pergunta.recuperar(mockPerguntaNotaData);
    // --- Testes para toDTO ---
    (0, vitest_1.describe)('toDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Pergunta (multipla_escolha) para PerguntaResponseDTO', () => {
            const dto = pergunta_map_1.PerguntaMap.toDTO(mockPergunta);
            (0, vitest_1.expect)(dto).toEqual({
                id: mockPerguntaData.id,
                texto: mockPerguntaData.texto,
                tipo: mockPerguntaData.tipo,
                opcoes: mockPerguntaData.opcoes,
                ativo: mockPerguntaData.ativo,
                dataCriacao: mockPerguntaData.dataCriacao.toISOString(),
                dataAtualizacao: mockPerguntaData.dataAtualizacao.toISOString(),
            });
            (0, vitest_1.expect)(dto).not.toHaveProperty('dataExclusao');
        });
        (0, vitest_1.it)('deve converter uma entidade Pergunta (texto) para PerguntaResponseDTO com opcoes undefined', () => {
            const dto = pergunta_map_1.PerguntaMap.toDTO(mockPerguntaTexto);
            (0, vitest_1.expect)(dto.id).toBe(mockPerguntaTextoData.id);
            (0, vitest_1.expect)(dto.texto).toBe(mockPerguntaTextoData.texto);
            (0, vitest_1.expect)(dto.tipo).toBe(mockPerguntaTextoData.tipo);
            (0, vitest_1.expect)(dto.opcoes).toBeUndefined();
            (0, vitest_1.expect)(dto.dataCriacao).toBe(mockPerguntaTextoData.dataCriacao.toISOString());
            (0, vitest_1.expect)(dto.dataAtualizacao).toBe(mockPerguntaTextoData.dataAtualizacao.toISOString());
        });
        (0, vitest_1.it)('deve converter uma entidade Pergunta (nota) para PerguntaResponseDTO com opcoes definidas', () => {
            const dto = pergunta_map_1.PerguntaMap.toDTO(mockPerguntaNota);
            (0, vitest_1.expect)(dto.id).toBe(mockPerguntaNotaData.id);
            (0, vitest_1.expect)(dto.texto).toBe(mockPerguntaNotaData.texto);
            (0, vitest_1.expect)(dto.tipo).toBe(mockPerguntaNotaData.tipo);
            (0, vitest_1.expect)(dto.opcoes).toEqual(['1', '2', '3', '4', '5']);
            (0, vitest_1.expect)(dto.dataCriacao).toBe(mockPerguntaNotaData.dataCriacao.toISOString());
            (0, vitest_1.expect)(dto.dataAtualizacao).toBe(mockPerguntaNotaData.dataAtualizacao.toISOString());
        });
        (0, vitest_1.it)('deve lidar com entidade inativa (dataExclusao não deve ir para DTO)', () => {
            const perguntaInativa = pergunta_entity_1.Pergunta.recuperar({
                ...mockPerguntaData,
                ativo: false,
                dataExclusao: new Date('2023-04-01T15:00:00.000Z'),
            });
            const dto = pergunta_map_1.PerguntaMap.toDTO(perguntaInativa);
            (0, vitest_1.expect)(dto).not.toHaveProperty('dataExclusao');
        });
    });
    // --- Testes para toDomain ---
    (0, vitest_1.describe)('toDomain', () => {
        // Dados crus (do Prisma) que seriam lidos do banco.
        // **USAR snake_case para propriedades do banco**
        // N-N: Não há 'formularioId' aqui.
        const rawMultiplaEscolha = {
            id: mockPerguntaData.id,
            texto: mockPerguntaData.texto,
            tipo: mockPerguntaData.tipo,
            opcoes: mockPerguntaData.opcoes,
            ativo: mockPerguntaData.ativo,
            dataCriacao: mockPerguntaData.dataCriacao, // <-- CORRIGIDO: de dataCriacao para data_criacao
            dataAtualizacao: mockPerguntaData.dataAtualizacao, // <-- CORRIGIDO: de dataAtualizacao para data_atualizacao
            dataExclusao: mockPerguntaData.dataExclusao, // <-- CORRIGIDO: de dataExclusao para data_exclusao
        };
        const rawTexto = {
            id: mockPerguntaTextoData.id,
            texto: mockPerguntaTextoData.texto,
            tipo: mockPerguntaTextoData.tipo,
            opcoes: null,
            ativo: mockPerguntaTextoData.ativo,
            dataCriacao: mockPerguntaTextoData.dataCriacao, // <-- CORRIGIDO
            dataAtualizacao: mockPerguntaTextoData.dataAtualizacao, // <-- CORRIGIDO
            dataExclusao: mockPerguntaTextoData.dataExclusao, // <-- CORRIGIDO
        };
        const rawNota = {
            id: mockPerguntaNotaData.id,
            texto: mockPerguntaNotaData.texto,
            tipo: mockPerguntaNotaData.tipo,
            opcoes: null,
            ativo: mockPerguntaNotaData.ativo,
            dataCriacao: mockPerguntaNotaData.dataCriacao, // <-- CORRIGIDO
            dataAtualizacao: mockPerguntaNotaData.dataAtualizacao, // <-- CORRIGIDO
            dataExclusao: mockPerguntaNotaData.dataExclusao, // <-- CORRIGIDO
        };
        (0, vitest_1.it)('deve converter dados crus do Prisma (multipla_escolha) para uma entidade Pergunta', () => {
            const pergunta = pergunta_map_1.PerguntaMap.toDomain(rawMultiplaEscolha);
            (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
            (0, vitest_1.expect)(pergunta.id).toBe(rawMultiplaEscolha.id);
            (0, vitest_1.expect)(pergunta.texto).toBe(rawMultiplaEscolha.texto);
            (0, vitest_1.expect)(pergunta.tipo).toBe(rawMultiplaEscolha.tipo);
            (0, vitest_1.expect)(pergunta.opcoes).toEqual(rawMultiplaEscolha.opcoes);
            (0, vitest_1.expect)(pergunta.ativo).toBe(rawMultiplaEscolha.ativo);
            (0, vitest_1.expect)(pergunta.dataCriacao).toEqual(rawMultiplaEscolha.dataCriacao); // <-- Comparar com snake_case do raw
            (0, vitest_1.expect)(pergunta.dataAtualizacao).toEqual(rawMultiplaEscolha.dataAtualizacao); // <-- Comparar com snake_case do raw
            (0, vitest_1.expect)(pergunta.dataExclusao).toEqual(rawMultiplaEscolha.dataExclusao); // <-- Comparar com snake_case do raw
        });
        (0, vitest_1.it)('deve converter dados crus do Prisma (texto com opcoes null) para uma entidade Pergunta com opcoes undefined', () => {
            const pergunta = pergunta_map_1.PerguntaMap.toDomain(rawTexto);
            (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
            (0, vitest_1.expect)(pergunta.id).toBe(rawTexto.id);
            (0, vitest_1.expect)(pergunta.tipo).toBe(rawTexto.tipo);
            (0, vitest_1.expect)(pergunta.opcoes).toBeUndefined();
            (0, vitest_1.expect)(pergunta.ativo).toBe(rawTexto.ativo);
        });
        (0, vitest_1.it)('deve converter dados crus do Prisma (nota com opcoes null) para uma entidade Pergunta com opcoes padrão', () => {
            const pergunta = pergunta_map_1.PerguntaMap.toDomain(rawNota);
            (0, vitest_1.expect)(pergunta).toBeInstanceOf(pergunta_entity_1.Pergunta);
            (0, vitest_1.expect)(pergunta.id).toBe(rawNota.id);
            (0, vitest_1.expect)(pergunta.tipo).toBe(rawNota.tipo);
            (0, vitest_1.expect)(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']);
            (0, vitest_1.expect)(pergunta.ativo).toBe(rawNota.ativo);
        });
        (0, vitest_1.it)('deve lidar com dataExclusao não nula', () => {
            const rawComExclusao = {
                ...rawMultiplaEscolha,
                dataExclusao: new Date('2023-04-01T15:00:00.000Z'), // <-- CORRIGIDO
            };
            const pergunta = pergunta_map_1.PerguntaMap.toDomain(rawComExclusao);
            (0, vitest_1.expect)(pergunta.dataExclusao).toEqual(rawComExclusao.dataExclusao); // <-- Comparar com snake_case
        });
        (0, vitest_1.it)('deve lançar exceção ao tentar converter raw.opcoes que não são arrays válidos para multipla_escolha', () => {
            const rawInvalido = {
                ...rawMultiplaEscolha,
                opcoes: 'string_invalida',
            };
            (0, vitest_1.expect)(() => pergunta_map_1.PerguntaMap.toDomain(rawInvalido)).toThrow(pergunta_exception_1.QuantidadeMinimaOpcoesException);
        });
    });
    // --- Testes para toPersistence ---
    (0, vitest_1.describe)('toPersistence', () => {
        (0, vitest_1.it)('deve converter uma entidade Pergunta (multipla_escolha) para um objeto de persistência do Prisma', () => {
            const persistenceData = pergunta_map_1.PerguntaMap.toPersistence(mockPergunta);
            (0, vitest_1.expect)(persistenceData).toEqual({
                id: mockPerguntaData.id,
                texto: mockPerguntaData.texto,
                tipo: mockPerguntaData.tipo,
                opcoes: mockPerguntaData.opcoes,
                ativo: mockPerguntaData.ativo,
                dataCriacao: mockPerguntaData.dataCriacao,
                dataAtualizacao: mockPerguntaData.dataAtualizacao,
                dataExclusao: mockPerguntaData.dataExclusao,
            });
        });
        (0, vitest_1.it)('deve converter uma entidade Pergunta (texto) para um objeto de persistência com opcoes como Prisma.JsonNull', () => {
            const persistenceData = pergunta_map_1.PerguntaMap.toPersistence(mockPerguntaTexto);
            (0, vitest_1.expect)(persistenceData.id).toBe(mockPerguntaTextoData.id);
            (0, vitest_1.expect)(persistenceData.texto).toBe(mockPerguntaTextoData.texto);
            (0, vitest_1.expect)(persistenceData.tipo).toBe(mockPerguntaTextoData.tipo);
            (0, vitest_1.expect)(persistenceData.opcoes).toBe(client_1.Prisma.JsonNull);
            (0, vitest_1.expect)(persistenceData.ativo).toBe(mockPerguntaTextoData.ativo);
            (0, vitest_1.expect)(persistenceData.dataCriacao).toEqual(mockPerguntaTextoData.dataCriacao);
            (0, vitest_1.expect)(persistenceData.dataAtualizacao).toEqual(mockPerguntaTextoData.dataAtualizacao);
            (0, vitest_1.expect)(persistenceData.dataExclusao).toBe(mockPerguntaTextoData.dataExclusao);
        });
        (0, vitest_1.it)('deve converter uma entidade Pergunta (nota) para um objeto de persistência com opcoes definidas (padrão)', () => {
            const persistenceData = pergunta_map_1.PerguntaMap.toPersistence(mockPerguntaNota);
            (0, vitest_1.expect)(persistenceData.id).toBe(mockPerguntaNotaData.id);
            (0, vitest_1.expect)(persistenceData.texto).toBe(mockPerguntaNotaData.texto);
            (0, vitest_1.expect)(persistenceData.tipo).toBe(mockPerguntaNotaData.tipo);
            (0, vitest_1.expect)(persistenceData.opcoes).toEqual(['1', '2', '3', '4', '5']);
            (0, vitest_1.expect)(persistenceData.ativo).toBe(mockPerguntaNotaData.ativo);
            (0, vitest_1.expect)(persistenceData.dataCriacao).toEqual(mockPerguntaNotaData.dataCriacao);
            (0, vitest_1.expect)(persistenceData.dataAtualizacao).toEqual(mockPerguntaNotaData.dataAtualizacao);
            (0, vitest_1.expect)(persistenceData.dataExclusao).toBe(mockPerguntaNotaData.dataExclusao);
        });
        (0, vitest_1.it)('deve converter uma entidade Pergunta com dataExclusao para persistencia', () => {
            const perguntaInativaData = {
                ...mockPerguntaData,
                ativo: false,
                dataExclusao: new Date('2023-05-01T16:00:00.000Z'),
            };
            const perguntaInativa = pergunta_entity_1.Pergunta.recuperar(perguntaInativaData);
            const persistenceData = pergunta_map_1.PerguntaMap.toPersistence(perguntaInativa);
            (0, vitest_1.expect)(persistenceData.dataExclusao).toEqual(perguntaInativaData.dataExclusao);
            (0, vitest_1.expect)(persistenceData.ativo).toBe(perguntaInativaData.ativo);
        });
    });
});
//# sourceMappingURL=pergunta.map.spec.js.map