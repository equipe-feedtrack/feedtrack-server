import { describe, expect, it } from 'vitest';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { Campanha as CampanhaPrisma, CanalEnvio } from '@prisma/client';
import { SegmentoAlvo, TipoCampanha } from '@modules/campanha/domain/campanha.types';
import { CampanhaMap } from '../campanha.map';

describe('CampanhaMap', () => {
  // =================================================================
  // DADOS DE TESTE 100% FIXOS E PREVISÍVEIS
  // =================================================================
  const dataFixaCriacao = new Date('2024-12-01T08:00:00.000Z');
  const dataFixaAtualizacao = new Date('2024-12-01T09:30:00.000Z');
  const dataFixaInicio = new Date('2025-01-01T10:00:00.000Z');
  const dataFixaFim = new Date('2025-01-31T23:59:59.000Z');
  const dataFixaExclusao = new Date('2025-03-05T10:00:00.000Z');

  // Instâncias da entidade Campanha
  const mockCampanhaDomain = Campanha.recuperar({
    id: 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c',
    titulo: 'Campanha Teste Completa',
    descricao: 'Descrição do teste',
    tipoCampanha: TipoCampanha.POS_COMPRA,
    segmentoAlvo: SegmentoAlvo.NOVOS_CLIENTES,
    canalEnvio: CanalEnvio.WHATSAPP,
    dataInicio: dataFixaInicio,
    dataFim: dataFixaFim,
    templateMensagem: 'Template de mensagem para clientes novos.',
    formularioId: 'form-uuid-01',
    ativo: true,
    dataCriacao: dataFixaCriacao,
    dataAtualizacao: dataFixaAtualizacao,
    dataExclusao: null,
  });

  const mockCampanhaDomainSemOpcionais = Campanha.recuperar({
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    titulo: 'Campanha Sem Opcionais',
    descricao: undefined,
    tipoCampanha: TipoCampanha.AUTOMATICO,
    segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
    dataInicio: dataFixaInicio,
    dataFim: null,
    templateMensagem: 'Template simples.',
    formularioId: 'form-uuid-02',
    canalEnvio: CanalEnvio.EMAIL,
    ativo: true,
    dataCriacao: dataFixaCriacao,
    dataAtualizacao: dataFixaAtualizacao,
    dataExclusao: null,
  });

  const mockCampanhaDomainInativa = Campanha.recuperar({
    id: 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5',
    titulo: 'Campanha Inativa',
    descricao: 'Campanha que foi desativada.',
    tipoCampanha: TipoCampanha.PROMOCIONAL,
    segmentoAlvo: SegmentoAlvo.CLIENTES_REGULARES,
    dataInicio: dataFixaInicio,
    dataFim: null,
    templateMensagem: 'Template de promoção.',
    formularioId: 'form-uuid-03',
    canalEnvio: CanalEnvio.EMAIL,
    ativo: false,
    dataCriacao: dataFixaCriacao,
    dataAtualizacao: dataFixaExclusao,
    dataExclusao: dataFixaExclusao,
  });


  // --- Testes para toDomain ---
  describe('toDomain', () => {
    it('deve converter dados crus do Prisma para uma entidade Campanha completa', () => {
      const rawPrisma: CampanhaPrisma = {
        id: mockCampanhaDomain.id,
        titulo: mockCampanhaDomain.titulo,
        descricao: mockCampanhaDomain.descricao!,
        tipoCampanha: mockCampanhaDomain.tipoCampanha,
        segmentoAlvo: mockCampanhaDomain.segmentoAlvo,
        dataInicio: mockCampanhaDomain.dataInicio,
        dataFim: mockCampanhaDomain.dataFim,
        templateMensagem: mockCampanhaDomain.templateMensagem,
        formularioId: mockCampanhaDomain.formularioId,
        canalEnvio: mockCampanhaDomain.canalEnvio,
        ativo: mockCampanhaDomain.ativo,
        dataCriacao: mockCampanhaDomain.dataCriacao,
        dataAtualizacao: mockCampanhaDomain.dataAtualizacao,
        dataExclusao: mockCampanhaDomain.dataExclusao,
      };

      const campanha = CampanhaMap.toDomain(rawPrisma);

      expect(campanha).toBeInstanceOf(Campanha);
      expect(campanha.id).toBe(mockCampanhaDomain.id);
      expect(campanha.titulo).toBe(mockCampanhaDomain.titulo);
    });

    it('deve converter campos null do Prisma para undefined/null na entidade', () => {
        const rawPrisma: CampanhaPrisma = {
            id: mockCampanhaDomainSemOpcionais.id,
            titulo: mockCampanhaDomainSemOpcionais.titulo,
            descricao: null,
            tipoCampanha: mockCampanhaDomainSemOpcionais.tipoCampanha,
            segmentoAlvo: mockCampanhaDomainSemOpcionais.segmentoAlvo,
            dataInicio: mockCampanhaDomainSemOpcionais.dataInicio,
            dataFim: null,
            templateMensagem: mockCampanhaDomainSemOpcionais.templateMensagem,
            formularioId: mockCampanhaDomainSemOpcionais.formularioId,
            canalEnvio: mockCampanhaDomain.canalEnvio,
            ativo: mockCampanhaDomainSemOpcionais.ativo,
            dataCriacao: mockCampanhaDomainSemOpcionais.dataCriacao,
            dataAtualizacao: mockCampanhaDomainSemOpcionais.dataAtualizacao,
            dataExclusao: null,
        };

        const campanha = CampanhaMap.toDomain(rawPrisma);

        expect(campanha.descricao).toBeUndefined();
        expect(campanha.dataFim).toBeNull();
    });
  });

  // --- Testes para toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Campanha completa para um objeto de persistência do Prisma', () => {
      const persistenceData = CampanhaMap.toPersistence(mockCampanhaDomain);

      // ✅ A expectativa agora corresponde à estrutura de 'connect' do Prisma.
      expect(persistenceData).toEqual({
        id: mockCampanhaDomain.id,
        titulo: mockCampanhaDomain.titulo,
        descricao: mockCampanhaDomain.descricao,
        tipoCampanha: mockCampanhaDomain.tipoCampanha,
        segmentoAlvo: mockCampanhaDomain.segmentoAlvo,
        canalEnvio: mockCampanhaDomain.canalEnvio,
        dataInicio: mockCampanhaDomain.dataInicio,
        dataFim: mockCampanhaDomain.dataFim,
        templateMensagem: mockCampanhaDomain.templateMensagem,
        ativo: mockCampanhaDomain.ativo,
        dataCriacao: mockCampanhaDomain.dataCriacao,
        dataAtualizacao: mockCampanhaDomain.dataAtualizacao,
        dataExclusao: mockCampanhaDomain.dataExclusao,
        formulario: { connect: { id: mockCampanhaDomain.formularioId } },
      });
    });

    it('deve converter uma entidade inativa para persistência', () => {
        const persistenceData = CampanhaMap.toPersistence(mockCampanhaDomainInativa);
        expect(persistenceData.ativo).toBe(false);
        expect(persistenceData.dataExclusao).toEqual(dataFixaExclusao);
    });
  });

  // --- Testes para toResponseDTO ---
  describe('toResponseDTO', () => {
    it('deve converter uma entidade Campanha completa para CampanhaResponseDTO', () => {
      const dto = CampanhaMap.toResponseDTO(mockCampanhaDomain);

      expect(dto.id).toBe(mockCampanhaDomain.id);
      expect(dto.titulo).toBe(mockCampanhaDomain.titulo);
      expect(dto.dataInicio).toBe(dataFixaInicio.toISOString());
      expect(dto.dataFim).toBe(dataFixaFim.toISOString());
    });

    it('deve converter uma entidade Campanha sem opcionais para DTO', () => {
        const dto = CampanhaMap.toResponseDTO(mockCampanhaDomainSemOpcionais);
        expect(dto.descricao).toBeUndefined();
        expect(dto.dataFim).toBeNull();
    });
  });
});