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
import { randomUUID } from 'crypto';

describe('Entidade Pergunta: Criar Pergunta', () => {
  it('deve criar uma pergunta do tipo nota com sucesso e opções padrão', () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual a sua nota para o atendimento?',
      tipo: 'nota',
      opcoes: null, // Testando opções null para tipo nota
      empresaId: randomUUID()
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.id).toBeDefined();
    expect(pergunta.texto).toBe('Qual a sua nota para o atendimento?');
    expect(pergunta.tipo).toBe('nota');
    expect(pergunta.opcoes).toEqual(['1', '2', '3', '4', '5']); // Opções padrão para 'nota'
    expect(pergunta.dataCriacao).toBeInstanceOf(Date);
    expect(pergunta.dataAtualizacao).toBeInstanceOf(Date);
    expect(pergunta.dataExclusao).toBeNull();
  });

  it('deve criar uma pergunta do tipo nota com sucesso e opções customizadas', () => {
    const pergunta = Pergunta.criar({
      texto: 'Classifique de 1 a 3',
      tipo: 'nota',
      opcoes: ['1', '2', '3'], // Opções customizadas
      empresaId: randomUUID()
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta.tipo).toBe('nota');
    expect(pergunta.opcoes).toEqual(['1', '2', '3']);
  });

  it('deve criar uma pergunta do tipo texto corretamente', () => {
    const pergunta = Pergunta.criar({
      texto: 'O que você achou do tênis Corre 4?',
      tipo: 'texto',
      opcoes: null,
      empresaId: randomUUID()
    });

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta.texto).toBe('O que você achou do tênis Corre 4?');
    expect(pergunta.tipo).toBe('texto');
    expect(pergunta.opcoes).toBeNull(); // Tipo texto não deve ter opções
  });

  it('deve criar uma pergunta do tipo multipla_escolha com opções válidas', () => {
    const pergunta = Pergunta.criar({
      texto: 'Qual o seu nível de satisfação?',
      tipo: 'multipla_escolha',
      opcoes: ['ruim', 'bom', 'excelente'],
      empresaId: randomUUID()
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
        opcoes: null,
        empresaId: randomUUID()
      }),
    ).toThrow(PerguntaTextoVazioException);
  });

  it('deve lançar exceção se o tipo for inválido', () => {
    expect(() =>
      Pergunta.criar({
              texto: 'Texto',
        tipo: 'escolha_unica' as any, // Forçando tipo inválido para teste
        opcoes: null,
        empresaId: randomUUID()
      }),
    ).toThrow(TipoPerguntaInvalidoException);
  });

  it('deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções', () => {
    expect(() =>
      Pergunta.criar({
              texto: 'Escolha uma opção',
        tipo: 'multipla_escolha',
        opcoes: ['Sim'],
        empresaId: randomUUID()
      }),
    ).toThrow(QuantidadeMinimaOpcoesException);
  });

  it('deve lançar exceção se houver opções duplicadas para multipla_escolha', () => {
    expect(() =>
      Pergunta.criar({
              texto: 'Escolha uma opção',
        tipo: 'multipla_escolha',
        opcoes: ['Sim', 'Não', 'Sim'],
        empresaId: randomUUID()
      }),
    ).toThrow(OpcaoDuplicadaException);
  });

  it('deve lançar exceção se o tipo for texto e tiver opções', () => {
    expect(() =>
      Pergunta.criar({
              texto: 'Qual seu nome?',
        tipo: 'texto',
        opcoes: ['João', 'Maria'],
        empresaId: randomUUID()
      }),
    ).toThrow(ValidacaoPerguntaException); // "Perguntas do tipo texto não devem ter opções."
  });

  it('deve lançar exceção se o tipo for nota e as opções não forem numéricas', () => {
    expect(() =>
      Pergunta.criar({
              texto: 'Sua avaliação?',
        tipo: 'nota',
        opcoes: ['bom', 'ruim'],
        empresaId: randomUUID()
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
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
      empresaId: randomUUID()
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
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
      empresaId: randomUUID()
    };

    // Assumindo que a validação de UUID ocorre na classe base Entity ou na construção do ID
    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(IDEntityUUIDInvalid);
  });

  it('deve recuperar uma pergunta do tipo texto sem opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Descreva sua experiência com o produto.',
      tipo: 'texto',
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
      empresaId: randomUUID()
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
        expect(pergunta.texto).toBe('Descreva sua experiência com o produto.');
    expect(pergunta.tipo).toBe('texto');
    expect(pergunta.opcoes).toBeNull();
    expect(pergunta.ativo).toBe(true);
  });

  it('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
      texto: 'Qual é a sua cor favorita?',
      tipo: 'multipla_escolha',
      opcoes: ['Azul', 'Verde', 'Vermelho'],
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
      empresaId: randomUUID()
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
      ativo: true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
      empresaId: randomUUID()
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
      empresaId: randomUUID()
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
      empresaId: randomUUID()
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
      empresaId: randomUUID()
    });
    pergunta.inativar(); // Inativa pela primeira vez

    expect(() => pergunta.inativar()).toThrowError();
  });
});