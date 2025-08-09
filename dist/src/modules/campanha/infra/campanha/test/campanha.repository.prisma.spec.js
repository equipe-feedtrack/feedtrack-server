"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const campanha_repository_prisma_1 = require("../campanha.repository.prisma");
const campanha_entity_1 = require("@modules/campanha/domain/campanha.entity");
const campanha_types_1 = require("@modules/campanha/domain/campanha.types");
const prisma = new client_1.PrismaClient();
const repository = new campanha_repository_prisma_1.CampanhaRepositoryPrisma(prisma);
(0, vitest_1.describe)('CampanhaRepositoryPrisma (Integration Tests)', () => {
    // =================================================================
    // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
    // =================================================================
    const FORMULARIO_ID_1 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
    const FORMULARIO_ID_2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const CAMPANHA_ID_1 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';
    (0, vitest_1.beforeEach)(async () => {
        // Limpeza do Banco ANTES DE CADA TESTE (na ordem correta)
        await prisma.campanha.deleteMany({});
        await prisma.perguntasOnFormularios.deleteMany({});
        await prisma.formulario.deleteMany({});
        // Criação dos Dados Base (Formulários)
        await prisma.formulario.createMany({
            data: [
                { id: FORMULARIO_ID_1, titulo: 'Formulário Campanha 1', descricao: '', ativo: true },
                { id: FORMULARIO_ID_2, titulo: 'Formulário Campanha 2', descricao: '', ativo: true },
            ],
        });
        // Criação de uma Campanha já existente para testes de leitura e atualização
        await prisma.campanha.create({
            data: {
                id: CAMPANHA_ID_1,
                titulo: 'Campanha Existente',
                descricao: 'Descrição original',
                tipoCampanha: 'SATISFACAO',
                segmentoAlvo: 'TODOS_CLIENTES',
                dataInicio: new Date('2025-01-01T00:00:00Z'),
                templateMensagem: 'Template V1',
                formularioId: FORMULARIO_ID_1,
                ativo: true
            }
        });
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.campanha.deleteMany({});
        await prisma.perguntasOnFormularios.deleteMany({});
        await prisma.formulario.deleteMany({});
        await prisma.$disconnect();
    });
    // =================================================================
    // TESTES
    // =================================================================
    (0, vitest_1.it)('deve inserir uma nova campanha com sucesso', async () => {
        // DADO: uma nova entidade Campanha criada no domínio
        const novaCampanha = campanha_entity_1.Campanha.criar({
            titulo: 'Campanha de Boas-Vindas',
            tipoCampanha: campanha_types_1.TipoCampanha.AUTOMATICO,
            segmentoAlvo: campanha_types_1.SegmentoAlvo.NOVOS_CLIENTES,
            dataFim: null,
            dataInicio: new Date('2025-01-01T00:00:00Z'),
            templateMensagem: 'Bem-vindo, {{nome}}!',
            formularioId: FORMULARIO_ID_1,
            canalEnvio: campanha_types_1.CanalEnvio.WHATSAPP
        });
        // QUANDO: o repositório insere a campanha
        await repository.inserir(novaCampanha);
        // ENTÃO: a campanha deve existir no banco com os dados corretos
        const campanhaSalva = await prisma.campanha.findUnique({
            where: { id: novaCampanha.id },
        });
        (0, vitest_1.expect)(campanhaSalva).toBeDefined();
        (0, vitest_1.expect)(campanhaSalva?.id).toBe(novaCampanha.id);
        (0, vitest_1.expect)(campanhaSalva?.titulo).toBe('Campanha de Boas-Vindas');
        (0, vitest_1.expect)(campanhaSalva?.formularioId).toBe(FORMULARIO_ID_1);
    });
    (0, vitest_1.it)('deve atualizar uma campanha existente', async () => {
        // DADO: uma campanha existente recuperada como entidade de domínio
        const campanhaParaAtualizar = await repository.recuperarPorUuid(CAMPANHA_ID_1);
        (0, vitest_1.expect)(campanhaParaAtualizar).toBeInstanceOf(campanha_entity_1.Campanha);
        // QUANDO: métodos de domínio são chamados para alterar o estado
        campanhaParaAtualizar.atualizarTemplate('Template V2 Atualizado');
        campanhaParaAtualizar.desativar();
        // E o repositório persiste a mudança
        await repository.atualizar(campanhaParaAtualizar);
        // ENTÃO: o estado no banco de dados deve refletir a mudança
        const campanhaDoDb = await prisma.campanha.findUnique({
            where: { id: CAMPANHA_ID_1 },
        });
        (0, vitest_1.expect)(campanhaDoDb?.templateMensagem).toBe('Template V2 Atualizado');
        (0, vitest_1.expect)(campanhaDoDb?.ativo).toBe(false);
        (0, vitest_1.expect)(campanhaDoDb?.dataExclusao).toBeInstanceOf(Date);
    });
    (0, vitest_1.it)('deve recuperar uma campanha por ID', async () => {
        const campanhaRecuperada = await repository.recuperarPorUuid(CAMPANHA_ID_1);
        (0, vitest_1.expect)(campanhaRecuperada).toBeInstanceOf(campanha_entity_1.Campanha);
        (0, vitest_1.expect)(campanhaRecuperada?.id).toBe(CAMPANHA_ID_1);
        (0, vitest_1.expect)(campanhaRecuperada?.titulo).toBe('Campanha Existente');
    });
    (0, vitest_1.it)('deve listar todas as campanhas', async () => {
        // DADO: uma campanha extra inserida
        const campanhaExtra = campanha_entity_1.Campanha.criar({
            titulo: 'Campanha Extra',
            tipoCampanha: campanha_types_1.TipoCampanha.PROMOCIONAL,
            segmentoAlvo: campanha_types_1.SegmentoAlvo.CLIENTES_PREMIUM,
            dataFim: null,
            dataInicio: new Date(),
            templateMensagem: 'Promo!',
            formularioId: FORMULARIO_ID_2,
            canalEnvio: campanha_types_1.CanalEnvio.WHATSAPP
        });
        await repository.inserir(campanhaExtra);
        // QUANDO: o método listar é chamado
        const campanhas = await repository.listar();
        // ENTÃO: a lista deve conter todas as campanhas
        (0, vitest_1.expect)(campanhas).toHaveLength(2);
        (0, vitest_1.expect)(campanhas.some(c => c.id === CAMPANHA_ID_1)).toBe(true);
        (0, vitest_1.expect)(campanhas.some(c => c.id === campanhaExtra.id)).toBe(true);
    });
    (0, vitest_1.it)('deve deletar uma campanha', async () => {
        let campanha = await prisma.campanha.findUnique({ where: { id: CAMPANHA_ID_1 } });
        (0, vitest_1.expect)(campanha).not.toBeNull();
        await repository.deletar(CAMPANHA_ID_1);
        campanha = await prisma.campanha.findUnique({ where: { id: CAMPANHA_ID_1 } });
        (0, vitest_1.expect)(campanha).toBeNull();
    });
    (0, vitest_1.it)('deve verificar corretamente se uma campanha existe', async () => {
        const existe = await repository.existe(CAMPANHA_ID_1);
        const naoExiste = await repository.existe('id-nao-existente');
        (0, vitest_1.expect)(existe).toBe(true);
        (0, vitest_1.expect)(naoExiste).toBe(false);
    });
});
//# sourceMappingURL=campanha.repository.prisma.spec.js.map