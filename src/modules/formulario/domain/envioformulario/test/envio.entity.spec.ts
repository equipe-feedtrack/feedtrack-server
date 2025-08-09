import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { StatusFormulario } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EnvioExceptions } from '../envio.exceptios';
import { Envio } from '../envio.entity.ts';

describe('Entidade Envio', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockPropsBase = {
    clienteId: randomUUID(),
    usuarioId: randomUUID(),
    formularioId: randomUUID(),
    campanhaId: randomUUID(),
  };

  it('deve criar uma nova entidade Envio com status PENDENTE e dados corretos', () => {
    const envio = Envio.criar(mockPropsBase);

    expect(envio).toBeInstanceOf(Envio);
    expect(envio.id).toBeDefined();
    expect(envio.status).toBe(StatusFormulario.PENDENTE);
    expect(envio.clienteId).toBe(mockPropsBase.clienteId);
    expect(envio.formularioId).toBe(mockPropsBase.formularioId);
    expect(envio.campanhaId).toBe(mockPropsBase.campanhaId);
    expect(envio.usuarioId).toBe(mockPropsBase.usuarioId);
    expect(envio.dataCriacao).toBeInstanceOf(Date);
    expect(envio.tentativasEnvio).toBe(0);
    expect(envio.dataEnvio).toBeNull();
    expect(envio.ultimaMensagemErro).toBeNull();
    expect(envio.feedbackId).toBeNull();
  });

  it('deve lançar erro se o ID da campanha não for fornecido', () => {
    const propsSemCampanha = { ...mockPropsBase, campanhaId: undefined };
    expect(() => Envio.criar(propsSemCampanha as any)).toThrow(EnvioExceptions);
  });

  it('deve marcar o envio como ENVIADO e registrar a data de envio', () => {
    const envio = Envio.criar(mockPropsBase);
    const dataCriacaoOriginal = envio.dataCriacao;

    vi.advanceTimersByTime(1000);

    envio.marcarComoEnviado();

    expect(envio.status).toBe(StatusFormulario.ENVIADO);
    expect(envio.dataEnvio).toBeInstanceOf(Date);
    expect(envio.dataEnvio?.getTime()).toBeGreaterThan(dataCriacaoOriginal.getTime());
    expect(envio.ultimaMensagemErro).toBeNull();
  });

  it('deve registrar falha, incrementar tentativas e registrar mensagem de erro', () => {
    const envio = Envio.criar(mockPropsBase);
    const tentativasIniciais = envio.tentativasEnvio;
    const motivoFalha = 'Erro de conexão com a API';

    envio.registrarFalha(motivoFalha);

    expect(envio.status).toBe(StatusFormulario.FALHA);
    expect(envio.tentativasEnvio).toBe(tentativasIniciais + 1);
    expect(envio.ultimaMensagemErro).toBe(motivoFalha);
    expect(envio.dataEnvio).toBeNull();
  });

  it('deve associar um feedback ao envio', () => {
    const envio = Envio.criar(mockPropsBase);
    const feedbackId = randomUUID();

    envio.associarFeedback(feedbackId);

    expect(envio.feedbackId).toBe(feedbackId);
  });
});
