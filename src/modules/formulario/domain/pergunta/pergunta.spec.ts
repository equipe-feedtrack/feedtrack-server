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
      ordensUsadas: [],
      opcoes: undefined,
    });

    expect(pergunta.texto).toBe("Qual a sua nota?");
    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("deve criar uma pergunta do tipo texto corretamente", () => {
    const pergunta = Pergunta.criar({
      texto: "O que você sugere de melhoria para o nosso produto?",
      tipo: "texto",
      ordensUsadas: [],
      opcoes: undefined,
    });

    expect(pergunta.texto).toBe("O que você sugere de melhoria para o nosso produto?");
    expect(pergunta.tipo).toBe("texto");
    expect(pergunta.opcoes).toBeUndefined();
  });

  it("deve criar uma pergunta do tipo multipla_escolha com opções válidas", () => {
    const pergunta = Pergunta.criar({
      texto: "Qual o seu nível de satisfação?",
      tipo: "multipla_escolha",
      ordensUsadas: [],
      opcoes: ["ruim", "bom", "excelente"],
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
        ordensUsadas: [],
        opcoes: undefined,
      }),
    ).toThrow(PerguntaTextoVazioException);
  });

  it("deve lançar exceção se o tipo for inválido", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Texto",
        tipo: "escolha_unica",
        ordensUsadas: [],
        opcoes: undefined,
      }),
    ).toThrow(TipoPerguntaInvalidoException);
  });

  it("deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Escolha uma opção",
        tipo: "multipla_escolha",
        ordensUsadas: [],
        opcoes: ["Sim"],
      }),
    ).toThrow(QuantidadeMinimaOpcoesException);
  });

  it("deve lançar exceção se houver opções duplicadas", () => {
    expect(() =>
      Pergunta.criar({
        texto: "Escolha uma opção",
        tipo: "multipla_escolha",
        ordensUsadas: [],
        opcoes: ["Sim", "Sim"],
      }),
    ).toThrow(OpcaoDuplicadaException);
  });

  it("Não deve lançar exceção se tipo for nota com opções preenchidas", () => {
    const pergunta = Pergunta.criar({
      texto: "Qual o seu nível de satisfação?",
      tipo: "nota",
      ordensUsadas: [],
      opcoes: ["1", "2", "3"],
    });

    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toEqual(["1", "2", "3"]);
  });

  it("deve atribuir a próxima ordem disponível", () => {
    const ordensUsadas = [1, 2, 3];
    const novaPergunta = Pergunta.criar({
      texto: "Qual sua idade?",
      tipo: "nota",
      opcoes: ['1', '2', '3'],
      ordensUsadas,
    });

    expect(novaPergunta.ordem).toBe(4);
  });
});

describe("Entidade Pergunta: Recuperar Pergunta", () => {

  it("deve recuperar uma pergunta do tipo nota com sucesso", () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual a sua nota?",
      tipo: "nota",
      ordem: 1,
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
      ordem: 1,
    };

    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(IDEntityUUIDInvalid);
  });

  it("deve recuperar uma pergunta do tipo texto sem opções", () => {
    const perguntaValida: RecuperarPerguntaProps = {
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Descreva sua experiência com o produto.",
      tipo: "texto",
      ordem: 2,
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
      ordem: 1,
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
      ordem: 3,
    };

    expect(() => Pergunta.recuperar(perguntaInvalida)).toThrow(OpcoesObrigatoriasException);
  });

});