import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import { FormularioRepositoryPrisma } from '../formulario/formulario.repository.prisma';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';

const prisma = new PrismaClient();
const repository = new FormularioRepositoryPrisma(prisma);

describe('FormularioRepositoryPrisma (Integration Tests)', () => {
  // =================================================================
  // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
  // =================================================================
  const PERGUNTA_ID_1 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
  const PERGUNTA_ID_2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const FORMULARIO_ID_1 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';

  let perguntaDb1: Pergunta;
  let perguntaDb2: Pergunta;

  beforeEach(async () => {
    // 1. Limpeza do Banco ANTES DE CADA TESTE (na ordem correta)
    await prisma.perguntasOnFormularios.deleteMany({});
    await prisma.formulario.deleteMany({})
    await prisma.pergunta.deleteMany({});

    // 2. Criação dos Dados Base (Perguntas)
    await prisma.pergunta.createMany({
      data: [
        { id: PERGUNTA_ID_1, texto: 'Qual sua satisfação com o atendimento?', tipo: 'texto', ativo: true },
        { id: PERGUNTA_ID_2, texto: 'Você recomendaria nosso serviço?', tipo: 'multipla_escolha', opcoes: ['Sim', 'Não'], ativo: true },
      ],
    });

    // 3. Criação de um Formulário já existente para testes de leitura e atualização
    await prisma.formulario.create({
      data: {
        id: FORMULARIO_ID_1,
        titulo: 'Formulário de Feedback Inicial',
        descricao: 'Coleta de feedback sobre o serviço.',
        ativo: true,
        perguntas: {
          create: [
            { ordemNaLista: 0, pergunta: { connect: { id: PERGUNTA_ID_1 } } },
          ],
        },
      },
    });

    // 4. Recupera as entidades para usar nos testes
    const p1 = await prisma.pergunta.findUnique({ where: { id: PERGUNTA_ID_1 } });
    const p2 = await prisma.pergunta.findUnique({ where: { id: PERGUNTA_ID_2 } });
    if (p1 && p2) {
      perguntaDb1 = Pergunta.recuperar(p1 as any);
      perguntaDb2 = Pergunta.recuperar(p2 as any);
    }
  });

  afterAll(async () => {
    // Limpeza final e desconexão
    await prisma.perguntasOnFormularios.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.pergunta.deleteMany({});
    await prisma.$disconnect();
  });

  // =================================================================
  // TESTES
  // =================================================================

  it('deve inserir um novo formulário e conectar perguntas existentes', async () => {
    // DADO: uma nova entidade Formulario criada no domínio
    const novoFormulario = Formulario.criar({
      titulo: 'Novo Formulário de Contato',
      descricao: 'Formulário para contato geral.',
      ativo: true,
      perguntas: [perguntaDb1, perguntaDb2],
    });

    // QUANDO: o repositório insere o formulário
    await repository.inserir(novoFormulario);

    // ENTÃO: o formulário deve existir no banco com suas perguntas conectadas
    const formularioSalvo = await prisma.formulario.findUnique({
      where: { id: novoFormulario.id },
      include: { perguntas: { include: { pergunta: true } } },
    });

    expect(formularioSalvo).toBeDefined();
    expect(formularioSalvo?.id).toBe(novoFormulario.id);
    expect(formularioSalvo?.perguntas).toHaveLength(2);
    expect(formularioSalvo?.perguntas.some(item => item.pergunta.id === PERGUNTA_ID_1)).toBe(true);
  });

  it('deve recuperar um formulário por ID, incluindo suas perguntas na ordem correta', async () => {
    // QUANDO: o repositório recupera o formulário
    const formularioRecuperado = await repository.recuperarPorUuid(FORMULARIO_ID_1);

    // ENTÃO: a entidade de domínio deve ser retornada corretamente
    expect(formularioRecuperado).toBeInstanceOf(Formulario);
    expect(formularioRecuperado?.id).toBe(FORMULARIO_ID_1);
    expect(formularioRecuperado?.titulo).toBe('Formulário de Feedback Inicial');
    expect(formularioRecuperado?.perguntas).toHaveLength(1);
    expect(formularioRecuperado?.perguntas[0].id).toBe(PERGUNTA_ID_1);
  });

  it('deve atualizar os dados de um formulário e sua lista de perguntas', async () => {
    // DADO: uma entidade de formulário recuperada do banco
    const formularioParaAtualizar = await repository.recuperarPorUuid(FORMULARIO_ID_1);
    expect(formularioParaAtualizar).toBeDefined();

    // QUANDO: métodos de domínio são chamados para alterar o estado
    formularioParaAtualizar!.atualizarTitulo('Título Atualizado');
    formularioParaAtualizar!.removerPergunta(PERGUNTA_ID_1);
    formularioParaAtualizar!.adicionarPergunta(perguntaDb2);
    
    // E o repositório atualiza o formulário
    await repository.atualizar(formularioParaAtualizar!);

    // ENTÃO: o estado no banco de dados deve refletir as mudanças
    const formularioDoDb = await prisma.formulario.findUnique({
      where: { id: FORMULARIO_ID_1 },
      include: { perguntas: { include: { pergunta: true } } },
    });

    expect(formularioDoDb?.titulo).toBe('Título Atualizado');
    expect(formularioDoDb?.perguntas).toHaveLength(1);
    expect(formularioDoDb?.perguntas[0].pergunta.id).toBe(PERGUNTA_ID_2);
  });

  it('deve deletar um formulário e suas associações', async () => {
    // DADO: o ID de um formulário existente
    const idParaDeletar = FORMULARIO_ID_1;
    let countAssociacoes = await prisma.perguntasOnFormularios.count({ where: { formularioId: idParaDeletar } });
    expect(countAssociacoes).toBe(1);

    // QUANDO: o método deletar é chamado
    await repository.deletar(idParaDeletar);

    // ENTÃO: o formulário e suas associações não devem mais existir
    const formularioDeletado = await prisma.formulario.findUnique({ where: { id: idParaDeletar } });
    countAssociacoes = await prisma.perguntasOnFormularios.count({ where: { formularioId: idParaDeletar } });
    
    expect(formularioDeletado).toBeNull();
    expect(countAssociacoes).toBe(0);
  });
});
