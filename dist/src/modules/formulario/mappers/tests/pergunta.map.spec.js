"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infra/database/prisma/repositories/__tests__/pergunta.repository.spec.ts
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/domain/pergunta.entity");
const pergunta_repository_prisma_1 = require("@modules/formulario/infra/pergunta/pergunta.repository.prisma");
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const prisma = new client_1.PrismaClient();
const repository = new pergunta_repository_prisma_1.PerguntaRepositoryPrisma(prisma);
(0, vitest_1.describe)('PerguntaRepositoryPrisma (Integration Tests)', () => {
    (0, vitest_1.beforeEach)(async () => {
        await prisma.$transaction([
            prisma.formulario.deleteMany({}), // Também limpa formulários, pois pergunta pode estar relacionada
            prisma.pergunta.deleteMany({}),
        ]);
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.$disconnect();
    });
    (0, vitest_1.it)('deve inserir uma nova pergunta do tipo texto com sucesso', async () => {
        // Para testar corretamente a relação, crie um formulário de exemplo no banco.
        // Ou, se a foreign key for `String?` (opcional), você pode inserir sem ela.
        const formularioMockId = 'form-xyz-001';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Qual é o seu feedback sobre o produto?',
            tipo: 'texto',
            formularioId: formularioMockId, // Agora usando o ID do formulário criado
        });
        await repository.inserir(pergunta);
        const perguntaSalva = await prisma.pergunta.findUnique({
            where: { id: pergunta.id },
        });
        (0, vitest_1.expect)(perguntaSalva).toBeDefined();
        (0, vitest_1.expect)(perguntaSalva?.id).toBe(pergunta.id);
        (0, vitest_1.expect)(perguntaSalva?.texto).toBe(pergunta.texto);
        (0, vitest_1.expect)(perguntaSalva?.tipo).toBe(pergunta.tipo);
        (0, vitest_1.expect)(perguntaSalva?.opcoes).toBeNull();
        (0, vitest_1.expect)(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- CORRIGIDO AQUI: formularioId
        (0, vitest_1.expect)(perguntaSalva?.data_criacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(perguntaSalva?.data_atualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(perguntaSalva?.data_exclusao).toBeNull();
    });
    (0, vitest_1.it)('deve inserir uma nova pergunta do tipo multipla_escolha com opções', async () => {
        const formularioMockId = 'form-abc-002';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste 2', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Quais são suas cores favoritas?',
            tipo: 'multipla_escolha',
            opcoes: ['azul', 'verde', 'vermelho'],
            formularioId: formularioMockId,
        });
        await repository.inserir(pergunta);
        const perguntaSalva = await prisma.pergunta.findUnique({
            where: { id: pergunta.id },
        });
        (0, vitest_1.expect)(perguntaSalva).toBeDefined();
        (0, vitest_1.expect)(perguntaSalva?.id).toBe(pergunta.id);
        (0, vitest_1.expect)(perguntaSalva?.tipo).toBe('multipla_escolha');
        (0, vitest_1.expect)(perguntaSalva?.opcoes).toEqual(['azul', 'verde', 'vermelho']);
        (0, vitest_1.expect)(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- CORRIGIDO AQUI: formularioId
    });
    (0, vitest_1.it)('deve inserir uma nova pergunta do tipo nota com opções padrão', async () => {
        const formularioMockId = 'form-def-003';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste 3', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Dê uma nota.',
            tipo: 'nota',
            opcoes: undefined,
            formularioId: formularioMockId,
        });
        await repository.inserir(pergunta);
        const perguntaSalva = await prisma.pergunta.findUnique({
            where: { id: pergunta.id },
        });
        (0, vitest_1.expect)(perguntaSalva).toBeDefined();
        (0, vitest_1.expect)(perguntaSalva?.id).toBe(pergunta.id);
        (0, vitest_1.expect)(perguntaSalva?.tipo).toBe('nota');
        (0, vitest_1.expect)(perguntaSalva?.opcoes).toEqual(['1', '2', '3', '4', '5']);
        (0, vitest_1.expect)(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- CORRIGIDO AQUI: formularioId
    });
    (0, vitest_1.it)('deve atualizar uma pergunta existente usando upsert', async () => {
        const formularioMockId = 'form-update-test';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste 4', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const perguntaOriginal = pergunta_entity_1.Pergunta.criar({
            texto: 'Texto original',
            tipo: 'texto',
            formularioId: formularioMockId,
        });
        await repository.inserir(perguntaOriginal);
        const novoFormularioMockId = 'form-update-test-2';
        await prisma.formulario.create({ data: { id: novoFormularioMockId, texto: 'Form Teste 5', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        perguntaOriginal.vincularFormulario(novoFormularioMockId);
        perguntaOriginal['dataAtualizacao'] = new Date(Date.now() + 1000);
        await repository.inserir(perguntaOriginal);
        const perguntaAtualizada = await prisma.pergunta.findUnique({
            where: { id: perguntaOriginal.id },
        });
        (0, vitest_1.expect)(perguntaAtualizada).toBeDefined();
        (0, vitest_1.expect)(perguntaAtualizada?.formularioId).toBe(novoFormularioMockId); // <-- CORRIGIDO AQUI: formularioId
        (0, vitest_1.expect)(perguntaAtualizada?.data_atualizacao?.getTime()).toBeGreaterThanOrEqual(perguntaOriginal.dataCriacao.getTime());
        (0, vitest_1.expect)(perguntaAtualizada?.data_atualizacao?.getTime()).toBe(perguntaOriginal.dataAtualizacao.getTime());
    });
    (0, vitest_1.it)('deve atualizar uma pergunta para o estado inativo', async () => {
        const formularioMockId = 'form-inativar-repo';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste 6', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const perguntaAtiva = pergunta_entity_1.Pergunta.criar({
            texto: 'Pergunta para inativar',
            tipo: 'texto',
            formularioId: formularioMockId,
        });
        await repository.inserir(perguntaAtiva);
        perguntaAtiva.inativar();
        await repository.inserir(perguntaAtiva);
        const perguntaInativa = await prisma.pergunta.findUnique({
            where: { id: perguntaAtiva.id },
        });
        (0, vitest_1.expect)(perguntaInativa).toBeDefined();
        (0, vitest_1.expect)(perguntaInativa?.data_exclusao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(perguntaInativa?.data_atualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(perguntaInativa?.formularioId).toBe(perguntaAtiva.formularioId); // <-- CORRIGIDO AQUI: formularioId
    });
    (0, vitest_1.it)('deve recuperar uma pergunta existente por ID', async () => {
        const formularioMockId = 'form-recuperar';
        await prisma.formulario.create({ data: { id: formularioMockId, texto: 'Form Teste 7', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() } });
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: 'Pergunta para recuperação',
            tipo: 'nota',
            formularioId: formularioMockId,
        });
        await repository.inserir(pergunta);
        const perguntaRecuperada = await repository.recuperarPorUuid(pergunta.id);
        (0, vitest_1.expect)(perguntaRecuperada).toBeInstanceOf(pergunta_entity_1.Pergunta);
        (0, vitest_1.expect)(perguntaRecuperada?.id).toBe(pergunta.id);
        (0, vitest_1.expect)(perguntaRecuperada?.texto).toBe(pergunta.texto);
        (0, vitest_1.expect)(perguntaRecuperada?.tipo).toBe(pergunta.tipo);
        (0, vitest_1.expect)(perguntaRecuperada?.opcoes).toEqual(['1', '2', '3', '4', '5']);
        (0, vitest_1.expect)(perguntaRecuperada?.formularioId).toBe(pergunta.formularioId);
        (0, vitest_1.expect)(perguntaRecuperada?.dataCriacao.toISOString()).toBe(pergunta.dataCriacao.toISOString());
        (0, vitest_1.expect)(perguntaRecuperada?.dataAtualizacao.toISOString()).toBe(pergunta.dataAtualizacao.toISOString());
        (0, vitest_1.expect)(perguntaRecuperada?.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve retornar null se a pergunta não for encontrada por ID', async () => {
        const perguntaRecuperada = await repository.recuperarPorUuid('id-inexistente');
        (0, vitest_1.expect)(perguntaRecuperada).toBeNull();
    });
    (0, vitest_1.it)('deve buscar múltiplas perguntas por uma lista de IDs', async () => {
        const formulario1Id = 'f1';
        const formulario2Id = 'f2';
        await prisma.formulario.createMany({
            data: [
                { id: formulario1Id, texto: 'F1', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() },
                { id: formulario2Id, texto: 'F2', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() },
            ]
        });
        const pergunta1 = pergunta_entity_1.Pergunta.criar({ texto: 'P1', tipo: 'texto', formularioId: formulario1Id });
        const pergunta2 = pergunta_entity_1.Pergunta.criar({ texto: 'P2', tipo: 'nota', formularioId: formulario1Id });
        const pergunta3 = pergunta_entity_1.Pergunta.criar({ texto: 'P3', tipo: 'multipla_escolha', opcoes: ['a', 'b'], formularioId: formulario2Id });
        await repository.inserir(pergunta1);
        await repository.inserir(pergunta2);
        await repository.inserir(pergunta3);
        const perguntasEncontradas = await repository.buscarMuitosPorId([
            pergunta1.id,
            pergunta3.id,
            'id-nao-existente',
        ]);
        (0, vitest_1.expect)(perguntasEncontradas).toHaveLength(2);
        (0, vitest_1.expect)(perguntasEncontradas.some((p) => p.id === pergunta1.id)).toBe(true);
        (0, vitest_1.expect)(perguntasEncontradas.some((p) => p.id === pergunta3.id)).toBe(true);
        (0, vitest_1.expect)(perguntasEncontradas.some((p) => p.id === pergunta2.id)).toBe(false);
    });
    (0, vitest_1.it)('deve retornar um array vazio se nenhum ID for encontrado em buscarMuitosPorId', async () => {
        const perguntasEncontradas = await repository.buscarMuitosPorId([
            'id-nao-existente-1',
            'id-nao-existente-2',
        ]);
        (0, vitest_1.expect)(perguntasEncontradas).toHaveLength(0);
    });
});
//# sourceMappingURL=pergunta.map.spec.js.map