import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Campanha } from "../campanha.entity";
import { RecuperarCampanhaProps, SegmentoAlvo, TipoCampanha } from "../campanha.types";
import { CanalEnvio } from "@prisma/client";

describe('Entidade Campanha', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Controla o tempo para testes de data
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Props base para criar Campanhas nos testes
  const baseProps = {
    titulo: 'Campanha de Verão 2025',
    descricao: 'Promoção para novos clientes de verão',
    tipoCampanha: TipoCampanha.PROMOCIONAL,
    segmentoAlvo: SegmentoAlvo.NOVOS_CLIENTES,
    canalEnvio: CanalEnvio.EMAIL,
    dataInicio: new Date('2025-01-01T00:00:00Z'),
    dataFim: new Date('2025-03-31T23:59:59Z'),
    templateMensagem: 'Olá, {{cliente_nome}}! Aproveite nossa promoção de verão: ...',
    formularioId: 'form-id-campanha-1',
    canalEnvio: CanalEnvio.EMAIL,
  };

  // --- Testes para o método 'criar' ---
  it('deve criar uma nova campanha com todos os dados e status ativo por padrão', () => {
    const campanha = Campanha.criar(baseProps);

    expect(campanha).toBeInstanceOf(Campanha);
    expect(campanha.id).toBeDefined();
    expect(campanha.titulo).toBe(baseProps.titulo);
    expect(campanha.descricao).toBe(baseProps.descricao);
    expect(campanha.tipoCampanha).toBe(baseProps.tipoCampanha);
    expect(campanha.segmentoAlvo).toBe(baseProps.segmentoAlvo);
    expect(campanha.dataInicio).toEqual(baseProps.dataInicio);
    expect(campanha.dataFim).toEqual(baseProps.dataFim);
    expect(campanha.templateMensagem).toBe(baseProps.templateMensagem);
    expect(campanha.formularioId).toBe(baseProps.formularioId);
    expect(campanha.ativo).toBe(true); // Padrão
    expect(campanha.dataCriacao).toBeInstanceOf(Date);
    expect(campanha.dataAtualizacao).toBeInstanceOf(Date);
    expect(campanha.dataExclusao).toBeNull();
  });

  it('deve criar uma campanha sem descrição e sem data fim', () => {
    const campanha = Campanha.criar({
      ...baseProps,
      canalEnvio: 'email',
      descricao: undefined,
      dataFim: null,
    });

    expect(campanha.descricao).toBeUndefined();
    expect(campanha.dataFim).toBeNull();
  });

  it('deve lançar erro ao criar campanha com título vazio', () => {
    expect(() => Campanha.criar({ ...baseProps, titulo: '' })).toThrowError(
      'Título da campanha não pode ser vazio.',
    );
  });

  it('deve lançar erro ao criar campanha com template de mensagem vazio', () => {
    expect(() => Campanha.criar({ ...baseProps, templateMensagem: ' ' })).toThrowError(
      'Template da mensagem não pode ser vazio.',
    );
  });

  it('deve lançar erro ao criar campanha com ID de formulário vazio', () => {
    expect(() => Campanha.criar({ ...baseProps, formularioId: '' })).toThrowError(
      'ID do formulário não pode ser vazio.',
    );
  });

  // --- Testes para o método 'recuperar' ---
  it('deve recuperar uma campanha existente corretamente', () => {
    const recuperacaoProps: RecuperarCampanhaProps = {
      id: '1da68d4a-5c24-4f81-a7e8-e5f3b7c2a1d9',
      titulo: 'Campanha Antiga',
      descricao: 'Descrição antiga',
      tipoCampanha: TipoCampanha.SATISFACAO,
      segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
      canalEnvio: CanalEnvio.EMAIL,
      dataInicio: new Date('2024-01-01T00:00:00Z'),
      dataFim: null,
      templateMensagem: 'Template antigo',
      formularioId: '1da68d4a-5c24-4f81-a7e8-e5f3b7c2a1d9',
      canalEnvio: CanalEnvio.WHATSAPP,
      ativo: false, // Pode ser inativa
      dataCriacao: new Date('2024-01-01T00:00:00Z'),
      dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
      dataExclusao: new Date('2024-02-01T00:00:00Z'),
    };

    const campanha = Campanha.recuperar(recuperacaoProps);

    expect(campanha).toBeInstanceOf(Campanha);
    expect(campanha.id).toBe(recuperacaoProps.id);
    expect(campanha.titulo).toBe(recuperacaoProps.titulo);
    expect(campanha.ativo).toBe(false);
    expect(campanha.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
  });

  // --- Testes para Métodos de Comportamento ---
  it('deve ativar uma campanha inativa com sucesso', () => {
    const campanha = Campanha.criar(baseProps);
    campanha.desativar(); // Coloca em estado inativo para testar ativação
    expect(campanha.ativo).toBe(false);
    const oldUpdateDate = campanha.dataAtualizacao;

    vi.advanceTimersByTime(100);

    campanha.ativar();

    expect(campanha.ativo).toBe(true);
    expect(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('não deve ativar uma campanha já ativa', () => {
    const campanha = Campanha.criar(baseProps); // Já é ativa
    expect(() => campanha.ativar()).toThrowError('Campanha já está ativa.');
  });

  it('deve desativar uma campanha ativa com sucesso', () => {
    const campanha = Campanha.criar(baseProps); // É ativa
    expect(campanha.ativo).toBe(true);
    expect(campanha.dataExclusao).toBeNull();
    const oldUpdateDate = campanha.dataAtualizacao;

    vi.advanceTimersByTime(100);

    campanha.desativar();

    expect(campanha.ativo).toBe(false);
    expect(campanha.dataExclusao).toBeInstanceOf(Date);
    expect(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('não deve desativar uma campanha já inativa', () => {
    const campanha = Campanha.criar(baseProps);
    campanha.desativar(); // Coloca em estado inativo
    expect(() => campanha.desativar()).toThrowError('Campanha já está inativa.');
  });

  it('deve atualizar o período da campanha com sucesso', () => {
    const campanha = Campanha.criar(baseProps);
    const oldDataInicio = campanha.dataInicio;
    const oldDataAtualizacao = campanha.dataAtualizacao;

    vi.advanceTimersByTime(100);

    const novaDataInicio = new Date('2025-04-01T00:00:00Z');
    const novaDataFim = new Date('2025-06-30T23:59:59Z');
    campanha.atualizarPeriodo(novaDataInicio, novaDataFim);

    expect(campanha.dataInicio).toEqual(novaDataInicio);
    expect(campanha.dataFim).toEqual(novaDataFim);
    expect(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldDataAtualizacao.getTime());
  });

  it('deve lançar erro ao atualizar período com data fim anterior à data início', () => {
    const campanha = Campanha.criar(baseProps);
    const dataInicioInvalida = new Date('2025-05-01T00:00:00Z');
    const dataFimInvalida = new Date('2025-04-30T23:59:59Z');

    expect(() => campanha.atualizarPeriodo(dataInicioInvalida, dataFimInvalida)).toThrowError(
      'Data de fim da campanha não pode ser anterior à data de início.',
    );
  });

  it('deve atualizar o template da mensagem com sucesso', () => {
    const campanha = Campanha.criar(baseProps);
    const oldTemplate = campanha.templateMensagem;
    const oldUpdateDate = campanha.dataAtualizacao;

    vi.advanceTimersByTime(100);

    const novoTemplate = 'Novo template de mensagem para clientes';
    campanha.atualizarTemplate(novoTemplate);

    expect(campanha.templateMensagem).toBe(novoTemplate);
    expect(campanha.templateMensagem).not.toBe(oldTemplate);
    expect(campanha.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
  });

  it('deve lançar erro ao atualizar o template da mensagem com template vazio', () => {
    const campanha = Campanha.criar(baseProps);
    expect(() => campanha.atualizarTemplate('')).toThrowError(
      'Template da mensagem não pode ser vazio.',
    );
    expect(() => campanha.atualizarTemplate('   ')).toThrowError(
      'Template da mensagem não pode ser vazio.',
    );
  });
});