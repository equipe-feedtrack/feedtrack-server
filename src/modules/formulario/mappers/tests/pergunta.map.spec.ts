import { describe, expect, it } from 'vitest';
import { Pergunta } from '../../domain/pergunta/pergunta.entity';
import { PerguntaMap } from '../pergunta.map';
import { Prisma, Pergunta as PerguntaPrisma } from '@prisma/client'; // Renomeei Pergunta para PerguntaPrisma para evitar conflito
import { QuantidadeMinimaOpcoesException } from '@modules/formulario/domain/pergunta/pergunta.exception';
import { randomUUID } from 'crypto';

describe('PerguntaMap', () => {
  // Cenário base para os testes da entidade
  const ids = randomUUID()

  const mockPerguntaData = {
    id: ids,
    texto: 'Qual é o seu nível de satisfação?',
    tipo: 'multipla_escolha' as 'multipla_escolha',
    opcoes: ['Ruim', 'Bom', 'Excelente'],
    ativo: true,
    dataCriacao: new Date('2023-01-15T10:00:00.000Z'),
    dataAtualizacao: new Date('2023-01-15T10:00:00.000Z'),
    dataExclusao: null,
  };

  const mockPerguntaTextoData = {
    id: ids,
    texto: 'Deixe seu comentário.',
    tipo: 'texto' as 'texto',
    opcoes: undefined,
    ativo: true,
    dataCriacao: new Date('2023-02-20T11:30:00.000Z'),
    dataAtualizacao: new Date('2023-02-20T11:30:00.000Z'),
    dataExclusao: null,
  };

  const mockPerguntaNotaData = {
    id: ids,
    texto: 'Dê uma nota de 1 a 5.',
    tipo: 'nota' as 'nota',
    opcoes: ['1', '2', '3', '4', '5'], // Opções padrão definidas pela entidade
    ativo: true,
    dataCriacao: new Date('2023-03-25T14:00:00.000Z'),
    dataAtualizacao: new Date('2023-03-25T14:00:00.000Z'),
    dataExclusao: null,
  };

  // Instâncias da entidade de domínio (criadas usando Pergunta.recuperar para fins de mock)
  const mockPergunta = Pergunta.recuperar(mockPerguntaData);
  const mockPerguntaTexto = Pergunta.recuperar(mockPerguntaTextoData);
  const mockPerguntaNota = Pergunta.recuperar(mockPerguntaNotaData);

  // --- Testes para toDTO ---
  describe('toDTO', () => {
    it('deve converter uma entidade Pergunta (multipla_escolha) para PerguntaResponseDTO', () => {
      const dto = PerguntaMap.toDTO(mockPergunta);

      expect(dto).toEqual({
        id: mockPerguntaData.id,
        texto: mockPerguntaData.texto,
        tipo: mockPerguntaData.tipo,
        opcoes: mockPerguntaData.opcoes,
        ativo: mockPerguntaData.ativo,
        dataCriacao: mockPerguntaData.dataCriacao.toISOString(),
        dataAtualizacao: mockPerguntaData.dataAtualizacao.toISOString(),
      });
      expect(dto).not.toHaveProperty('dataExclusao'); 
    });

    it('deve converter uma entidade Pergunta (texto) para PerguntaResponseDTO com opcoes undefined', () => {
      const dto = PerguntaMap.toDTO(mockPerguntaTexto);

      expect(dto.id).toBe(mockPerguntaTextoData.id);
      expect(dto.texto).toBe(mockPerguntaTextoData.texto);
      expect(dto.tipo).toBe(mockPerguntaTextoData.tipo);
      expect(dto.opcoes).toBeUndefined();
      expect(dto.dataCriacao).toBe(mockPerguntaTextoData.dataCriacao.toISOString());
      expect(dto.dataAtualizacao).toBe(mockPerguntaTextoData.dataAtualizacao.toISOString());
    });

    it('deve converter uma entidade Pergunta (nota) para PerguntaResponseDTO com opcoes definidas', () => {
      const dto = PerguntaMap.toDTO(mockPerguntaNota);

      expect(dto.id).toBe(mockPerguntaNotaData.id);
      expect(dto.texto).toBe(mockPerguntaNotaData.texto);
      expect(dto.tipo).toBe(mockPerguntaNotaData.tipo);
      expect(dto.opcoes).toEqual(['1', '2', '3', '4', '5']);
      expect(dto.dataCriacao).toBe(mockPerguntaNotaData.dataCriacao.toISOString());
      expect(dto.dataAtualizacao).toBe(mockPerguntaNotaData.dataAtualizacao.toISOString());
    });

    it('deve lidar com entidade inativa (dataExclusao não deve ir para DTO)', () => {
      const perguntaInativa = Pergunta.recuperar({
        ...mockPerguntaData,
        ativo: false,
        dataExclusao: new Date('2023-04-01T15:00:00.000Z'),
      });
      const dto = PerguntaMap.toDTO(perguntaInativa);
      expect(dto).not.toHaveProperty('dataExclusao');
    });
  });

  // --- Testes para toDomain ---
  describe('toDomain', () => {
    // Dados crus (do Prisma) que seriam lidos do banco.
    // **USAR snake_case para propriedades do banco**
    // N-N: Não há 'formularioId' aqui.
    const rawMultiplaEscolha: PerguntaPrisma = {
      id: mockPerguntaData.id,
      texto: mockPerguntaData.texto,
      tipo: mockPerguntaData.tipo,
      opcoes: mockPerguntaData.opcoes as Prisma.JsonValue,
      ativo: mockPerguntaData.ativo,
      data_criacao: mockPerguntaData.dataCriacao, // <-- CORRIGIDO: de dataCriacao para data_criacao
      data_atualizacao: mockPerguntaData.dataAtualizacao, // <-- CORRIGIDO: de dataAtualizacao para data_atualizacao
      data_exclusao: mockPerguntaData.dataExclusao, // <-- CORRIGIDO: de dataExclusao para data_exclusao
    };

    const rawTexto: PerguntaPrisma = {
      id: mockPerguntaTextoData.id,
      texto: mockPerguntaTextoData.texto,
      tipo: mockPerguntaTextoData.tipo,
      opcoes: null as Prisma.JsonValue,
      ativo: mockPerguntaTextoData.ativo,
      data_criacao: mockPerguntaTextoData.dataCriacao, // <-- CORRIGIDO
      data_atualizacao: mockPerguntaTextoData.dataAtualizacao, // <-- CORRIGIDO
      data_exclusao: mockPerguntaTextoData.dataExclusao, // <-- CORRIGIDO
    };

    const rawNota: PerguntaPrisma = {
      id: mockPerguntaNotaData.id,
      texto: mockPerguntaNotaData.texto,
      tipo: mockPerguntaNotaData.tipo,
      opcoes: null as Prisma.JsonValue,
      ativo: mockPerguntaNotaData.ativo,
      data_criacao: mockPerguntaNotaData.dataCriacao, // <-- CORRIGIDO
      data_atualizacao: mockPerguntaNotaData.dataAtualizacao, // <-- CORRIGIDO
      data_exclusao: mockPerguntaNotaData.dataExclusao, // <-- CORRIGIDO
    };

    it('deve converter dados crus do Prisma (multipla_escolha) para uma entidade Pergunta', () => {
      const pergunta = PerguntaMap.toDomain(rawMultiplaEscolha);

      expect(pergunta).toBeInstanceOf(Pergunta);
      expect(pergunta.id).toBe(rawMultiplaEscolha.id);
      expect(pergunta.texto).toBe(rawMultiplaEscolha.texto);
      expect(pergunta.tipo).toBe(rawMultiplaEscolha.tipo);
      expect(pergunta.opcoes).toEqual(rawMultiplaEscolha.opcoes);
      expect(pergunta.ativo).toBe(rawMultiplaEscolha.ativo);
      expect(pergunta.dataCriacao).toEqual(rawMultiplaEscolha.data_criacao); // <-- Comparar com snake_case do raw
      expect(pergunta.dataAtualizacao).toEqual(rawMultiplaEscolha.data_atualizacao); // <-- Comparar com snake_case do raw
      expect(pergunta.dataExclusao).toEqual(rawMultiplaEscolha.data_exclusao); // <-- Comparar com snake_case do raw
    });

    it('deve converter dados crus do Prisma (texto com opcoes null) para uma entidade Pergunta com opcoes undefined', () => {
      const pergunta = PerguntaMap.toDomain(rawTexto);

      expect(pergunta).toBeInstanceOf(Pergunta);
      expect(pergunta.id).toBe(rawTexto.id);
      expect(pergunta.tipo).toBe(rawTexto.tipo);
      expect(pergunta.opcoes).toBeUndefined();
      expect(pergunta.ativo).toBe(rawTexto.ativo);
    });

    it('deve converter dados crus do Prisma (nota com opcoes null) para uma entidade Pergunta com opcoes padrão', () => {
      const pergunta = PerguntaMap.toDomain(rawNota);

      expect(pergunta).toBeInstanceOf(Pergunta);
      expect(pergunta.id).toBe(rawNota.id);
      expect(pergunta.tipo).toBe(rawNota.tipo);
      expect(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']);
      expect(pergunta.ativo).toBe(rawNota.ativo);
    });

    it('deve lidar com dataExclusao não nula', () => {
      const rawComExclusao: PerguntaPrisma = {
        ...rawMultiplaEscolha,
        data_exclusao: new Date('2023-04-01T15:00:00.000Z'), // <-- CORRIGIDO
      };
      const pergunta = PerguntaMap.toDomain(rawComExclusao);
      expect(pergunta.dataExclusao).toEqual(rawComExclusao.data_exclusao); // <-- Comparar com snake_case
    });

    it('deve lançar exceção ao tentar converter raw.opcoes que não são arrays válidos para multipla_escolha', () => {
      const rawInvalido: PerguntaPrisma = {
        ...rawMultiplaEscolha,
        opcoes: 'string_invalida' as Prisma.JsonValue,
      };
      expect(() => PerguntaMap.toDomain(rawInvalido)).toThrow(
        QuantidadeMinimaOpcoesException,
      );
    });
  });

  // --- Testes para toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Pergunta (multipla_escolha) para um objeto de persistência do Prisma', () => {
      const persistenceData = PerguntaMap.toPersistence(mockPergunta);

      expect(persistenceData).toEqual({
        id: mockPerguntaData.id,
        texto: mockPerguntaData.texto,
        tipo: mockPerguntaData.tipo,
        opcoes: mockPerguntaData.opcoes,
        ativo: mockPerguntaData.ativo,
        data_criacao: mockPerguntaData.dataCriacao,
        data_atualizacao: mockPerguntaData.dataAtualizacao,
        data_exclusao: mockPerguntaData.dataExclusao,
      });
    });

    it('deve converter uma entidade Pergunta (texto) para um objeto de persistência com opcoes como Prisma.JsonNull', () => {
      const persistenceData = PerguntaMap.toPersistence(mockPerguntaTexto);

      expect(persistenceData.id).toBe(mockPerguntaTextoData.id);
      expect(persistenceData.texto).toBe(mockPerguntaTextoData.texto);
      expect(persistenceData.tipo).toBe(mockPerguntaTextoData.tipo);
      expect(persistenceData.opcoes).toBe(Prisma.JsonNull);
      expect(persistenceData.ativo).toBe(mockPerguntaTextoData.ativo);
      expect(persistenceData.data_criacao).toEqual(mockPerguntaTextoData.dataCriacao);
      expect(persistenceData.data_atualizacao).toEqual(mockPerguntaTextoData.dataAtualizacao);
      expect(persistenceData.data_exclusao).toBe(mockPerguntaTextoData.dataExclusao);
    });

    it('deve converter uma entidade Pergunta (nota) para um objeto de persistência com opcoes definidas (padrão)', () => {
      const persistenceData = PerguntaMap.toPersistence(mockPerguntaNota);

      expect(persistenceData.id).toBe(mockPerguntaNotaData.id);
      expect(persistenceData.texto).toBe(mockPerguntaNotaData.texto);
      expect(persistenceData.tipo).toBe(mockPerguntaNotaData.tipo);
      expect(persistenceData.opcoes).toEqual(['1', '2', '3', '4', '5']);
      expect(persistenceData.ativo).toBe(mockPerguntaNotaData.ativo);
      expect(persistenceData.data_criacao).toEqual(mockPerguntaNotaData.dataCriacao);
      expect(persistenceData.data_atualizacao).toEqual(mockPerguntaNotaData.dataAtualizacao);
      expect(persistenceData.data_exclusao).toBe(mockPerguntaNotaData.dataExclusao);
    });

    it('deve converter uma entidade Pergunta com dataExclusao para persistencia', () => {
      const perguntaInativaData = {
        ...mockPerguntaData,
        ativo: false,
        dataExclusao: new Date('2023-05-01T16:00:00.000Z'),
      };
      const perguntaInativa = Pergunta.recuperar(perguntaInativaData);

      const persistenceData = PerguntaMap.toPersistence(perguntaInativa);
      expect(persistenceData.data_exclusao).toEqual(perguntaInativaData.dataExclusao);
      expect(persistenceData.ativo).toBe(perguntaInativaData.ativo);
    });
  });
});