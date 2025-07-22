import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'; // Ajuste o caminho se necessário
import { Status_formulario } from '@prisma/client'; // Importe o enum do Prisma
import { Envio } from '../envio.entity.ts.js';

describe('Entidade Envio', () => {
  // Mock para controlar o tempo, se necessário para testes de data
  beforeEach(() => {
    vi.useFakeTimers(); 
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockPropsBase = {
    clienteId: 'cliente-id-123',
    usuarioId: 'usuario-id-456',
    formularioId: 'formulario-id-789',
    feedbackId: 'feedback-id-abc',
  };

  // --- Testes para o método 'criar' ---
  it('deve criar uma nova entidade Envio com status PENDENTE e dados corretos', () => {
    const envio = Envio.criar(mockPropsBase);

    expect(envio).toBeInstanceOf(Envio);
    expect(envio.id).toBeDefined(); // ID deve ser gerado
    expect(envio.status).toBe('PENDENTE' as Status_formulario);
    expect(envio.clienteId).toBe(mockPropsBase.clienteId);
    expect(envio.feedbackId).toBe(mockPropsBase.feedbackId);
    expect(envio.props.usuarioId).toBe(mockPropsBase.usuarioId); // Acessa diretamente se não tiver getter
    expect(envio.props.formularioId).toBe(mockPropsBase.formularioId);
    expect(envio.props.dataCriacao).toBeInstanceOf(Date);
    expect(envio.props.tentativasEnvio).toBe(0);
    expect(envio.props.dataEnvio).toBeNull(); // Não deve ter dataEnvio
    expect(envio.props.ultimaMensagemErro).toBeNull(); // Deve ser null
  });

  // --- Testes para o método 'marcarComoEnviado' ---
  it('deve marcar o envio como ENVIADO e registrar a data de envio', () => {
    const envio = Envio.criar(mockPropsBase);
    const dataCriacaoOriginal = envio.props.dataCriacao;

    vi.advanceTimersByTime(1000); // Avança o tempo em 1 segundo

    envio.marcarComoEnviado();

    expect(envio.status).toBe('ENVIADO' as Status_formulario);
    expect(envio.props.dataEnvio).toBeInstanceOf(Date);
    expect(envio.props.dataEnvio?.getTime()).toBeGreaterThan(dataCriacaoOriginal.getTime()); // Data de envio deve ser maior
    expect(envio.props.ultimaMensagemErro).toBeNull(); // Mensagem de erro deve ser limpa
  });

  it('não deve alterar o status ou data de envio se já estiver ENVIADO', () => {
    const envio = Envio.criar(mockPropsBase);
    envio.marcarComoEnviado(); // Marca como enviado a primeira vez
    const dataEnvioOriginal = envio.props.dataEnvio;

    vi.advanceTimersByTime(1000); // Avança o tempo novamente

    envio.marcarComoEnviado(); // Tenta marcar novamente

    expect(envio.status).toBe('ENVIADO' as Status_formulario);
    expect(envio.props.dataEnvio?.getTime()).toBe(dataEnvioOriginal?.getTime()); // Data de envio não deve mudar
  });

  // --- Testes para o método 'marcarComoFalha' ---
  it('deve marcar o envio como FALHA e registrar o motivo e incrementar tentativas', () => {
    const envio = Envio.criar(mockPropsBase);
    const tentativasIniciais = envio.props.tentativasEnvio;
    const motivoFalha = 'Erro de conexão com a API';

    envio.marcarComoFalha(motivoFalha);

    expect(envio.status).toBe('FALHA' as Status_formulario);
    expect(envio.props.tentativasEnvio).toBe(tentativasIniciais + 1);
    expect(envio.props.ultimaMensagemErro).toBe(motivoFalha);
    expect(envio.props.dataEnvio).toBeNull(); // Data de envio não deve ser setada em caso de falha
  });

  it('deve incrementar tentativasEnvio e atualizar o motivo em falhas subsequentes', () => {
    const envio = Envio.criar(mockPropsBase);
    envio.marcarComoFalha('Primeira falha'); // Primeira falha
    const tentativasAposPrimeira = envio.props.tentativasEnvio;
    const novoMotivo = 'Erro de autenticação';

    envio.marcarComoFalha(novoMotivo); // Segunda falha

    expect(envio.status).toBe('FALHA' as Status_formulario);
    expect(envio.props.tentativasEnvio).toBe(tentativasAposPrimeira + 1);
    expect(envio.props.ultimaMensagemErro).toBe(novoMotivo);
  });
});