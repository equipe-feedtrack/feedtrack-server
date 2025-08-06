import { describe, it, expect } from "vitest";
import { randomUUID } from "crypto";

import { TipoPergunta } from "@shared/domain/data.types";
import { Feedback } from "../feedback.entity";
import { FeedbackExceptions } from "../feedback.exceptions";

describe("Feedback Entity", () => {
  const baseCriarProps = {
    formularioId: randomUUID(),
    envioId: randomUUID(),
  };

  it("deve criar feedback com resposta de texto válida", () => {
    const feedback = Feedback.criar({
      ...baseCriarProps,
      respostas: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.TEXTO,
        resposta_texto: "Ótimo serviço!",
        data_resposta: new Date(),
      }],
    });

    expect(feedback.formularioId).toBe(baseCriarProps.formularioId);
    expect(feedback.envioId).toBe(baseCriarProps.envioId);
    expect(feedback.respostas).toHaveLength(1);
    expect(feedback.respostas[0].tipo).toBe(TipoPergunta.TEXTO);
    expect(feedback.respostas[0].resposta_texto).toBe("Ótimo serviço!");
    expect(feedback.respostas[0].nota).toBeUndefined();
    expect(feedback.respostas[0].opcaoEscolhida).toBeUndefined();
  });

  it("deve lançar erro ao criar feedback com resposta de texto inválida", () => {
    expect(() =>
      Feedback.criar({
        ...baseCriarProps,
        respostas: [{
          perguntaId: randomUUID(),
          tipo: TipoPergunta.TEXTO,
          resposta_texto: "   ",
          data_resposta: new Date(),
        }],
      })
    ).toThrow(FeedbackExceptions.RespostaInvalida);
  });

  it("deve criar feedback com resposta de nota válida", () => {
    const feedback = Feedback.criar({
      ...baseCriarProps,
      respostas: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.NOTA,
        nota: 7,
        data_resposta: new Date(),
      }],
    });

    expect(feedback.respostas[0].tipo).toBe(TipoPergunta.NOTA);
    expect(feedback.respostas[0].nota).toBe(7);
    expect(feedback.respostas[0].resposta_texto).toBeUndefined();
  });

  it("deve lançar erro ao criar feedback com resposta de nota inválida", () => {
    expect(() =>
      Feedback.criar({
        ...baseCriarProps,
        respostas: [{
          perguntaId: randomUUID(),
          tipo: TipoPergunta.NOTA,
          nota: -1,
          data_resposta: new Date(),
        }],
      })
    ).toThrow(FeedbackExceptions.RespostaInvalida);

    expect(() =>
      Feedback.criar({
        ...baseCriarProps,
        respostas: [{
          perguntaId: randomUUID(),
          tipo: TipoPergunta.NOTA,
          nota: 15,
          data_resposta: new Date(),
        }],
      })
    ).toThrow(FeedbackExceptions.RespostaInvalida);
  });

  it("deve criar feedback com resposta de múltipla escolha válida", () => {
    const feedback = Feedback.criar({
      ...baseCriarProps,
      respostas: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcaoEscolhida: "Opção A",
        data_resposta: new Date(),
      }],
    });

    expect(feedback.respostas[0].tipo).toBe(TipoPergunta.MULTIPLA_ESCOLHA);
    expect(feedback.respostas[0].opcaoEscolhida).toBe("Opção A");
    expect(feedback.respostas[0].resposta_texto).toBeUndefined();
  });

  it("deve lançar erro ao criar feedback com resposta de múltipla escolha inválida", () => {
    expect(() =>
      Feedback.criar({
        ...baseCriarProps,
        respostas: [{
          perguntaId: randomUUID(),
          tipo: TipoPergunta.MULTIPLA_ESCOLHA,
          opcaoEscolhida: "   ",
          data_resposta: new Date(),
        }],
      })
    ).toThrow(FeedbackExceptions.RespostaInvalida);
  });

  it("deve realizar exclusão lógica corretamente", () => {
    const feedback = Feedback.criar({
      ...baseCriarProps,
      respostas: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.TEXTO,
        resposta_texto: "Para ser excluído",
        data_resposta: new Date(),
      }],
    });

    expect(feedback.dataExclusao).toBeNull();

    feedback.excluirLogicamente();

    expect(feedback.dataExclusao).not.toBeNull();
  });
});
