import { IDEntityUUIDInvalid } from '@shared/domain/domain.exception'; // Assumindo que seu IDEntityUUIDInvalid está aqui
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'; // Adicionado vi para controle de tempo
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
      _texto: 'Qual a sua nota para o atendimento?',
      _tipo: 'nota',
      _opcoes: undefined, // Testando opções undefined para tipo nota
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta._id).toBeDefined();
    expect(pergunta._texto).toBe('Qual a sua nota para o atendimento?');
    expect(pergunta._tipo).toBe('nota');
    expect(pergunta._opcoes).toEqual(['1', '2', '3', '4', '5']); // Opções padrão para 'nota'
    expect(pergunta._dataCriacao).toBeInstanceOf(Date);
    expect(pergunta._dataAtualizacao).toBeInstanceOf(Date);
    expect(pergunta._dataExclusao).toBeNull();
  });

  it('deve criar uma pergunta do tipo nota com sucesso e opções customizadas', () => {
    const pergunta = Pergunta.criar({
      _texto: 'Classifique de 1 a 3',
      _tipo: 'nota',
      _opcoes: ['1', '2', '3'], // Opções customizadas
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta._tipo).toBe('nota');
    expect(pergunta._opcoes).toEqual(['1', '2', '3']);
  });

  it('deve criar uma pergunta do tipo texto corretamente', () => {
    const pergunta = Pergunta.criar({
      _texto: 'O que você achou do tênis Corre 4?',
      _tipo: 'texto',
      _opcoes: undefined,
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta._texto).toBe('O que você achou do tênis Corre 4?');
    expect(pergunta._tipo).toBe('texto');
    expect(pergunta._opcoes).toBeUndefined(); // Tipo texto não deve ter opções
  });

  it('deve criar uma pergunta do tipo multipla_escolha com opções válidas', () => {
    const pergunta = Pergunta.criar({
      _texto: 'Qual o seu nível de satisfação?',
      _tipo: 'multipla_escolha',
      _opcoes: ['ruim', 'bom', 'excelente']
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta._texto).toBe('Qual o seu nível de satisfação?');
    expect(pergunta._tipo).toBe('multipla_escolha');
    expect(pergunta._opcoes).toEqual(['ruim', 'bom', 'excelente']);
  });

  it('deve lançar exceção se o texto estiver vazio', () => {
    expect(() =>
      Pergunta.criar({
        _texto: '',
        _tipo: 'texto',
        _opcoes: undefined,
      }),
    ).toThrow(PerguntaTextoVazioException);
  });

  it('deve lançar exceção se o tipo for inválido', () => {
    expect(() =>
      Pergunta.criar({
              _texto: 'Texto',
        _tipo: 'escolha_unica' as any, // Forçando tipo inválido para teste
        _opcoes: undefined,
      }),
    ).toThrow(TipoPerguntaInvalidoException);
  });

  it('deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções', () => {
    expect(() =>
      Pergunta.criar({
              _texto: 'Escolha uma opção',
        _tipo: 'multipla_escolha',
        _opcoes: ['Sim'],
      }),
    ).toThrow(QuantidadeMinimaOpcoesException);
  });

  it('deve lançar exceção se houver opções duplicadas para multipla_escolha', () => {
    expect(() =>
      Pergunta.criar({
              _texto: 'Escolha uma opção',
        _tipo: 'multipla_escolha',
        _opcoes: ['Sim', 'Não', 'Sim'],
      }),
    ).toThrow(OpcaoDuplicadaException);
  });

  it('deve lançar exceção se o tipo for texto e tiver opções', () => {
    expect(() =>
      Pergunta.criar({
              _texto: 'Qual seu nome?',
        _tipo: 'texto',
        _opcoes: ['João', 'Maria'],
      }),
    ).toThrow(ValidacaoPerguntaException); // "Perguntas do tipo texto não devem ter opções."
  });

  it('deve lançar exceção se o tipo for nota e as opções não forem numéricas', () => {
    expect(() =>
      Pergunta.criar({
              _texto: 'Sua avaliação?',
        _tipo: 'nota',
        _opcoes: ['bom', 'ruim'],
      }),
    ).toThrow(ValidacaoPerguntaException); // "Opções de nota devem ser apenas números."
  });
});

describe('Entidade Pergunta: Recuperar Pergunta', () => {
  it('deve recuperar uma pergunta do tipo nota com sucesso', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      _texto: 'Qual a sua nota?',
      _tipo: 'nota',
      _opcoes: ['1', '2', '3', '4', '5'],
      _ativo: true,
      _dataCriacao: new Date(),
      _dataAtualizacao: new Date(),
      _dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta._id).toBe(perguntaValida._id);
    expect(pergunta._texto).toBe('Qual a sua nota?');
    expect(pergunta._tipo).toBe('nota');
    expect(pergunta._opcoes).toEqual(['1', '2', '3', '4', '5']); 
    expect(pergunta._ativo).toBe(true);
  });

  it('não deve recuperar uma pergunta com ID inválido (UUID inválido)', () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      _id: '1234', // ID inválido
      _texto: 'Qual a sua nota?',
      _tipo: 'nota',
      _ativo: true,
      _dataCriacao: new Date(),
      _dataAtualizacao: new Date(),
      _dataExclusao: null,
    };

    // Assumindo que a validação de UUID ocorre na classe base Entity ou na construção do ID
    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(IDEntityUUIDInvalid);
  });

  it('deve recuperar uma pergunta do tipo texto sem opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      _texto: 'Descreva sua experiência com o produto.',
      _tipo: 'texto',
      _ativo: true,
      _dataCriacao: new Date(),
      _dataAtualizacao: new Date(),
      _dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta._texto).toBe('Descreva sua experiência com o produto.');
    expect(pergunta._tipo).toBe('texto');
    expect(pergunta._opcoes).toBeUndefined();
    expect(pergunta._ativo).toBe(true);
  });

  it('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      _id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      _texto: 'Qual é a sua cor favorita?',
      _tipo: 'multipla_escolha',
      _opcoes: ['Azul', 'Verde', 'Vermelho'],
      _ativo: true,
      _dataCriacao: new Date(),
      _dataAtualizacao: new Date(),
      _dataExclusao: null,
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta._texto).toBe('Qual é a sua cor favorita?');
    expect(pergunta._tipo).toBe('multipla_escolha');
    expect(pergunta._opcoes).toEqual(['Azul', 'Verde', 'Vermelho']);
    expect(pergunta._ativo).toBe(true);
  });

  it('deve lançar exceção se recuperar uma pergunta do tipo multipla_escolha com opções vazias', () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Qual é a sua fruta favorita?',
      tipo: 'multipla_escolha',
      opcoes: [], // opções vazias
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

  it('deve inativar a pergunta com sucesso', () => {
    const pergunta = Pergunta.criar({
      texto: 'Pergunta para inativar',
      tipo: 'texto',

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
    });
    pergunta.inativar(); // Inativa pela primeira vez

    expect(() => pergunta.inativar()).toThrowError();
  });
});