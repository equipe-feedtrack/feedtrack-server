import { Pergunta } from "./pergunta.entity";
import { OpcaoDuplicadaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";


describe("Entidade Pergunta", () => {
  it("deve criar uma pergunta do tipo nota com sucesso", () => {
    const pergunta = new Pergunta({
      id: 1,
      texto: "Qual a sua nota?",
      tipo: "nota",
      ordem: 1
    });

    expect(pergunta.texto).toBe("Qual a sua nota?");
    expect(pergunta.tipo).toBe("nota");
    expect(pergunta.opcoes).toBeUndefined();
  });

  it("deve criar uma pergunta do tipo texto corretamente", () => {
    const pergunta = new Pergunta({
      id: 1,
      texto: "Qual o seu nome?",
      tipo: "texto",
      ordem: 1
    });

    expect(pergunta.id).toBe(1);
    expect(pergunta.texto).toBe("Qual o seu nome?");
    expect(pergunta.tipo).toBe("texto");
    expect(pergunta.opcoes).toBeUndefined();
    expect(pergunta.ordem).toBe(1);
  });

  it("deve criar uma pergunta do tipo multipla_escolha com opções válidas", () => {
    const pergunta = new Pergunta({
      id: 2,
      texto: "Qual sua cor favorita?",
      tipo: "multipla_escolha",
      opcoes: ["Azul", "Verde", "Vermelho"],
      ordem: 2
    });

    expect(pergunta.id).toBe(2);
    expect(pergunta.texto).toBe("Qual sua cor favorita?");
    expect(pergunta.tipo).toBe("multipla_escolha");
    expect(pergunta.opcoes).toEqual(["Azul", "Verde", "Vermelho"]);
    expect(pergunta.ordem).toBe(2);
  });

  it("deve lançar exceção se o texto estiver vazio", () => {
    expect(() => new Pergunta({
      id: 2,
      texto: "",
      tipo: "texto",
      ordem: 1
    })).toThrow(PerguntaTextoVazioException);
  });

  it("deve lançar exceção se o tipo for inválido", () => {
    expect(() => new Pergunta({
      id: 3,
      texto: "Texto",
      tipo: "escolha_unica",
      ordem: 1
    })).toThrow(TipoPerguntaInvalidoException);
  });

  it("deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções", () => {
    expect(() => new Pergunta({
      id: 4,
      texto: "Escolha uma opção",
      tipo: "multipla_escolha",
      opcoes: ["Sim"],
      ordem: 1
    })).toThrow(QuantidadeMinimaOpcoesException);
  });

  it("deve lançar exceção se houver opções duplicadas", () => {
    expect(() => new Pergunta({
      id: 5,
      texto: "Escolha uma opção",
      tipo: "multipla_escolha",
      opcoes: ["Sim", "Sim"],
      ordem: 1
    })).toThrow(OpcaoDuplicadaException);
  });

  it("deve lançar exceção se tipo for nota com opções preenchidas", () => {
    expect(() => new Pergunta({
      id: 6,
      texto: "Avalie de 1 a 5",
      tipo: "nota",
      opcoes: ["1", "2", "3", "4", "5"],
      ordem: 1
    })).toThrow(ValidacaoPerguntaException);
  });

  it("deve lançar erro se ordem for menor que 1", () => {
    expect(() => new Pergunta({
      id: 7,
      texto: "Qual sua idade?",
      tipo: "texto",
      ordem: 0
    })).toThrow("A ordem da pergunta deve ser maior ou igual a 1.");
  });
});