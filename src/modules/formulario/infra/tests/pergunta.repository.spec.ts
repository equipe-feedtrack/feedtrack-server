import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import { PerguntaRepositoryPrisma } from '../pergunta/pergunta.repository.prisma';
import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';

const prisma = new PrismaClient();
const repository = new PerguntaRepositoryPrisma(prisma);

describe('PerguntaRepositoryPrisma (Integration Tests com o banco)', () => {
  beforeEach(async () => {
    // Limpa apenas as perguntas antes de cada teste.
    // Formulários são gerenciados separadamente ou no FormularioRepositoryTests.
    await prisma.pergunta.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Testes para o método 'inserir' ---
  it('deve inserir uma nova pergunta do tipo texto com sucesso (N-N)', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual é o seu feedback sobre o produto?',
      tipo: 'texto',
      opcoes: undefined,
      // N-N: Não se passa formularioId diretamente para a Pergunta na criação
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.texto).toBe(pergunta.texto);
    expect(perguntaSalva?.tipo).toBe(pergunta.tipo);
    expect(perguntaSalva?.opcoes).toBeNull(); // Tipo texto não tem opções no DB
    expect(perguntaSalva?.ativo).toBe(true); // 'ativo' é padrão no DB e na entidade
    expect(perguntaSalva?.data_criacao).toBeInstanceOf(Date);
    expect(perguntaSalva?.data_atualizacao).toBeInstanceOf(Date);
    expect(perguntaSalva?.data_exclusao).toBeNull();
    // N-N: Não há expect para formularioId aqui, pois não existe na tabela 'perguntas'
  });

  it('deve inserir uma nova pergunta do tipo multipla_escolha com opções (N-N)', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Quais são suas cores favoritas?',
      tipo: 'multipla_escolha',
      opcoes: ['azul', 'verde', 'vermelho'],
      // N-N: Não se passa formularioId
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.tipo).toBe('multipla_escolha');
    expect(perguntaSalva?.opcoes).toEqual(['azul', 'verde', 'vermelho']);
    expect(perguntaSalva?.ativo).toBe(true);
  });

  it('deve inserir uma nova pergunta do tipo nota com opções padrão (N-N)', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Dê uma nota.',
      tipo: 'nota',
      opcoes: undefined, // Entidade define o padrão
      // N-N: Não se passa formularioId
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.tipo).toBe('nota');
    expect(perguntaSalva?.opcoes).toEqual(['1', '2', '3', '4', '5']); // Mapeado da entidade
    expect(perguntaSalva?.ativo).toBe(true);
  });

  // --- Teste para atualização de OUTRAS propriedades, já que formularioId não é mais direto ---
  it('deve atualizar outras propriedades de uma pergunta existente (N-N)', async () => {
    const perguntaOriginal = Pergunta.criar({
      texto: 'Texto original',
      tipo: 'texto',
      // N-N: Não há formularioId aqui
    });
    await repository.inserir(perguntaOriginal); // Insere a pergunta

    perguntaOriginal.atualizarTexto('Novo Título da Pergunta'); // Altera outra propriedade
    perguntaOriginal['dataAtualizacao'] = new Date(Date.now() + 1000); // Garante que a data é diferente

    await repository.inserir(perguntaOriginal); // Persiste a atualização

    const perguntaAtualizada = await prisma.pergunta.findUnique({
      where: { id: perguntaOriginal.id },
    });

    expect(perguntaAtualizada).toBeDefined();
    expect(perguntaAtualizada?.texto).toBe('Novo Título da Pergunta');
    expect(perguntaAtualizada?.ativo).toBe(true);
    expect(perguntaAtualizada?.data_atualizacao?.getTime()).toBeGreaterThan(
        perguntaOriginal.dataCriacao.getTime(),
      );
    // N-N: Não há expect para formularioId aqui, pois não é uma propriedade direta
  });

  it('deve atualizar uma pergunta para o estado inativo (N-N)', async () => {
    const perguntaAtiva = Pergunta.criar({
      texto: 'Pergunta para inativar',
      tipo: 'texto',
    });
    await repository.inserir(perguntaAtiva);

    perguntaAtiva.inativar(); // Ativa a lógica de inativação no domínio
    perguntaAtiva['dataAtualizacao'] = new Date(Date.now() + 1000); // Garante que a data é diferente
    await repository.inserir(perguntaAtiva); // Persiste a mudança

    const perguntaInativa = await prisma.pergunta.findUnique({
      where: { id: perguntaAtiva.id },
    });

    expect(perguntaInativa).toBeDefined();
    expect(perguntaInativa?.ativo).toBe(false); // Agora esperamos 'false'
    expect(perguntaInativa?.data_exclusao).toBeInstanceOf(Date);
    expect(perguntaInativa?.data_atualizacao).toBeInstanceOf(Date);
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar uma pergunta existente por ID (N-N)', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Pergunta para recuperação',
      tipo: 'nota',
      // N-N: Não se passa formularioId
    });
    await repository.inserir(pergunta);

    const perguntaRecuperada = await repository.recuperarPorUuid(pergunta.id);

    expect(perguntaRecuperada).toBeInstanceOf(Pergunta);
    expect(perguntaRecuperada?.id).toBe(pergunta.id);
    expect(perguntaRecuperada?.texto).toBe(pergunta.texto);
    expect(perguntaRecuperada?.tipo).toBe(pergunta.tipo);
    expect(perguntaRecuperada?.opcoes).toEqual(['1', '2', '3', '4', '5']);
    expect(perguntaRecuperada?.ativo).toBe(true);
    expect(perguntaRecuperada?.dataCriacao.toISOString()).toBe(pergunta.dataCriacao.toISOString());
    expect(perguntaRecuperada?.dataAtualizacao.toISOString()).toBe(
      pergunta.dataAtualizacao.toISOString(),
    );
    expect(perguntaRecuperada?.dataExclusao).toBeNull();
    // N-N: Não há expect para formularioId
  });

  it('deve retornar null se a pergunta não for encontrada por ID (N-N)', async () => {
    const perguntaRecuperada = await repository.recuperarPorUuid('id-inexistente');
    expect(perguntaRecuperada).toBeNull();
  });

  it('deve buscar múltiplas perguntas por uma lista de IDs (N-N)', async () => {
    const pergunta1 = Pergunta.criar({ texto: 'P1', tipo: 'texto' });
    const pergunta2 = Pergunta.criar({ texto: 'P2', tipo: 'nota' });
    const pergunta3 = Pergunta.criar({ texto: 'P3', tipo: 'multipla_escolha', opcoes: ['a', 'b'] });

    await repository.inserir(pergunta1);
    await repository.inserir(pergunta2);
    await repository.inserir(pergunta3);

    const perguntasEncontradas = await repository.buscarMuitosPorId([
      pergunta1.id,
      pergunta3.id,
      'id-nao-existente',
    ]);

    expect(perguntasEncontradas).toHaveLength(2);
    expect(perguntasEncontradas.some((p) => p.id === pergunta1.id)).toBe(true);
    expect(perguntasEncontradas.some((p) => p.id === pergunta3.id)).toBe(true);
    expect(perguntasEncontradas.some((p) => p.id === pergunta2.id)).toBe(false);
  });

  it('deve retornar um array vazio se nenhum ID for encontrado em buscarMuitosPorId (N-N)', async () => {
    const perguntasEncontradas = await repository.buscarMuitosPorId([
      'id-nao-existente-1',
      'id-nao-existente-2',
    ]);
    expect(perguntasEncontradas).toHaveLength(0);
  });
});