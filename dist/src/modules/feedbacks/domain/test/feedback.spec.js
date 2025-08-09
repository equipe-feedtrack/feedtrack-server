"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crypto_1 = require("crypto");
const data_types_1 = require("@shared/domain/data.types");
const feedback_entity_1 = require("../feedback.entity");
const feedback_exceptions_1 = require("../feedback.exceptions");
(0, vitest_1.describe)("Feedback Entity", () => {
    const baseCriarProps = {
        formularioId: (0, crypto_1.randomUUID)(),
        envioId: (0, crypto_1.randomUUID)(),
    };
    (0, vitest_1.it)("deve criar feedback com resposta de texto válida", () => {
        const feedback = feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.TEXTO,
                    resposta_texto: "Ótimo serviço!",
                    data_resposta: new Date(),
                }],
        });
        (0, vitest_1.expect)(feedback.formularioId).toBe(baseCriarProps.formularioId);
        (0, vitest_1.expect)(feedback.envioId).toBe(baseCriarProps.envioId);
        (0, vitest_1.expect)(feedback.respostas).toHaveLength(1);
        (0, vitest_1.expect)(feedback.respostas[0].tipo).toBe(data_types_1.TipoPergunta.TEXTO);
        (0, vitest_1.expect)(feedback.respostas[0].resposta_texto).toBe("Ótimo serviço!");
        (0, vitest_1.expect)(feedback.respostas[0].nota).toBeUndefined();
        (0, vitest_1.expect)(feedback.respostas[0].opcaoEscolhida).toBeUndefined();
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback com resposta de texto inválida", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.TEXTO,
                    resposta_texto: "   ",
                    data_resposta: new Date(),
                }],
        })).toThrow(feedback_exceptions_1.FeedbackExceptions.RespostaInvalida);
    });
    (0, vitest_1.it)("deve criar feedback com resposta de nota válida", () => {
        const feedback = feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.NOTA,
                    nota: 7,
                    data_resposta: new Date(),
                }],
        });
        (0, vitest_1.expect)(feedback.respostas[0].tipo).toBe(data_types_1.TipoPergunta.NOTA);
        (0, vitest_1.expect)(feedback.respostas[0].nota).toBe(7);
        (0, vitest_1.expect)(feedback.respostas[0].resposta_texto).toBeUndefined();
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback com resposta de nota inválida", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.NOTA,
                    nota: -1,
                    data_resposta: new Date(),
                }],
        })).toThrow(feedback_exceptions_1.FeedbackExceptions.RespostaInvalida);
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.NOTA,
                    nota: 15,
                    data_resposta: new Date(),
                }],
        })).toThrow(feedback_exceptions_1.FeedbackExceptions.RespostaInvalida);
    });
    (0, vitest_1.it)("deve criar feedback com resposta de múltipla escolha válida", () => {
        const feedback = feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.MULTIPLA_ESCOLHA,
                    opcaoEscolhida: "Opção A",
                    data_resposta: new Date(),
                }],
        });
        (0, vitest_1.expect)(feedback.respostas[0].tipo).toBe(data_types_1.TipoPergunta.MULTIPLA_ESCOLHA);
        (0, vitest_1.expect)(feedback.respostas[0].opcaoEscolhida).toBe("Opção A");
        (0, vitest_1.expect)(feedback.respostas[0].resposta_texto).toBeUndefined();
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback com resposta de múltipla escolha inválida", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.MULTIPLA_ESCOLHA,
                    opcaoEscolhida: "   ",
                    data_resposta: new Date(),
                }],
        })).toThrow(feedback_exceptions_1.FeedbackExceptions.RespostaInvalida);
    });
    (0, vitest_1.it)("deve realizar exclusão lógica corretamente", () => {
        const feedback = feedback_entity_1.Feedback.criar({
            ...baseCriarProps,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.TEXTO,
                    resposta_texto: "Para ser excluído",
                    data_resposta: new Date(),
                }],
        });
        (0, vitest_1.expect)(feedback.dataExclusao).toBeNull();
        feedback.excluirLogicamente();
        (0, vitest_1.expect)(feedback.dataExclusao).not.toBeNull();
    });
});
//# sourceMappingURL=feedback.spec.js.map