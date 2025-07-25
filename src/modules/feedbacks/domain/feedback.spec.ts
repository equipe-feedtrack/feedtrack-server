import { describe, it, expect } from "vitest";
import { Feedback } from "./feedback.entity";
import { TipoPergunta } from "@shared/domain/data.types";

describe("Feedback Entity", () => {
  const baseProps = {
    id: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
    formularioId: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
    perguntaId: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
    data_resposta: new Date(),
  };

  it("deve criar feedback texto com resposta válida", () => {
    const feedback = Feedback.criarFeedback({
      ...baseProps,
      tipo: TipoPergunta.TEXTO,
      resposta_texto: "Ótimo serviço!",
    });

    expect(feedback.tipo).toBe(TipoPergunta.TEXTO);
    expect(feedback.resposta_texto).toBe("Ótimo serviço!");
    expect(feedback.nota).toBeUndefined();
    expect(feedback.opcaoEscolhida).toBeUndefined();
  });

  it("deve lançar erro ao criar feedback texto sem resposta", () => {
    expect(() =>
      Feedback.criarFeedback({
        ...baseProps,
        tipo: TipoPergunta.TEXTO,
        resposta_texto: "   ",
      })
    ).toThrow("Resposta textual obrigatória.");
  });

  it("deve criar feedback nota com valor válido", () => {
    const feedback = Feedback.criarFeedback({
      ...baseProps,
      tipo: TipoPergunta.NOTA,
      nota: 7,
    });

    expect(feedback.tipo).toBe(TipoPergunta.NOTA);
    expect(feedback.nota).toBe(7);
    expect(feedback.resposta_texto).toBeUndefined();
  });

  it("deve lançar erro ao criar feedback nota com valor inválido", () => {
    expect(() =>
      Feedback.criarFeedback({
        ...baseProps,
        tipo: TipoPergunta.NOTA,
        nota: -1,
      })
    ).toThrow("Nota inválida.");

    expect(() =>
      Feedback.criarFeedback({
        ...baseProps,
        tipo: TipoPergunta.NOTA,
        nota: 15,
      })
    ).toThrow("Nota inválida.");
  });

  it("deve criar feedback múltipla escolha com opção válida", () => {
    const feedback = Feedback.criarFeedback({
      ...baseProps,
      tipo: TipoPergunta.MULTIPLA_ESCOLHA,
      opcaoEscolhida: "Opção A",
    });

    expect(feedback.tipo).toBe(TipoPergunta.MULTIPLA_ESCOLHA);
    expect(feedback.opcaoEscolhida).toBe("Opção A");
  });

  it("deve lançar erro ao criar feedback múltipla escolha sem opção", () => {
    expect(() =>
      Feedback.criarFeedback({
        ...baseProps,
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcaoEscolhida: "",
      })
    ).toThrow("Opção da múltipla escolha é obrigatória.");
  });

  it("deve converter para DTO corretamente", () => {
    const feedback = new Feedback({
      ...baseProps,
      tipo: TipoPergunta.TEXTO,
      resposta_texto: "Resposta teste",
    });

    const dto = feedback.toDTO();

    expect(dto).toEqual({
     ...baseProps,
      tipo: TipoPergunta.TEXTO,
      resposta_texto: "Resposta teste",
      nota: undefined,
      opcaoEscolhida: undefined,
    });
  });
});
