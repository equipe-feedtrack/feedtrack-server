"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Entidades e Tipos de Domínio
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/pergunta.entity");
const formulario_entity_1 = require("@modules/formulario/domain/formulario/formulario.entity");
const formulario_map_1 = require("../formulario.map");
const pergunta_map_1 = require("../pergunta.map");
// --- MOCKS DAS DEPENDÊNCIAS (PerguntaMap) ---
vitest_1.vi.mock('../pergunta.map');
(0, vitest_1.describe)('FormularioMap', () => {
    // =================================================================
    // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS COM UUIDs VÁLIDOS
    // =================================================================
    const dataFixa = new Date('2025-08-10T14:00:00.000Z');
    const PERGUNTA_ID = '1e7d8c5e-2f6b-4a8c-9b1d-0e9f8a7b6c5d';
    const FORMULARIO_ID = 'a3b8d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
    const mockPergunta = pergunta_entity_1.Pergunta.recuperar({
        id: PERGUNTA_ID,
        texto: 'Qual o seu nível de satisfação?',
        tipo: 'nota',
        opcoes: [],
        ativo: true,
        dataCriacao: dataFixa,
        dataAtualizacao: dataFixa,
        dataExclusao: null,
    });
    const mockFormularioDomain = formulario_entity_1.Formulario.recuperar({
        id: FORMULARIO_ID,
        titulo: 'Formulário de Satisfação',
        descricao: 'Feedback sobre o nosso serviço.',
        perguntas: [mockPergunta],
        ativo: true,
        dataCriacao: dataFixa,
        dataAtualizacao: dataFixa,
        dataExclusao: null,
    });
    // =================================================================
    // Limpeza dos mocks antes de cada teste
    // =================================================================
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // =================================================================
    // Testes
    // =================================================================
    (0, vitest_1.describe)('toDomain', () => {
        (0, vitest_1.it)('deve converter dados do Prisma (com relação N-N aninhada) para uma entidade Formulario', () => {
            // DADO: um objeto como viria do Prisma
            const formularioPrisma = {
                id: FORMULARIO_ID,
                titulo: 'Formulário de Satisfação',
                descricao: 'Feedback sobre o nosso serviço.',
                ativo: true,
                dataCriacao: dataFixa,
                dataAtualizacao: dataFixa,
                dataExclusao: null,
                perguntas: [
                    {
                        formularioId: FORMULARIO_ID,
                        perguntaId: PERGUNTA_ID,
                        ordemNaLista: 0,
                        pergunta: {
                            id: PERGUNTA_ID,
                            texto: 'Qual o seu nível de satisfação?',
                            tipo: 'nota',
                            opcoes: [],
                            ativo: true,
                            dataCriacao: dataFixa,
                            dataAtualizacao: dataFixa,
                            dataExclusao: null,
                        },
                    },
                ],
            };
            // ✅ CORREÇÃO: Cast explícito para o tipo Mock
            pergunta_map_1.PerguntaMap.toDomain.mockImplementation(() => mockPergunta);
            // QUANDO: o método é chamado
            const formularioDomain = formulario_map_1.FormularioMap.toDomain(formularioPrisma);
            // ENTÃO: o resultado deve ser uma instância de Formulario com os dados corretos
            (0, vitest_1.expect)(formularioDomain).toBeInstanceOf(formulario_entity_1.Formulario);
            (0, vitest_1.expect)(formularioDomain.id).toBe(FORMULARIO_ID);
            (0, vitest_1.expect)(formularioDomain.titulo).toBe('Formulário de Satisfação');
            (0, vitest_1.expect)(formularioDomain.perguntas[0].id).toBe(PERGUNTA_ID);
            (0, vitest_1.expect)(pergunta_map_1.PerguntaMap.toDomain).toHaveBeenCalledWith(formularioPrisma.perguntas[0].pergunta);
        });
    });
    (0, vitest_1.describe)('toPersistence', () => {
        (0, vitest_1.it)('deve converter uma entidade Formulario para o formato de persistência do Prisma', () => {
            // QUANDO: o método é chamado
            const persistenceObject = formulario_map_1.FormularioMap.toPersistence(mockFormularioDomain);
            // ENTÃO: o objeto retornado deve ter o formato esperado pelo Prisma.create
            (0, vitest_1.expect)(persistenceObject.id).toBe(FORMULARIO_ID);
            (0, vitest_1.expect)(persistenceObject.titulo).toBe('Formulário de Satisfação');
            (0, vitest_1.expect)(persistenceObject.ativo).toBe(true);
        });
    });
    (0, vitest_1.describe)('toResponseDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Formulario para um DTO de resposta detalhado', () => {
            // ✅ CORREÇÃO: Cast explícito para o tipo Mock
            pergunta_map_1.PerguntaMap.toDTO.mockImplementation(() => ({
                id: PERGUNTA_ID,
                texto: 'Qual o seu nível de satisfação?',
                tipo: 'nota',
                opcoes: [],
                ativo: true,
                dataCriacao: dataFixa.toISOString(),
                dataAtualizacao: dataFixa.toISOString(),
            }));
            // QUANDO: o método é chamado
            const dto = formulario_map_1.FormularioMap.toResponseDTO(mockFormularioDomain);
            // ENTÃO: as dependências são chamadas e o DTO é montado corretamente
            (0, vitest_1.expect)(pergunta_map_1.PerguntaMap.toDTO).toHaveBeenCalledWith(mockPergunta);
            (0, vitest_1.expect)(dto.id).toBe(FORMULARIO_ID);
            (0, vitest_1.expect)(dto.perguntas).toHaveLength(1);
            (0, vitest_1.expect)(dto.perguntas[0].id).toBe(PERGUNTA_ID);
            (0, vitest_1.expect)(dto.dataCriacao).toBe(dataFixa.toISOString());
        });
    });
    (0, vitest_1.describe)('toListDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Formulario para um DTO de resposta resumido', () => {
            // QUANDO: o método é chamado
            const dto = formulario_map_1.FormularioMap.toListDTO(mockFormularioDomain);
            // ENTÃO: o DTO deve ter o formato correto e a contagem de perguntas
            (0, vitest_1.expect)(dto.id).toBe(FORMULARIO_ID);
            (0, vitest_1.expect)(dto.titulo).toBe('Formulário de Satisfação');
            (0, vitest_1.expect)(dto.quantidadePerguntas).toBe(1);
            (0, vitest_1.expect)(dto.dataCriacao).toBe(dataFixa.toISOString());
        });
    });
});
//# sourceMappingURL=formulario.map.spec.js.map