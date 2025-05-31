import { describe, it, expect } from 'vitest';
import { Feedback } from './feedback.entity';
import { TipoPergunta } from '@shared/domain/data.types';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { IFeedbackProps } from './feedback.types';

// Mocks reais de Formulario e Pergunta
const perguntaMock = new Pergunta({
  id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
  texto: 'Como você avalia nosso serviço?',
  tipo: TipoPergunta.NOTA,
  opcoes: [],
  ordem: 1,
});

const perguntaMultiplaEscolha = new Pergunta({
  id: '123',
  texto: 'Qual sua cor favorita?',
  tipo: TipoPergunta.MULTIPLA_ESCOLHA,
  opcoes: ['Azul', 'Verde'],
  ordem: 2
});

const formularioMock = new Formulario({
  id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
  titulo: 'Formulário Teste',
  descricao: 'Descrição do formulário',
  perguntas: [perguntaMock],
  cliente: {} as any, // substitua conforme necessidade
});


// Testes
describe('Entidade Feedback', () => {
  it('deve criar um feedback com tipo TEXTO', () => {
    const props: IFeedbackProps = {
      formulario: formularioMock,
      pergunta: perguntaMock,
      tipo: TipoPergunta.TEXTO,
      resposta_texto: 'Muito bom',
    };

    const feedback = Feedback.criarFeedback(props);
    expect(feedback.resposta_texto).toBe('Muito bom');
    expect(feedback.tipo).toBe(TipoPergunta.TEXTO);
  });

  it('deve criar um feedback com tipo NOTA', () => {
    const props: IFeedbackProps = {
      formulario: formularioMock,
      pergunta: perguntaMock,
      tipo: TipoPergunta.NOTA,
      nota: 9,
    };

    const feedback = Feedback.criarFeedback(props);
    expect(feedback.nota).toBe(9);
    expect(feedback.tipo).toBe(TipoPergunta.NOTA);
  });

  it('deve criar um feedback com tipo MULTIPLA_ESCOLHA', () => {
    const props: IFeedbackProps = {
      formulario: formularioMock,
      pergunta: perguntaMultiplaEscolha,
      tipo: TipoPergunta.MULTIPLA_ESCOLHA,
      opcaoEscolhida: 'Azul'
    };

    const feedback = Feedback.criarFeedback(props);
    expect(feedback.opcaoEscolhida).toBe('Azul');
    expect(feedback.tipo).toBe(TipoPergunta.MULTIPLA_ESCOLHA);
  });

  it('deve lançar erro se tipo TEXTO não tiver resposta', () => {
    expect(() =>
      Feedback.criarFeedback({
        formulario: formularioMock,
        pergunta: perguntaMock,
        tipo: TipoPergunta.TEXTO,
        resposta_texto: '',
      })
    ).toThrow('Resposta textual obrigatória.');
  });

  it('deve lançar erro se tipo NOTA tiver nota inválida', () => {
    expect(() =>
      Feedback.criarFeedback({
        formulario: formularioMock,
        pergunta: perguntaMock,
        tipo: TipoPergunta.NOTA,
        nota: 20,
      })
    ).toThrow('Nota inválida.');
  });

  it('deve lançar erro se tipo MULTIPLA_ESCOLHA não tiver opção', () => {
    expect(() =>
      Feedback.criarFeedback({
        formulario: formularioMock,
        pergunta: perguntaMultiplaEscolha,
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
      })
    ).toThrow('Opção da múltipla escolha é obrigatória.');
  });
});
