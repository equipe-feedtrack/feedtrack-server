import { IDEntityUUIDInvalid } from '@shared/domain/domain.exception'; // Assumindo que seu IDEntityUUIDInvalid está aqui
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'; // Adicionado vi para controle de tempo
import { Pergunta } from '../pergunta.entity';
import {
  OpcaoDuplicadaException,
  PerguntaTextoVazioException,
  QuantidadeMinimaOpcoesException,
  TipoPerguntaInvalidoException,
  ValidacaoPerguntaException,
} from '../pergunta.exception';
import { RecuperarPerguntaProps } from '../pergunta.types';

describe('Entidade Pergunta: Criar Pergunta', () => {
  it('deve criar uma pergunta do tipo nota com sucesso e opções padrão', () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual a sua nota para o atendimento?',
      tipo: 'nota',
      opcoes: undefined, // Testando opções undefined para tipo nota
      formularioId: undefined,
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.id).toBeDefined();
    expect(pergunta.texto).toBe('Qual a sua nota para o atendimento?');
    expect(pergunta.tipo).toBe('nota');
    expect(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']); // Opções padrão para 'nota'
    expect(pergunta.formularioId).toBe(undefined); // Agora deve passar
    expect(pergunta.dataCriacao).toBeInstanceOf(Date);
    expect(pergunta.dataAtualizacao).toBeInstanceOf(Date);
    expect(pergunta.dataExclusao).toBeNull();
  });

  it('deve criar uma pergunta do tipo nota com sucesso e opções customizadas', () => {
    const pergunta = Pergunta.criar({
      texto: 'Classifique de 1 a 3',
      tipo: 'nota',
      opcoes: ['1', '2', '3'], // Opções customizadas
      formularioId: 'form-008',
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.tipo).toBe('nota');
    expect(pergunta.opcoes).toEqual(['1', '2', '3']);
  });

  it('deve criar uma pergunta do tipo texto corretamente', () => {
    const pergunta = Pergunta.criar({
      texto: 'O que você achou do tênis Corre 4?',
      tipo: 'texto',
      opcoes: undefined,
      formularioId: 'form-002',
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe('O que você achou do tênis Corre 4?');
    expect(pergunta.tipo).toBe('texto');
    expect(pergunta.opcoes).toBeUndefined(); // Tipo texto não deve ter opções
  });

  it('deve criar uma pergunta do tipo multipla_escolha com opções válidas', () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual o seu nível de satisfação?',
      tipo: 'multipla_escolha',
      opcoes: ['ruim', 'bom', 'excelente'],
      formularioId: 'form-003',
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe('Qual o seu nível de satisfação?');
    expect(pergunta.tipo).toBe('multipla_escolha');
    expect(pergunta.opcoes).toEqual(['ruim', 'bom', 'excelente']);
  });

  it('deve lançar exceção se o texto estiver vazio', () => {
    expect(() =>
      Pergunta.criar({
        texto: '',
        tipo: 'texto',
        opcoes: undefined,
        formularioId: 'form-004',
      }),
    ).toThrow(PerguntaTextoVazioException);
  });

  it('deve lançar exceção se o tipo for inválido', () => {
    expect(() =>
      Pergunta.criar({
        texto: 'Texto',
        tipo: 'escolha_unica' as any, // Forçando tipo inválido para teste
        opcoes: undefined,
        formularioId: 'form-005',
      }),
    ).toThrow(TipoPerguntaInvalidoException);
  });

  it('deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções', () => {
    expect(() =>
      Pergunta.criar({
        texto: 'Escolha uma opção',
        tipo: 'multipla_escolha',
        opcoes: ['Sim'],
        formularioId: 'form-006',
      }),
    ).toThrow(QuantidadeMinimaOpcoesException);
  });

  it('deve lançar exceção se houver opções duplicadas para multipla_escolha', () => {
    expect(() =>
      Pergunta.criar({
        texto: 'Escolha uma opção',
        tipo: 'multipla_escolha',
        opcoes: ['Sim', 'Não', 'Sim'],
        formularioId: 'form-007',
      }),
    ).toThrow(OpcaoDuplicadaException);
  });

  it('deve lançar exceção se o tipo for texto e tiver opções', () => {
    expect(() =>
      Pergunta.criar({
        texto: 'Qual seu nome?',
        tipo: 'texto',
        opcoes: ['João', 'Maria'],
        formularioId: 'form-009',
      }),
    ).toThrow(ValidacaoPerguntaException); // "Perguntas do tipo texto não devem ter opções."
  });

  it('deve lançar exceção se o tipo for nota e as opções não forem numéricas', () => {
    expect(() =>
      Pergunta.criar({
        texto: 'Sua avaliação?',
        tipo: 'nota',
        opcoes: ['bom', 'ruim'],
        formularioId: 'form-010',
      }),
    ).toThrow(ValidacaoPerguntaException); // "Opções de nota devem ser apenas números."
  });
});

describe('Entidade Pergunta: Recuperar Pergunta', () => {
  it('deve recuperar uma pergunta do tipo nota com sucesso', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Qual a sua nota?',
      tipo: 'nota',
      opcoes: ['1', '2', '3', '4', '5'],
      ativo: true,
      formularioId: 'form-010',
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.id).toBe(perguntaValida.id);
    expect(pergunta.texto).toBe('Qual a sua nota?');
    expect(pergunta.tipo).toBe('nota');
    expect(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']); 
    expect(pergunta.ativo).toBe(true);
  });

  it('não deve recuperar uma pergunta com ID inválido (UUID inválido)', () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: '1234', // ID inválido
      texto: 'Qual a sua nota?',
      tipo: 'nota',
      formularioId: 'form-010.1',
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };

    // Assumindo que a validação de UUID ocorre na classe base Entity ou na construção do ID
    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(IDEntityUUIDInvalid);
  });

  it('deve recuperar uma pergunta do tipo texto sem opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Descreva sua experiência com o produto.',
      tipo: 'texto',
      formularioId: 'form-011',
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe('Descreva sua experiência com o produto.');
    expect(pergunta.tipo).toBe('texto');
    expect(pergunta.opcoes).toBeUndefined();
    expect(pergunta.ativo).toBe(true);
  });

  it('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Qual é a sua cor favorita?',
      tipo: 'multipla_escolha',
      opcoes: ['Azul', 'Verde', 'Vermelho'],
      ativo: true,
      formularioId: 'form-012',
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe('Qual é a sua cor favorita?');
    expect(pergunta.tipo).toBe('multipla_escolha');
    expect(pergunta.opcoes).toEqual(['Azul', 'Verde', 'Vermelho']);
    expect(pergunta.ativo).toBe(true);
  });

  it('deve lançar exceção se recuperar uma pergunta do tipo multipla_escolha com opções vazias', () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Qual é a sua fruta favorita?',
      tipo: 'multipla_escolha',
      opcoes: [], // opções vazias
      formularioId: 'form-013',
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };

    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(QuantidadeMinimaOpcoesException);
  });

  it('deve lançar exceção se recuperar uma pergunta do tipo texto com opções', () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Comentário',
      tipo: 'texto',
      opcoes: ['Opção 1'],
      formularioId: 'form-014',
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(ValidacaoPerguntaException);
  });
});

describe('Entidade Pergunta: Métodos de Comportamento', () => {
  // Configurações para controlar o tempo nos testes
  beforeEach(() => {
    vi.useFakeTimers(); // Habilita os timers falsos do Vitest
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura os timers reais após cada teste
  });

  it('deve vincular a um formulário se a pergunta não estiver vinculada', () => {
    const pergunta = Pergunta.criar({
      texto: 'Teste de vínculo',
      tipo: 'texto',
      formularioId: undefined, // Pergunta não vinculada
    });
    const oldUpdateDate = pergunta.dataAtualizacao;

    vi.advanceTimersByTime(1); // Avança o tempo em 1ms para garantir que a nova data seja maior

    pergunta.vincularFormulario('novo-formulario-id');

    expect(pergunta.formularioId).toBe('novo-formulario-id');
    expect(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('não deve vincular a outro formulário se já estiver vinculada a um diferente', () => {
    // 1. Cria uma pergunta que já está vinculada a um formulário existente
    const pergunta = Pergunta.criar({
      texto: 'Teste de vínculo existente',
      tipo: 'texto',
      formularioId: 'formulario-existente',
    });

    expect(() =>
      pergunta.vincularFormulario('novo-formulario-id'),
    ).toThrowError();

  });

  it('deve permitir vincular ao mesmo formulário sem lançar exceção', () => {
    const formularioId = 'formulario-abc';
    const pergunta = Pergunta.criar({
      texto: 'Teste de mesmo vínculo',
      tipo: 'texto',
      formularioId: formularioId,
    });
    const oldUpdateDate = pergunta.dataAtualizacao;

    vi.advanceTimersByTime(1); // Avança o tempo em 1ms

    expect(() => pergunta.vincularFormulario(formularioId)).not.toThrow();
    expect(pergunta.formularioId).toBe(formularioId);
    expect(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('deve inativar a pergunta com sucesso', () => {
    const pergunta = Pergunta.criar({
      texto: 'Pergunta para inativar',
      tipo: 'texto',
      formularioId: 'form-inativar',

    });

    expect(pergunta.dataExclusao).toBeNull();
    const oldUpdateDate = pergunta.dataAtualizacao;

    vi.advanceTimersByTime(1); // Avança o tempo em 1ms

    pergunta.inativar();

    expect(pergunta.ativo).toBe(false);
    expect(pergunta.dataExclusao).toBeInstanceOf(Date);
    expect(pergunta.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('não deve inativar uma pergunta já inativa', () => {
    const pergunta = Pergunta.criar({
      texto: 'Pergunta já inativa',
      tipo: 'texto',
      formularioId: 'form-inativa',
    });
    pergunta.inativar(); // Inativa pela primeira vez

    expect(() => pergunta.inativar()).toThrowError();
  });
});