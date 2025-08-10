"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const envio_exceptios_1 = require("../envio.exceptios");
const envio_entity_ts_1 = require("../envio.entity.ts");
(0, vitest_1.describe)('Entidade Envio', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    const mockPropsBase = {
        clienteId: (0, crypto_1.randomUUID)(),
        usuarioId: (0, crypto_1.randomUUID)(),
        formularioId: (0, crypto_1.randomUUID)(),
        campanhaId: (0, crypto_1.randomUUID)(),
    };
    (0, vitest_1.it)('deve criar uma nova entidade Envio com status PENDENTE e dados corretos', () => {
        const envio = envio_entity_ts_1.Envio.criar(mockPropsBase);
        (0, vitest_1.expect)(envio).toBeInstanceOf(envio_entity_ts_1.Envio);
        (0, vitest_1.expect)(envio.id).toBeDefined();
        (0, vitest_1.expect)(envio.status).toBe(client_1.StatusFormulario.PENDENTE);
        (0, vitest_1.expect)(envio.clienteId).toBe(mockPropsBase.clienteId);
        (0, vitest_1.expect)(envio.formularioId).toBe(mockPropsBase.formularioId);
        (0, vitest_1.expect)(envio.campanhaId).toBe(mockPropsBase.campanhaId);
        (0, vitest_1.expect)(envio.usuarioId).toBe(mockPropsBase.usuarioId);
        (0, vitest_1.expect)(envio.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(envio.tentativasEnvio).toBe(0);
        (0, vitest_1.expect)(envio.dataEnvio).toBeNull();
        (0, vitest_1.expect)(envio.ultimaMensagemErro).toBeNull();
        (0, vitest_1.expect)(envio.feedbackId).toBeNull();
    });
    (0, vitest_1.it)('deve lançar erro se o ID da campanha não for fornecido', () => {
        const propsSemCampanha = { ...mockPropsBase, campanhaId: undefined };
        (0, vitest_1.expect)(() => envio_entity_ts_1.Envio.criar(propsSemCampanha)).toThrow(envio_exceptios_1.EnvioExceptions);
    });
    (0, vitest_1.it)('deve marcar o envio como ENVIADO e registrar a data de envio', () => {
        const envio = envio_entity_ts_1.Envio.criar(mockPropsBase);
        const dataCriacaoOriginal = envio.dataCriacao;
        vitest_1.vi.advanceTimersByTime(1000);
        envio.marcarComoEnviado();
        (0, vitest_1.expect)(envio.status).toBe(client_1.StatusFormulario.ENVIADO);
        (0, vitest_1.expect)(envio.dataEnvio).toBeInstanceOf(Date);
        (0, vitest_1.expect)(envio.dataEnvio?.getTime()).toBeGreaterThan(dataCriacaoOriginal.getTime());
        (0, vitest_1.expect)(envio.ultimaMensagemErro).toBeNull();
    });
    (0, vitest_1.it)('deve registrar falha, incrementar tentativas e registrar mensagem de erro', () => {
        const envio = envio_entity_ts_1.Envio.criar(mockPropsBase);
        const tentativasIniciais = envio.tentativasEnvio;
        const motivoFalha = 'Erro de conexão com a API';
        envio.registrarFalha(motivoFalha);
        (0, vitest_1.expect)(envio.status).toBe(client_1.StatusFormulario.FALHA);
        (0, vitest_1.expect)(envio.tentativasEnvio).toBe(tentativasIniciais + 1);
        (0, vitest_1.expect)(envio.ultimaMensagemErro).toBe(motivoFalha);
        (0, vitest_1.expect)(envio.dataEnvio).toBeNull();
    });
    (0, vitest_1.it)('deve associar um feedback ao envio', () => {
        const envio = envio_entity_ts_1.Envio.criar(mockPropsBase);
        const feedbackId = (0, crypto_1.randomUUID)();
        envio.associarFeedback(feedbackId);
        (0, vitest_1.expect)(envio.feedbackId).toBe(feedbackId);
    });
});
//# sourceMappingURL=envio.entity.spec.js.map