import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import { CampanhaRepositoryPrisma } from '../campanha.repository.prisma'; // Ajuste o caminho
import { Campanha } from '@modules/campanha/domain/campanha.entity'; // Ajuste o caminho

import { randomUUID } from 'crypto';
import { SegmentoAlvo, TipoCampanha } from '@modules/campanha/domain/campanha.types';

const prisma = new PrismaClient();
const repository = new CampanhaRepositoryPrisma(prisma);

describe('CampanhaRepositoryPrisma (Integration Tests)', () => {
  // IDs de Formulários que a Campanha irá referenciar (Chaves Estrangeiras)
  const FORMULARIO_ID_CAMPANHA_1 = randomUUID();
  const FORMULARIO_ID_CAMPANHA_2 = randomUUID();

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    // Ordem de exclusão é importante devido a chaves estrangeiras: Campanha depende de Formulário
    await prisma.$transaction([
      prisma.campanha.deleteMany({}),
      prisma.formulario.deleteMany({}), // Limpa formulários também
    ]);

    // CRIAÇÃO DE FORMULÁRIOS NECESSÁRIOS PARA OS TESTES DE CAMPANHA (FK)
    await prisma.formulario.createMany({
      data: [
        { id: FORMULARIO_ID_CAMPANHA_1, texto: 'Form Campanha 1', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() },
        { id: FORMULARIO_ID_CAMPANHA_2, texto: 'Form Campanha 2', descricao: '', ativo: true, data_criacao: new Date(), data_atualizacao: new Date() },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Testes para o método 'inserir' ---
  it('deve inserir uma nova campanha completa com sucesso', async () => {
    const campanha = Campanha.criar({
      titulo: 'Campanha de Boas-Vindas',
      descricao: 'Mensagem para novos clientes',
      tipoCampanha: TipoCampanha.AUTOMATICO,
      segmentoAlvo: SegmentoAlvo.NOVOS_CLIENTES,
      dataInicio: new Date('2025-01-01T00:00:00Z'),
      dataFim: new Date('2025-12-31T23:59:59Z'),
      templateMensagem: 'Bem-vindo, {{nome}}!',
      formularioId: FORMULARIO_ID_CAMPANHA_1, // Referencia um formulário existente
    });

    await repository.inserir(campanha);

    const campanhaSalva = await prisma.campanha.findUnique({
      where: { id: campanha.id },
    });

    expect(campanhaSalva).toBeDefined();
    expect(campanhaSalva?.id).toBe(campanha.id);
    expect(campanhaSalva?.titulo).toBe(campanha.titulo);
    expect(campanhaSalva?.tipo_campanha).toBe(campanha.tipoCampanha); // snake_case no DB
    expect(campanhaSalva?.segmento_alvo).toBe(campanha.segmentoAlvo); // snake_case no DB
    expect(campanhaSalva?.formularioId).toBe(campanha.formularioId);
    expect(campanhaSalva?.ativo).toBe(true);
    expect(campanhaSalva?.data_criacao).toBeInstanceOf(Date);
  });

  it('deve inserir uma nova campanha sem descrição e sem data fim', async () => {
    const campanha = Campanha.criar({
      titulo: 'Campanha de Lançamento',
      descricao: undefined,
      tipoCampanha: TipoCampanha.PROMOCIONAL,
      segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
      dataInicio: new Date('2025-02-01T00:00:00Z'),
      dataFim: undefined,
      templateMensagem: 'Confira nosso novo produto!',
      formularioId: FORMULARIO_ID_CAMPANHA_2,
    });

    await repository.inserir(campanha);

    const campanhaSalva = await prisma.campanha.findUnique({
      where: { id: campanha.id },
    });

    expect(campanhaSalva?.descricao).toBeNull(); // undefined na entidade -> null no DB
    expect(campanhaSalva?.data_fim).toBeNull();   // undefined na entidade -> null no DB
  });

  it('deve atualizar uma campanha existente', async () => {
    const campanhaOriginal = Campanha.criar({
      titulo: 'Campanha Antiga',
      descricao: 'Descrição original',
      tipoCampanha: TipoCampanha.SATISFACAO,
      segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
      dataInicio: new Date('2025-01-01T00:00:00Z'),
      dataFim: null,
      templateMensagem: 'Template V1',
      formularioId: FORMULARIO_ID_CAMPANHA_1,
    });
    await repository.inserir(campanhaOriginal);

    // Modifica a entidade de domínio
    campanhaOriginal.atualizarTemplate('Template V2 de Teste');
    campanhaOriginal.desativar(); // Muda o status
    campanhaOriginal.atualizarPeriodo(new Date('2025-01-15T00:00:00Z'), new Date('2025-01-30T23:59:59Z'));
    campanhaOriginal['dataAtualizacao'] = new Date(Date.now() + 1000); // Garante que a data é diferente

    await repository.inserir(campanhaOriginal); // Persiste as mudanças (upsert como update)

    const campanhaAtualizada = await prisma.campanha.findUnique({
      where: { id: campanhaOriginal.id },
    });

    expect(campanhaAtualizada).toBeDefined();
    expect(campanhaAtualizada?.titulo).toBe(campanhaOriginal.titulo); // Título não mudou
    expect(campanhaAtualizada?.template_mensagem).toBe('Template V2 de Teste');
    expect(campanhaAtualizada?.ativo).toBe(false);
    expect(campanhaAtualizada?.data_inicio).toEqual(campanhaOriginal.dataInicio);
    expect(campanhaAtualizada?.data_fim).toEqual(campanhaOriginal.dataFim);
    expect(campanhaAtualizada?.data_atualizacao?.getTime()).toBeGreaterThan(
      campanhaOriginal.dataCriacao.getTime(),
    );
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar uma campanha existente por ID', async () => {
    const campanha = Campanha.criar({
      titulo: 'Campanha para Recuperar',
      tipoCampanha: TipoCampanha.POS_COMPRA,
      segmentoAlvo: SegmentoAlvo.CLIENTES_REGULARES,
      dataInicio: new Date('2025-01-01T00:00:00Z'),
      templateMensagem: 'Recuperar Teste',
      formularioId: FORMULARIO_ID_CAMPANHA_1,
    });
    await repository.inserir(campanha);

    const campanhaRecuperada = await repository.recuperarPorUuid(campanha.id);

    expect(campanhaRecuperada).toBeInstanceOf(Campanha);
    expect(campanhaRecuperada?.id).toBe(campanha.id);
    expect(campanhaRecuperada?.titulo).toBe(campanha.titulo);
    expect(campanhaRecuperada?.tipoCampanha).toBe(campanha.tipoCampanha);
    expect(campanhaRecuperada?.segmentoAlvo).toBe(campanha.segmentoAlvo);
    expect(campanhaRecuperada?.formularioId).toBe(campanha.formularioId);
    expect(campanhaRecuperada?.ativo).toBe(true);
    expect(campanhaRecuperada?.dataCriacao.toISOString()).toBe(campanha.dataCriacao.toISOString());
  });

  it('deve retornar null se a campanha não for encontrada por ID', async () => {
    const campanhaRecuperada = await repository.recuperarPorUuid('id-nao-existente');
    expect(campanhaRecuperada).toBeNull();
  });

  // ... (Você pode adicionar mais testes para listar, existe, deletar conforme implementar)
});