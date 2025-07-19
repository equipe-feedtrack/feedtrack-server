import { IDEntityUUIDInvalid } from "@shared/domain/domain.exception";
import { describe, expect, it } from "vitest";
import { Pergunta } from "./pergunta.entity";
import { OpcaoDuplicadaException, OpcoesObrigatoriasException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException } from "./pergunta.exception";
import { RecuperarPerguntaProps } from "./pergunta.types";

describe("Entidade Pergunta: Criar Pergunta", () => {
  it("deve criar uma pergunta do tipo nota com sucesso", () => {
    const pergunta = Pergunta.criar({
      texto: "Qual a sua nota?",
      tipo: "nota",
      opcoes: undefined,
      formularioId: "form-001"
    });

    expect(pergunta.texto).toBe("Qual a sua nota?");
    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("deve criar uma pergunta do tipo texto corretamente", () => {
    const pergunta = Pergunta.criar({
      texto: "O que você achou do tênis corre 4?",
      tipo: "texto",
      opcoes: undefined,
      formularioId: "form-002"
    });

    expect(pergunta.texto).toBe("O que você achou do tênis corre 4?");
    expect(pergunta.tipo).toBe("texto");
    expect(pergunta.opcoes).toBeUndefined();
  });

  it("deve criar uma pergunta do tipo multipla_escolha com opções válidas", () => {
    const pergunta = Pergunta.criar({
      texto: "Qual o seu nível de satisfação?",
      tipo: "multipla_escolha",
      opcoes: ["ruim", "bom", "excelente"],
      formularioId: "form-003"
    });

    expect(pergunta.texto).toBe("Qual o seu nível de satisfação?");
    expect(pergunta.tipo).toBe("multipla_escolha");
    expect(pergunta.opcoes).toEqual(["ruim", "bom", "excelente"]);
  });

  it("deve lançar exceção se o texto estiver vazio", () => {
    expect(() =>
      Pergunta.criar({
        texto: "",
        tipo: "texto",
        opcoes: undefined,
        formularioId: "form-004"
      }),
    ).toThrow(PerguntaTextoVazioException);
  });

  it("deve lançar exceção se o tipo for inválido", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Texto",
        tipo: "escolha_unica",
        opcoes: undefined,
        formularioId: "form-005"
      }),
    ).toThrow(TipoPerguntaInvalidoException);
  });

  it("deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Escolha uma opção",
        tipo: "multipla_escolha",
        opcoes: ["Sim"],
        formularioId: "form-006"
      }),
    ).toThrow(QuantidadeMinimaOpcoesException);
  });

  it("deve lançar exceção se houver opções duplicadas", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Escolha uma opção",
        tipo: "multipla_escolha",
        opcoes: ["Sim", "Sim"],
        formularioId: "form-007"
      }),
    ).toThrow(OpcaoDuplicadaException);
  });

  it("Não deve lançar exceção se tipo for nota com opções preenchidas", () => {
    const pergunta = Pergunta.criar({
      texto: "Qual o seu nível de satisfação?",
      tipo: "nota",
      opcoes: ["1", "2", "3"],
      formularioId: "form-008"
    });

    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toEqual(["1", "2", "3"]);
  });

  it("deve atribuir a próxima ordem disponível", () => {
    const novaPergunta = Pergunta.criar({
      texto: "Qual sua idade?",
      tipo: "nota",
      opcoes: ['1', '2', '3'],
      formularioId: "form-009"
    });

  
  });
});

describe("Entidade Pergunta: Recuperar Pergunta", () => {

  it("deve recuperar uma pergunta do tipo nota com sucesso", () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual a sua nota?",
      tipo: "nota",
       formularioId: "form-010"
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe("Qual a sua nota?");
    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toBeDefined();
  });

  it("não deve recuperar uma pergunta com ID inválido (UUID inválido)", () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: "1234",
      texto: "Qual a sua nota?",
      tipo: "nota",
      formularioId: "form-010.1"
    };

    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(IDEntityUUIDInvalid);
  });

  it("deve recuperar uma pergunta do tipo texto sem opções", () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Descreva sua experiência com o produto.",
      tipo: "texto",
      formularioId: "form-011"
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe("Descreva sua experiência com o produto.");
    expect(pergunta.tipo).toBe("texto");
    expect(pergunta.opcoes).toBeUndefined();
  });

  it("deve recuperar uma pergunta do tipo multipla_escolha com opções", () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual é a sua cor favorita?",
      tipo: "multipla_escolha",
      opcoes: ["Azul", "Verde", "Vermelho"],
       formularioId: "form-012"
    };

    const pergunta = Pergunta.recuperar(perguntaValida);

    expect(pergunta).toBeInstanceOf(Pergunta);
    expect(pergunta.texto).toBe("Qual é a sua cor favorita?");
    expect(pergunta.tipo).toBe("multipla_escolha");
    expect(pergunta.opcoes).toEqual(["Azul", "Verde", "Vermelho"]);
  });

  it("não deve recuperar uma pergunta do tipo multipla_escolha com opções vazias", () => {
    const perguntaInvalida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual é a sua fruta favorita?",
      tipo: "multipla_escolha",
      opcoes: [], // opções vazias
       formularioId: "form-013"
    };

    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(OpcoesObrigatoriasException);
  });

});