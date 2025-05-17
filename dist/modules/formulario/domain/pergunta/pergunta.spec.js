"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domain_exception_1 = require("@shared/domain/domain.exception");
const pergunta_entity_1 = require("./pergunta.entity");
const pergunta_exception_1 = require("./pergunta.exception");
describe("Entidade Pergunta: Criar Pergunta", () => {
    it("deve criar uma pergunta do tipo nota com sucesso", async () => {
        const pergunta = new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Qual a sua nota?",
            tipo: "nota",
            ordem: 1
        });
        expect(pergunta.texto).toBe("Qual a sua nota?");
        expect(pergunta.tipo).toBe("nota");
        expect(pergunta.opcoes).toEqual(["1", "2", "3", "4", "5"]);
    });
    it("deve criar uma pergunta do tipo texto corretamente", async () => {
        const pergunta = new pergunta_entity_1.Pergunta({
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
    it("deve criar uma pergunta do tipo multipla_escolha com opções válidas", async () => {
        const pergunta = new pergunta_entity_1.Pergunta({
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
    it("deve lançar exceção se o texto estiver vazio", async () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "",
            tipo: "texto",
            ordem: 1
        })).toThrow(pergunta_exception_1.PerguntaTextoVazioException);
    });
    it("deve lançar exceção se o tipo for inválido", async () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Texto",
            tipo: "escolha_unica",
            ordem: 1
        })).toThrow(pergunta_exception_1.TipoPerguntaInvalidoException);
    });
    it("deve lançar exceção se o tipo for multipla_escolha com menos de 2 opções", async () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Escolha uma opção",
            tipo: "multipla_escolha",
            opcoes: ["Sim"],
            ordem: 1
        })).toThrow(pergunta_exception_1.QuantidadeMinimaOpcoesException);
    });
    it("deve lançar exceção se houver opções duplicadas", async () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Escolha uma opção",
            tipo: "multipla_escolha",
            opcoes: ["Sim", "Sim"],
            ordem: 1
        })).toThrow(pergunta_exception_1.OpcaoDuplicadaException);
    });
    it("Não deve lançar exceção se tipo for nota com opções preenchidas", async () => {
        const pergunta = new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Qual o seu nível de satisfação?",
            tipo: "nota",
            opcoes: ["1", "2", "3"],
            ordem: 2
        });
        expect(pergunta.id).toBe("89eebea5-2314-47bf-8510-e1ddf69503a9");
        expect(pergunta.tipo).toBe("nota");
        expect(pergunta.opcoes).toEqual(["1", "2", "3"]);
        expect(pergunta.ordem).toBe(2);
    });
    it("deve lançar erro se ordem for menor que 1", async () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Qual sua idade?",
            tipo: "texto",
            ordem: 0
        })).toThrow("A ordem da pergunta deve ser maior ou igual a 1.");
    });
    it("deve criar uma pergunta do tipo 'nota' com opções padrão se não forem fornecidas", () => {
        const pergunta = new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Avalie nosso atendimento",
            tipo: "nota",
            ordem: 1
        });
        expect(pergunta.opcoes).toEqual(["1", "2", "3", "4", "5"]);
    });
    it("deve lançar exceção se houver opção não numérica em pergunta tipo 'nota'", () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Avalie algo",
            tipo: "nota",
            opcoes: ["1", "2", "bom", "4"],
            ordem: 1
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException);
    });
    it("deve lançar exceção se pergunta do tipo 'texto' vier com opções", () => {
        expect(() => new pergunta_entity_1.Pergunta({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Digite sua opinião",
            tipo: "texto",
            opcoes: ["Sim", "Não"], // Deve lançar erro
            ordem: 1
        })).toThrow(pergunta_exception_1.ValidacaoPerguntaException);
    });
});
describe("Entidade Pergunta: Recuperar Pergunta", () => {
    it("deve recuperar uma pergunta do tipo nota com sucesso", async () => {
        const perguntaValida = {
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            texto: "Qual a sua nota?",
            tipo: "nota",
            ordem: 1
        };
        expect(pergunta_entity_1.Pergunta.recuperar(perguntaValida)).toBeInstanceOf(pergunta_entity_1.Pergunta);
    });
    it("não deve recuperar uma pergunta do tipo nota com ID Inválido (UUID Inválido)", async () => {
        const perguntaInValida = {
            id: "1234",
            texto: "Qual a sua nota?",
            tipo: "nota",
            ordem: 1
        };
        expect(() => pergunta_entity_1.Pergunta.recuperar(perguntaInValida)).toThrow(domain_exception_1.IDEntityUUIDInvalid);
    });
    it('deve recuperar uma pergunta do tipo texto sem opções', () => {
        const perguntaInValida = {
            id: '124',
            texto: 'Descreva sua experiência com o produto.',
            tipo: 'texto',
            ordem: 2
        };
        // Verificando as propriedades da pergunta
        expect(perguntaInValida.id).toBe('124');
        expect(perguntaInValida.texto).toBe('Descreva sua experiência com o produto.');
        expect(perguntaInValida.tipo).toBe('texto');
        expect(perguntaInValida.ordem).toBe(2);
    });
    it('deve recuperar uma pergunta do tipo multipla_escolha com opções', () => {
        const perguntaInValida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual é a sua cor favorita?',
            tipo: 'multipla_escolha',
            opcoes: ['Azul', 'Verde', 'Vermelho'],
            ordem: 1
        };
        // Verificando as propriedades da pergunta
        expect(perguntaInValida.id).toBe('89eebea5-2314-47bf-8510-e1ddf69503a9');
        expect(perguntaInValida.texto).toBe('Qual é a sua cor favorita?');
        expect(perguntaInValida.tipo).toBe('multipla_escolha');
        expect(perguntaInValida.opcoes).toEqual(['Azul', 'Verde', 'Vermelho']);
        expect(perguntaInValida.ordem).toBe(1);
    });
    it('Não deve recuperar uma pergunta do tipo multipla_escolha com opcoes vazias', () => {
        const perguntaInValida = {
            id: '89eebea5-2314-47bf-8510-e1ddf69503a9',
            texto: 'Qual é a sua fruta favorita?',
            tipo: 'multipla_escolha',
            opcoes: [], // opcoes vazias
            ordem: 3
        };
        expect(() => pergunta_entity_1.Pergunta.recuperar(perguntaInValida)).toThrow(pergunta_exception_1.OpcoesObrigatoriasException);
    });
});
//# sourceMappingURL=pergunta.spec.js.map