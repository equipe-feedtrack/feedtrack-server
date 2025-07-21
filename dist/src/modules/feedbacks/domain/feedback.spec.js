"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const feedback_entity_1 = require("./feedback.entity");
const data_types_1 = require("@shared/domain/data.types");
(0, vitest_1.describe)("Feedback Entity", () => {
    const baseProps = {
        id: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
        formularioId: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
        perguntaId: "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3",
        data_resposta: new Date(),
    };
    (0, vitest_1.it)("deve criar feedback texto com resposta válida", () => {
        const feedback = feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.TEXTO,
            resposta_texto: "Ótimo serviço!",
        });
        (0, vitest_1.expect)(feedback.tipo).toBe(data_types_1.TipoPergunta.TEXTO);
        (0, vitest_1.expect)(feedback.resposta_texto).toBe("Ótimo serviço!");
        (0, vitest_1.expect)(feedback.nota).toBeUndefined();
        (0, vitest_1.expect)(feedback.opcaoEscolhida).toBeUndefined();
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback texto sem resposta", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.TEXTO,
            resposta_texto: "   ",
        })).toThrow("Resposta textual obrigatória.");
    });
    (0, vitest_1.it)("deve criar feedback nota com valor válido", () => {
        const feedback = feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.NOTA,
            nota: 7,
        });
        (0, vitest_1.expect)(feedback.tipo).toBe(data_types_1.TipoPergunta.NOTA);
        (0, vitest_1.expect)(feedback.nota).toBe(7);
        (0, vitest_1.expect)(feedback.resposta_texto).toBeUndefined();
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback nota com valor inválido", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.NOTA,
            nota: -1,
        })).toThrow("Nota inválida.");
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.NOTA,
            nota: 15,
        })).toThrow("Nota inválida.");
    });
    (0, vitest_1.it)("deve criar feedback múltipla escolha com opção válida", () => {
        const feedback = feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.MULTIPLA_ESCOLHA,
            opcaoEscolhida: "Opção A",
        });
        (0, vitest_1.expect)(feedback.tipo).toBe(data_types_1.TipoPergunta.MULTIPLA_ESCOLHA);
        (0, vitest_1.expect)(feedback.opcaoEscolhida).toBe("Opção A");
    });
    (0, vitest_1.it)("deve lançar erro ao criar feedback múltipla escolha sem opção", () => {
        (0, vitest_1.expect)(() => feedback_entity_1.Feedback.criarFeedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.MULTIPLA_ESCOLHA,
            opcaoEscolhida: "",
        })).toThrow("Opção da múltipla escolha é obrigatória.");
    });
    (0, vitest_1.it)("deve converter para DTO corretamente", () => {
        const feedback = new feedback_entity_1.Feedback({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.TEXTO,
            resposta_texto: "Resposta teste",
        });
        const dto = feedback.toDTO();
        (0, vitest_1.expect)(dto).toEqual({
            ...baseProps,
            tipo: data_types_1.TipoPergunta.TEXTO,
            resposta_texto: "Resposta teste",
            nota: undefined,
            opcaoEscolhida: undefined,
        });
    });
});
//# sourceMappingURL=feedback.spec.js.map