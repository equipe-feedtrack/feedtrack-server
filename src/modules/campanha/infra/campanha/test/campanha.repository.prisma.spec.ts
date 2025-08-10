import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import { CampanhaRepositoryPrisma } from '../campanha.repository.prisma';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { CanalEnvio, SegmentoAlvo, TipoCampanha } from '@modules/campanha/domain/campanha.types';

const prisma = new PrismaClient();
const repository = new CampanhaRepositoryPrisma(prisma);

describe('CampanhaRepositoryPrisma (Integration Tests)', () => {
  // =================================================================
  // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
  // =================================================================
  const FORMULARIO_ID_1 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
  const FORMULARIO_ID_2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const CAMPANHA_ID_1 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';

  beforeEach(async () => {
      // Limpeza na ordem inversa das dependências
    await prisma.feedback.deleteMany();
    await prisma.envioFormulario.deleteMany();
    // Continue com as outras tabelas-filhas
    // ...

    // Deleta as tabelas-pai
    await prisma.campanha.deleteMany();
    await prisma.formulario.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();

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

  afterAll(async () => {
    await prisma.campanha.deleteMany({});
    await prisma.perguntasOnFormularios.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.$disconnect();
  });

  // =================================================================
  // TESTES
  // =================================================================

  it('deve inserir uma nova campanha com sucesso', async () => {
    // DADO: uma nova entidade Campanha criada no domínio
    const novaCampanha = Campanha.criar({
      titulo: 'Campanha de Boas-Vindas',
      tipoCampanha: TipoCampanha.AUTOMATICO,
      segmentoAlvo: SegmentoAlvo.NOVOS_CLIENTES,
      dataFim: null,
      dataInicio: new Date('2025-01-01T00:00:00Z'),
      templateMensagem: 'Bem-vindo, {{nome}}!',
      formularioId: FORMULARIO_ID_1,
      canalEnvio: CanalEnvio.WHATSAPP
    });

    // QUANDO: o repositório insere a campanha
    await repository.inserir(novaCampanha);

    // ENTÃO: a campanha deve existir no banco com os dados corretos
    const campanhaSalva = await prisma.campanha.findUnique({
      where: { id: novaCampanha.id },
    });

    expect(campanhaSalva).toBeDefined();
    expect(campanhaSalva?.id).toBe(novaCampanha.id);
    expect(campanhaSalva?.titulo).toBe('Campanha de Boas-Vindas');
    expect(campanhaSalva?.formularioId).toBe(FORMULARIO_ID_1);
  });

  it('deve atualizar uma campanha existente', async () => {
    // DADO: uma campanha existente recuperada como entidade de domínio
    const campanhaParaAtualizar = await repository.recuperarPorUuid(CAMPANHA_ID_1);
    expect(campanhaParaAtualizar).toBeInstanceOf(Campanha);

    // QUANDO: métodos de domínio são chamados para alterar o estado
    campanhaParaAtualizar!.atualizarTemplate('Template V2 Atualizado');
    campanhaParaAtualizar!.desativar();
    
    // E o repositório persiste a mudança
    await repository.atualizar(campanhaParaAtualizar!);

    // ENTÃO: o estado no banco de dados deve refletir a mudança
    const campanhaDoDb = await prisma.campanha.findUnique({
      where: { id: CAMPANHA_ID_1 },
    });
    expect(campanhaDoDb?.templateMensagem).toBe('Template V2 Atualizado');
    expect(campanhaDoDb?.ativo).toBe(false);
    expect(campanhaDoDb?.dataExclusao).toBeInstanceOf(Date);
  });

  it('deve recuperar uma campanha por ID', async () => {
    const campanhaRecuperada = await repository.recuperarPorUuid(CAMPANHA_ID_1);

    expect(campanhaRecuperada).toBeInstanceOf(Campanha);
    expect(campanhaRecuperada?.id).toBe(CAMPANHA_ID_1);
    expect(campanhaRecuperada?.titulo).toBe('Campanha Existente');
  });

  it('deve listar todas as campanhas', async () => {
    // DADO: uma campanha extra inserida
    const campanhaExtra = Campanha.criar({
        titulo: 'Campanha Extra',
        tipoCampanha: TipoCampanha.PROMOCIONAL,
        segmentoAlvo: SegmentoAlvo.CLIENTES_PREMIUM,
        dataFim: null,
        dataInicio: new Date(),
        templateMensagem: 'Promo!',
        formularioId: FORMULARIO_ID_2,
        canalEnvio: CanalEnvio.WHATSAPP
    });
    await repository.inserir(campanhaExtra);

    // QUANDO: o método listar é chamado
    const campanhas = await repository.listar();

    // ENTÃO: a lista deve conter todas as campanhas
    expect(campanhas).toHaveLength(2);
    expect(campanhas.some(c => c.id === CAMPANHA_ID_1)).toBe(true);
    expect(campanhas.some(c => c.id === campanhaExtra.id)).toBe(true);
  });

  it('deve deletar uma campanha', async () => {
    let campanha = await prisma.campanha.findUnique({ where: { id: CAMPANHA_ID_1 } });
    expect(campanha).not.toBeNull();

    await repository.deletar(CAMPANHA_ID_1);

    campanha = await prisma.campanha.findUnique({ where: { id: CAMPANHA_ID_1 } });
    expect(campanha).toBeNull();
  });

  it('deve verificar corretamente se uma campanha existe', async () => {
    const existe = await repository.existe(CAMPANHA_ID_1);
    const naoExiste = await repository.existe('id-nao-existente');

    expect(existe).toBe(true);
    expect(naoExiste).toBe(false);
  });
});
