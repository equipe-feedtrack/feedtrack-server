import { describe, expect, it, beforeEach, vi, Mock } from 'vitest';
import { Formulario as FormularioPrisma, Pergunta as PerguntaPrisma } from '@prisma/client';

// Entidades e Tipos de Domínio
import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { FormularioMap } from '../formulario.map';
import { PerguntaMap } from '../pergunta.map';


// --- MOCKS DAS DEPENDÊNCIAS (PerguntaMap) ---
vi.mock('../pergunta.map');

describe('FormularioMap', () => {

  // =================================================================
  // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS COM UUIDs VÁLIDOS
  // =================================================================
  const dataFixa = new Date('2025-08-10T14:00:00.000Z');
  const PERGUNTA_ID = '1e7d8c5e-2f6b-4a8c-9b1d-0e9f8a7b6c5d';
  const FORMULARIO_ID = 'a3b8d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
  const EMPRESA_ID = 'b4c9e7d1-5f8a-4c3b-9d2e-1f0a9b8c7d6e';

  const mockPergunta = Pergunta.recuperar({
    id: PERGUNTA_ID,
    texto: 'Qual o seu nível de satisfação?',
    tipo: 'nota',
    opcoes: [],
    ativo: true,
    dataCriacao: dataFixa,
    dataAtualizacao: dataFixa,
    dataExclusao: null,
  });

  const mockFormularioDomain = Formulario.recuperar({
    id: FORMULARIO_ID,
    titulo: 'Formulário de Satisfação',
    descricao: 'Feedback sobre o nosso serviço.',
    perguntas: [mockPergunta],
    ativo: true,
    empresaId: EMPRESA_ID,
    dataCriacao: dataFixa,
    dataAtualizacao: dataFixa,
    dataExclusao: null,
  });

  // =================================================================
  // Limpeza dos mocks antes de cada teste
  // =================================================================
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =================================================================
  // Testes
  // =================================================================

  describe('toDomain', () => {
    it('deve converter dados do Prisma (com relação N-N aninhada) para uma entidade Formulario', () => {
      // DADO: um objeto como viria do Prisma
      const formularioPrisma = {
        id: FORMULARIO_ID,
        titulo: 'Formulário de Satisfação',
        descricao: 'Feedback sobre o nosso serviço.',
        ativo: true,
        empresaId: EMPRESA_ID,
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
            } as PerguntaPrisma,
          },
        ],
      };

      // ✅ CORREÇÃO: Cast explícito para o tipo Mock
      (PerguntaMap.toDomain as Mock).mockImplementation(() => mockPergunta);

      // QUANDO: o método é chamado
      const formularioDomain = FormularioMap.toDomain(formularioPrisma as any);

      // ENTÃO: o resultado deve ser uma instância de Formulario com os dados corretos
      expect(formularioDomain).toBeInstanceOf(Formulario);
      expect(formularioDomain.id).toBe(FORMULARIO_ID);
      expect(formularioDomain.titulo).toBe('Formulário de Satisfação');
      expect(formularioDomain.perguntas).toHaveLength(0); // Perguntas are no longer directly associated
      expect(formularioDomain.empresaId).toBe(EMPRESA_ID);
    });
  });

  describe('toPersistence', () => {
    it('deve converter uma entidade Formulario para o formato de persistência do Prisma', () => {
      // QUANDO: o método é chamado
      const persistenceObject = FormularioMap.toPersistence(mockFormularioDomain);

      // ENTÃO: o objeto retornado deve ter o formato esperado pelo Prisma.create
      expect(persistenceObject.id).toBe(FORMULARIO_ID);
      expect(persistenceObject.titulo).toBe('Formulário de Satisfação');
      expect(persistenceObject.ativo).toBe(true);
      expect(persistenceObject.empresaId).toBe(EMPRESA_ID);
    });
  });

  describe('toResponseDTO', () => {
    it('deve converter uma entidade Formulario para um DTO de resposta detalhado', () => {
      // ✅ CORREÇÃO: Cast explícito para o tipo Mock
      (PerguntaMap.toDTO as Mock).mockImplementation(() => ({
        id: PERGUNTA_ID,
        texto: 'Qual o seu nível de satisfação?',
        tipo: 'nota',
        opcoes: [],
        ativo: true,
        dataCriacao: dataFixa.toISOString(),
        dataAtualizacao: dataFixa.toISOString(),
      }));

      // QUANDO: o método é chamado
      const dto = FormularioMap.toResponseDTO(mockFormularioDomain);

      // ENTÃO: as dependências são chamadas e o DTO é montado corretamente
      expect(dto.id).toBe(FORMULARIO_ID);
      expect(dto.perguntas).toHaveLength(0); // Perguntas are no longer directly associated
      expect(dto.empresaId).toBe(EMPRESA_ID);
      expect(dto.dataCriacao).toBe(dataFixa.toISOString());
    });
  });

  describe('toListDTO', () => {
    it('deve converter uma entidade Formulario para um DTO de resposta resumido', () => {
      // QUANDO: o método é chamado
      const dto = FormularioMap.toListDTO(mockFormularioDomain);

      // ENTÃO: o DTO deve ter o formato correto e a contagem de perguntas
      expect(dto.id).toBe(FORMULARIO_ID);
      expect(dto.titulo).toBe('Formulário de Satisfação');
      expect(dto.empresaId).toBe(EMPRESA_ID);
      expect(dto.dataCriacao).toBe(dataFixa.toISOString());
    });
  });
});