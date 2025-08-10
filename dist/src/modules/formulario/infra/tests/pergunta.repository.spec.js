"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/pergunta.entity");
const pergunta_repository_prisma_1 = require("../pergunta/pergunta.repository.prisma");
const prisma = new client_1.PrismaClient();
const repository = new pergunta_repository_prisma_1.PerguntaRepositoryPrisma(prisma);
(0, vitest_1.describe)('PerguntaRepositoryPrisma (Integration Tests)', () => {
    // =================================================================
    // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
    // =================================================================
    const PERGUNTA_ID_1 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
    const PERGUNTA_ID_2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const PERGUNTA_ID_3 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';
    (0, vitest_1.beforeEach)(async () => {
        // Limpeza do Banco ANTES DE CADA TESTE (na ordem correta)
        await prisma.perguntasOnFormularios.deleteMany({});
        await prisma.formulario.deleteMany({});
        await prisma.pergunta.deleteMany({});
        // Criação dos Dados Base (Perguntas) para testes de leitura
        await prisma.pergunta.create({ data: { id: PERGUNTA_ID_1, texto: 'Pergunta de Texto Existente', tipo: 'texto', ativo: true } });
        await prisma.pergunta.create({ data: { id: PERGUNTA_ID_2, texto: 'Pergunta de Nota Existente', tipo: 'nota', opcoes: ['1', '2', '3'], ativo: true } });
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.perguntasOnFormularios.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.$disconnect();
    });
    // =================================================================
    // TESTES
    // =================================================================
    (0, vitest_1.it)('deve inserir uma nova pergunta com sucesso', async () => {
        // DADO: uma nova entidade Pergunta criada no domínio
        const novaPergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Qual é a sua cor favorita?',
            tipo: 'multipla_escolha',
            opcoes: ['Azul', 'Verde'],
        });
        // QUANDO: o repositório insere a pergunta
        await repository.inserir(novaPergunta);
        // ENTÃO: a pergunta deve existir no banco com os dados corretos
        const perguntaSalva = await prisma.pergunta.findUnique({
            where: { id: novaPergunta.id },
        });
        (0, vitest_1.expect)(perguntaSalva).toBeDefined();
        (0, vitest_1.expect)(perguntaSalva?.id).toBe(novaPergunta.id);
        (0, vitest_1.expect)(perguntaSalva?.texto).toBe('Qual é a sua cor favorita?');
        (0, vitest_1.expect)(perguntaSalva?.opcoes).toEqual(['Azul', 'Verde']);
    });
    (0, vitest_1.it)('deve atualizar o texto de uma pergunta existente', async () => {
        // DADO: uma pergunta existente recuperada como entidade de domínio
        const perguntaParaAtualizar = await repository.recuperarPorUuid(PERGUNTA_ID_1);
        (0, vitest_1.expect)(perguntaParaAtualizar).toBeInstanceOf(pergunta_entity_1.Pergunta);
        // QUANDO: um método de domínio é chamado para alterar o estado
        perguntaParaAtualizar.atualizarTexto('Novo Texto da Pergunta');
        // E o repositório persiste a mudança
        await repository.atualizar(perguntaParaAtualizar);
        // ENTÃO: o estado no banco de dados deve refletir a mudança
        const perguntaDoDb = await prisma.pergunta.findUnique({
            where: { id: PERGUNTA_ID_1 },
        });
        (0, vitest_1.expect)(perguntaDoDb?.texto).toBe('Novo Texto da Pergunta');
    });
    (0, vitest_1.it)('deve inativar uma pergunta existente', async () => {
        const perguntaParaInativar = await repository.recuperarPorUuid(PERGUNTA_ID_1);
        (0, vitest_1.expect)(perguntaParaInativar?.ativo).toBe(true);
        perguntaParaInativar.inativar();
        await repository.atualizar(perguntaParaInativar);
        const perguntaDoDb = await prisma.pergunta.findUnique({
            where: { id: PERGUNTA_ID_1 },
        });
        (0, vitest_1.expect)(perguntaDoDb?.ativo).toBe(false);
        (0, vitest_1.expect)(perguntaDoDb?.dataExclusao).toBeInstanceOf(Date);
    });
    (0, vitest_1.it)('deve recuperar uma pergunta por ID', async () => {
        const perguntaRecuperada = await repository.recuperarPorUuid(PERGUNTA_ID_2);
        (0, vitest_1.expect)(perguntaRecuperada).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(perguntaRecuperada?.id).toBe(PERGUNTA_ID_2);
        (0, vitest_1.expect)(perguntaRecuperada?.tipo).toBe('nota');
    });
    (0, vitest_1.it)('deve buscar múltiplas perguntas por uma lista de IDs', async () => {
        const perguntasEncontradas = await repository.buscarMuitosPorId([
            PERGUNTA_ID_1,
            PERGUNTA_ID_2,
            'id-nao-existente',
        ]);
        (0, vitest_1.expect)(perguntasEncontradas).toHaveLength(2);
        (0, vitest_1.expect)(perguntasEncontradas.some(p => p.id === PERGUNTA_ID_1)).toBe(true);
        (0, vitest_1.expect)(perguntasEncontradas.some(p => p.id === PERGUNTA_ID_2)).toBe(true);
    });
    (0, vitest_1.it)('deve deletar uma pergunta e suas associações', async () => {
        // DADO: uma pergunta associada a um formulário
        await prisma.formulario.create({
            data: {
                id: 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5',
                titulo: 'Formulário de teste',
                descricao: 'teste para o form',
                ativo: true,
                perguntas: { create: [{ ordemNaLista: 0, pergunta: { connect: { id: PERGUNTA_ID_1 } } }] }
            }
        });
        let countAssociacoes = await prisma.perguntasOnFormularios.count({ where: { perguntaId: PERGUNTA_ID_1 } });
        (0, vitest_1.expect)(countAssociacoes).toBe(1);
        // QUANDO: o método deletar é chamado
        await repository.deletar(PERGUNTA_ID_1);
        // ENTÃO: a pergunta e suas associações não devem mais existir
        const perguntaDeletada = await prisma.pergunta.findUnique({ where: { id: PERGUNTA_ID_1 } });
        countAssociacoes = await prisma.perguntasOnFormularios.count({ where: { perguntaId: PERGUNTA_ID_1 } });
        (0, vitest_1.expect)(perguntaDeletada).toBeNull();
        (0, vitest_1.expect)(countAssociacoes).toBe(0);
    });
    (0, vitest_1.it)('deve verificar corretamente se uma pergunta existe', async () => {
        const existe = await repository.existe(PERGUNTA_ID_1);
        const naoExiste = await repository.existe('id-nao-existente');
        (0, vitest_1.expect)(existe).toBe(true);
        (0, vitest_1.expect)(naoExiste).toBe(false);
    });
});
//# sourceMappingURL=pergunta.repository.spec.js.map