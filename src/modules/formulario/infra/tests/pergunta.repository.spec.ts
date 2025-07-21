import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import { PerguntaRepositoryPrisma } from '../pergunta/pergunta.repository.prisma';
import { Pergunta } from '@modules/formulario/domain/pergunta/domain/pergunta.entity';



// Crie uma instância do Prisma Client. A DATABASE_URL deve ser definida via variável de ambiente.
const prisma = new PrismaClient();
const repository = new PerguntaRepositoryPrisma(prisma);

describe('PerguntaRepositoryPrisma (Integration Tests)', () => {
  // Limpa o banco de dados antes de cada teste para garantir isolamento
  beforeEach(async () => {
    await prisma.$transaction([
      // Se houver outras tabelas que dependem de 'perguntas', elas devem ser deletadas primeiro.
      // Ex: prisma.resposta.deleteMany(),
      prisma.pergunta.deleteMany(),
    ]);
  });

  // Fecha a conexão com o banco de dados após todos os testes
  afterAll(async () => {
    await prisma.$disconnect();
    // Opcional: Remover o arquivo .sqlite após todos os testes (descomente se desejar)
    // import fs from 'node:fs/promises';
    // try { await fs.unlink('./test.db'); } catch (e) { /* ignore if file doesn't exist */ }
  });

  // --- Testes para o método 'inserir' ---
  it('deve inserir uma nova pergunta do tipo texto com sucesso', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual é o seu feedback sobre o produto?',
      tipo: 'texto',
      formularioId: 'form-xyz-001',
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.texto).toBe(pergunta.texto);
    expect(perguntaSalva?.tipo).toBe(pergunta.tipo);
    expect(perguntaSalva?.opcoes).toBeNull(); // Tipo texto não deve ter opções no banco
    expect(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- Aqui o campo existe no objeto retornado do DB
    expect(perguntaSalva?.data_criacao).toBeInstanceOf(Date);
    expect(perguntaSalva?.data_atualizacao).toBeInstanceOf(Date);
    expect(perguntaSalva?.data_exclusao).toBeNull();
  });

  it('deve inserir uma nova pergunta do tipo multipla_escolha com opções', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Quais são suas cores favoritas?',
      tipo: 'multipla_escolha',
      opcoes: ['azul', 'verde', 'vermelho'],
      formularioId: 'form-abc-002',
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.tipo).toBe('multipla_escolha');
    expect(perguntaSalva?.opcoes).toEqual(['azul', 'verde', 'vermelho']);
    expect(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- Campo existe
  });

  it('deve inserir uma nova pergunta do tipo nota com opções padrão', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Dê uma nota.',
      tipo: 'nota',
      opcoes: undefined, // Entidade define o padrão
      formularioId: 'form-def-003',
    });

    await repository.inserir(pergunta);

    const perguntaSalva = await prisma.pergunta.findUnique({
      where: { id: pergunta.id },
    });

    expect(perguntaSalva).toBeDefined();
    expect(perguntaSalva?.id).toBe(pergunta.id);
    expect(perguntaSalva?.tipo).toBe('nota');
    expect(perguntaSalva?.opcoes).toEqual(['1', '2', '3', '4', '5']); // Mapeado da entidade
    expect(perguntaSalva?.formularioId).toBe(pergunta.formularioId); // <-- Campo existe
  });

  it('deve atualizar uma pergunta existente usando upsert', async () => {
    const perguntaOriginal = Pergunta.criar({
      texto: 'Texto original',
      tipo: 'texto',
      formularioId: 'form-update-test',
    });
    await repository.inserir(perguntaOriginal); // Salva a pergunta original

    // Simula uma alteração no domínio
    perguntaOriginal.vincularFormulario('form-update-test-2');
    // Força a data de atualização para garantir que foi alterada (usando um hack para fins de teste)
    perguntaOriginal['dataAtualizacao'] = new Date(Date.now() + 1000); 

    await repository.inserir(perguntaOriginal); // Usa upsert para atualizar

    const perguntaAtualizada = await prisma.pergunta.findUnique({
      where: { id: perguntaOriginal.id },
    });

    expect(perguntaAtualizada).toBeDefined();
    expect(perguntaAtualizada?.formularioId).toBe('form-update-test-2');
    expect(perguntaAtualizada?.data_atualizacao?.getTime()).toBeGreaterThanOrEqual(
      perguntaOriginal.dataCriacao.getTime(),
    );
    expect(perguntaAtualizada?.data_atualizacao?.getTime()).toBe(
      perguntaOriginal.dataAtualizacao.getTime(),
    );
  });

  it('deve atualizar uma pergunta para o estado inativo', async () => {
    const perguntaAtiva = Pergunta.criar({
      texto: 'Pergunta para inativar',
      tipo: 'texto',
      formularioId: 'form-inativar-repo',
    });
    await repository.inserir(perguntaAtiva);

    perguntaAtiva.inativar();
    await repository.inserir(perguntaAtiva); // Persiste a mudança

    const perguntaInativa = await prisma.pergunta.findUnique({
      where: { id: perguntaAtiva.id },
    });

    expect(perguntaInativa).toBeDefined();
    expect(perguntaInativa?.data_exclusao).toBeInstanceOf(Date);
    expect(perguntaInativa?.data_atualizacao).toBeInstanceOf(Date);
    expect(perguntaInativa?.formularioId).toBe(perguntaAtiva.formularioId); // <-- Campo existe
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar uma pergunta existente por ID', async () => {
    const pergunta = Pergunta.criar({
      texto: 'Pergunta para recuperação',
      tipo: 'nota',
      formularioId: 'form-recuperar',
    });
    await repository.inserir(pergunta);

    const perguntaRecuperada = await repository.recuperarPorUuid(pergunta.id);

    expect(perguntaRecuperada).toBeInstanceOf(Pergunta);
    expect(perguntaRecuperada?.id).toBe(pergunta.id);
    expect(perguntaRecuperada?.texto).toBe(pergunta.texto);
    expect(perguntaRecuperada?.tipo).toBe(pergunta.tipo);
    expect(perguntaRecuperada?.opcoes).toEqual(['1', '2', '3', '4', '5']); // Verificado pelo toDomain
    expect(perguntaRecuperada?.formularioId).toBe(pergunta.formularioId);
    expect(perguntaRecuperada?.dataCriacao.toISOString()).toBe(pergunta.dataCriacao.toISOString());
    expect(perguntaRecuperada?.dataAtualizacao.toISOString()).toBe(
      pergunta.dataAtualizacao.toISOString(),
    );
    expect(perguntaRecuperada?.dataExclusao).toBeNull();
  });

  it('deve retornar null se a pergunta não for encontrada por ID', async () => {
    const perguntaRecuperada = await repository.recuperarPorUuid('id-inexistente');
    expect(perguntaRecuperada).toBeNull();
  });

  // --- Testes para o método 'buscarMuitosPorId' ---
  it('deve buscar múltiplas perguntas por uma lista de IDs', async () => {
    const pergunta1 = Pergunta.criar({
      texto: 'P1',
      tipo: 'texto',
      formularioId: 'f1',
    });
    const pergunta2 = Pergunta.criar({
      texto: 'P2',
      tipo: 'nota',
      formularioId: 'f1',
    });
    const pergunta3 = Pergunta.criar({
      texto: 'P3',
      tipo: 'multipla_escolha',
      opcoes: ['a', 'b'],
      formularioId: 'f2',
    });

    await repository.inserir(pergunta1);
    await repository.inserir(pergunta2);
    await repository.inserir(pergunta3);

    const perguntasEncontradas = await repository.buscarMuitosPorId([
      pergunta1.id,
      pergunta3.id,
      'id-nao-existente', // ID que não existe
    ]);

    expect(perguntasEncontradas).toHaveLength(2);
    expect(perguntasEncontradas.some((p) => p.id === pergunta1.id)).toBe(true);
    expect(perguntasEncontradas.some((p) => p.id === pergunta3.id)).toBe(true);
    expect(perguntasEncontradas.some((p) => p.id === pergunta2.id)).toBe(false); // Não deveria encontrar P2
  });

  it('deve retornar um array vazio se nenhum ID for encontrado em buscarMuitosPorId', async () => {
    const perguntasEncontradas = await repository.buscarMuitosPorId([
      'id-nao-existente-1',
      'id-nao-existente-2',
    ]);
    expect(perguntasEncontradas).toHaveLength(0);
  });
});