import { Pergunta } from "./pergunta.entity";
import { OpcaoDuplicadaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";


describe("Entidade Pergunta: Criar Pergunta", () => {
  it("deve criar uma pergunta do tipo nota com sucesso", () => {
    const pergunta = new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
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
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "O que você sugere de melhoria para o nosso produto?",
      tipo: "texto",
      ordem: 1
    });

    expect(pergunta.id).toBe("89eebea5-2314-47bf-8510-e1ddf69503a9");
    expect(pergunta.texto).toBe("O que você sugere de melhoria para o nosso produto?");
    expect(pergunta.tipo).toBe("texto");
    expect(pergunta.opcoes).toBeUndefined();
    expect(pergunta.ordem).toBe(1);
  });

  it("deve criar uma pergunta do tipo multipla_escolha com opções válidas", () => {
    const pergunta = new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual o seu nível de satisfação?",
      tipo: "multipla_escolha",
      opcoes: ["ruim", "bom", "excelente"],
      ordem: 2
    });

    expect(pergunta.id).toBe("89eebea5-2314-47bf-8510-e1ddf69503a9");
    expect(pergunta.texto).toBe("Qual o seu nível de satisfação?");
    expect(pergunta.tipo).toBe("multipla_escolha");
    expect(pergunta.opcoes).toEqual(["ruim", "bom", "excelente"]);
    expect(pergunta.ordem).toBe(2);
  });

  it("deve lançar exceção se o texto estiver vazio", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "",
      tipo: "texto",
      ordem: 1
    })).toThrow(PerguntaTextoVazioException);
  });

  it("deve lançar exceção se o tipo for inválido", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Texto",
      tipo: "escolha_unica",
      ordem: 1
    })).toThrow(TipoPerguntaInvalidoException);
  });

  it("deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Escolha uma opção",
      tipo: "multipla_escolha",
      opcoes: ["Sim"],
      ordem: 1
    })).toThrow(QuantidadeMinimaOpcoesException);
  });

  it("deve lançar exceção se houver opções duplicadas", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Escolha uma opção",
      tipo: "multipla_escolha",
      opcoes: ["Sim", "Sim"],
      ordem: 1
    })).toThrow(OpcaoDuplicadaException);
  });

  it("deve lançar exceção se tipo for nota com opções preenchidas", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Avalie de 1 a 5",
      tipo: "nota",
      opcoes: ["1", "2", "3", "4", "5"],
      ordem: 1
    })).toThrow(ValidacaoPerguntaException);
  });

  it("deve lançar erro se ordem for menor que 1", () => {
    expect(() => new Pergunta({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      texto: "Qual sua idade?",
      tipo: "texto",
      ordem: 0
    })).toThrow("A ordem da pergunta deve ser maior ou igual a 1.");
  });
});