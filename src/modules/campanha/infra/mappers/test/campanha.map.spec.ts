import { describe, expect, it } from 'vitest';
import { Campanha } from '@modules/campanha/domain/campanha.entity'; // Ajuste o caminho
import { CampanhaMap } from '../campanha.map'; // Ajuste o caminho
import { Prisma, Campanha as CampanhaPrisma } from '@prisma/client'; // Importa Campanha do Prisma Client
import { randomUUID } from 'crypto';
import { SegmentoAlvo, TipoCampanha } from '@modules/campanha/domain/campanha.types';

describe('CampanhaMap', () => {
  // Dados de mock para a entidade de domínio Campanha
  const mockCampanhaDomainData = {
    id: randomUUID(),
    titulo: 'Campanha Teste Mapper',
    descricao: 'Descrição do teste',
    tipoCampanha: TipoCampanha.POS_COMPRA,
    segmentoAlvo: SegmentoAlvo.NOVOS_CLIENTES,
    dataInicio: new Date('2025-01-01T10:00:00.000Z'),
    dataFim: new Date('2025-01-31T23:59:59.000Z'),
    templateMensagem: 'Template de mensagem para clientes novos.',
    formularioId: 'form-uuid-test',
    ativo: true,
    dataCriacao: new Date('2024-12-01T08:00:00.000Z'),
    dataAtualizacao: new Date('2024-12-01T09:00:00.000Z'),
    dataExclusao: null,
  };

  const mockCampanhaDomainSemOpcionaisData = {
    id: randomUUID(),
    titulo: 'Campanha Sem Opcionais',
    descricao: undefined, // Sem descrição
    tipoCampanha: TipoCampanha.AUTOMATICO,
    segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
    dataInicio: new Date('2025-02-01T00:00:00.000Z'),
    dataFim: undefined, // Sem data fim
    templateMensagem: 'Template simples.',
    formularioId: 'form-uuid-simples',
    ativo: true,
    dataCriacao: new Date('2025-01-20T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-12-01T09:00:00.000Z'),
    dataExclusao: null,
  };

  const mockCampanhaDomainInativaData = {
    id: randomUUID(),
    titulo: 'Campanha Inativa',
    descricao: 'Descrição da campanha inativa',
    tipoCampanha: TipoCampanha.PROMOCIONAL,
    segmentoAlvo: SegmentoAlvo.CLIENTES_REGULARES,
    dataInicio: new Date('2025-03-01T00:00:00Z'),
    dataFim: null,
    templateMensagem: 'Template de mensagem da campanha inativa.',
    formularioId: '1da68d4a-5c24-4f81-a7e8-e5f3b7c2a1d9',
    ativo: false, // Inativa
    dataCriacao: new Date('2025-02-25T10:00:00Z'),
    dataAtualizacao: new Date('2024-12-01T09:00:00.000Z'),
    dataExclusao: new Date('2025-03-05T10:00:00Z'),
  };

  // Instâncias da entidade Campanha
  const mockCampanhaDomain = Campanha.recuperar(mockCampanhaDomainData);
  const mockCampanhaDomainSemOpcionais = Campanha.recuperar(mockCampanhaDomainSemOpcionaisData);
  const mockCampanhaDomainInativa = Campanha.recuperar(mockCampanhaDomainInativaData);

  // --- Testes para toDomain ---
   describe('toDomain', () => {
    // Dados crus (do Prisma) como viriam do banco (snake_case, com enum strings)
    const rawCampanhaPrismaCompleta: CampanhaPrisma = {
      id: mockCampanhaDomainData.id,
      titulo: mockCampanhaDomainData.titulo,
      descricao: mockCampanhaDomainData.descricao ?? null, // DB espera null
      tipo_campanha: mockCampanhaDomainData.tipoCampanha,
      segmento_alvo: mockCampanhaDomainData.segmentoAlvo,
      data_inicio: mockCampanhaDomainData.dataInicio,
      data_fim: mockCampanhaDomainData.dataFim ?? null, // DB espera null
      template_mensagem: mockCampanhaDomainData.templateMensagem, // <-- Use snake_case no mock para alinhar com o que o erro sugere.
      formularioId: mockCampanhaDomainData.formularioId,
      ativo: mockCampanhaDomainData.ativo,
      data_criacao: mockCampanhaDomainData.dataCriacao,
      data_atualizacao: mockCampanhaDomainData.dataAtualizacao,
      data_exclusao: mockCampanhaDomainData.dataExclusao,
    };

    const rawCampanhaPrismaSemOpcionais: CampanhaPrisma = {
      id: mockCampanhaDomainSemOpcionaisData.id,
      titulo: mockCampanhaDomainSemOpcionaisData.titulo,
      descricao: null,
      tipo_campanha: mockCampanhaDomainSemOpcionaisData.tipoCampanha,
      segmento_alvo: mockCampanhaDomainSemOpcionaisData.segmentoAlvo,
      data_inicio: mockCampanhaDomainSemOpcionaisData.dataInicio,
      data_fim: null,
      template_mensagem: mockCampanhaDomainSemOpcionaisData.templateMensagem,
      formularioId: mockCampanhaDomainSemOpcionaisData.formularioId,
      ativo: mockCampanhaDomainSemOpcionaisData.ativo,
      data_criacao: mockCampanhaDomainSemOpcionaisData.dataCriacao,
      data_atualizacao: mockCampanhaDomainSemOpcionaisData.dataAtualizacao,
      data_exclusao: null,
    };

    // NOVO MOCK ESPECÍFICO PARA O TESTE DA CAMPANHA INATIVA
    const rawCampanhaPrismaInativa: CampanhaPrisma = {
        id: mockCampanhaDomainInativaData.id,
        titulo: mockCampanhaDomainInativaData.titulo,
        descricao: mockCampanhaDomainInativaData.descricao ?? null,
        tipo_campanha: mockCampanhaDomainInativaData.tipoCampanha,
        segmento_alvo: mockCampanhaDomainInativaData.segmentoAlvo,
        data_inicio: mockCampanhaDomainInativaData.dataInicio,
        data_fim: mockCampanhaDomainInativaData.dataFim ?? null,
        template_mensagem: mockCampanhaDomainInativaData.templateMensagem, // <-- Usar snake_case no mock
        formularioId: mockCampanhaDomainInativaData.formularioId,
        ativo: mockCampanhaDomainInativaData.ativo,
        data_criacao: mockCampanhaDomainInativaData.dataCriacao,
        data_atualizacao: mockCampanhaDomainInativaData.dataAtualizacao,
        data_exclusao: mockCampanhaDomainInativaData.dataExclusao,
    };


    it('deve converter dados crus do Prisma para uma entidade Campanha completa', () => {
      const campanha = CampanhaMap.toDomain(rawCampanhaPrismaCompleta);

      expect(campanha).toBeInstanceOf(Campanha);
      expect(campanha.id).toBe(rawCampanhaPrismaCompleta.id);
      expect(campanha.titulo).toBe(rawCampanhaPrismaCompleta.titulo);
      expect(campanha.descricao).toBe(rawCampanhaPrismaCompleta.descricao);
      expect(campanha.tipoCampanha).toBe(rawCampanhaPrismaCompleta.tipo_campanha);
      expect(campanha.segmentoAlvo).toBe(rawCampanhaPrismaCompleta.segmento_alvo);
      expect(campanha.dataInicio).toEqual(rawCampanhaPrismaCompleta.data_inicio);
      expect(campanha.dataFim).toEqual(rawCampanhaPrismaCompleta.data_fim);
      expect(campanha.templateMensagem).toBe(rawCampanhaPrismaCompleta.template_mensagem); // <-- USAR snake_case
      expect(campanha.formularioId).toBe(rawCampanhaPrismaCompleta.formularioId);
      expect(campanha.ativo).toBe(rawCampanhaPrismaCompleta.ativo);
      expect(campanha.dataCriacao).toEqual(rawCampanhaPrismaCompleta.data_criacao);
      expect(campanha.dataAtualizacao).toEqual(rawCampanhaPrismaCompleta.data_atualizacao);
      expect(campanha.dataExclusao).toEqual(rawCampanhaPrismaCompleta.data_exclusao);
    });

    it('deve converter dados crus do Prisma com campos null para entidade com undefined/null corretamente', () => {
      const campanha = CampanhaMap.toDomain(rawCampanhaPrismaSemOpcionais);

      expect(campanha.descricao).toBeUndefined();
      expect(campanha.dataFim).toBeNull();
    });

    it('deve lidar com campanha inativa e data de exclusão', () => {
      const campanha = CampanhaMap.toDomain(rawCampanhaPrismaInativa); 
        expect(campanha.ativo).toBe(false);
        // Comparar com a data do mock raw, não da entidade mockCampanhaDomainInativa
        expect(campanha.dataExclusao).toEqual(rawCampanhaPrismaInativa.data_exclusao); 
    });
    
  });

  // --- Testes para toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Campanha completa para um objeto de persistência do Prisma', () => {
      const persistenceData = CampanhaMap.toPersistence(mockCampanhaDomain);

      expect(persistenceData).toEqual({
        id: mockCampanhaDomain.id,
        titulo: mockCampanhaDomain.titulo,
        descricao: mockCampanhaDomain.descricao, // Mantém o valor
        tipo_campanha: mockCampanhaDomain.tipoCampanha,
        segmento_alvo: mockCampanhaDomain.segmentoAlvo,
        data_inicio: mockCampanhaDomain.dataInicio,
        data_fim: mockCampanhaDomain.dataFim, // Mantém o valor
        template_mensagem: mockCampanhaDomain.templateMensagem,
        formularioId: mockCampanhaDomain.formularioId,
        ativo: mockCampanhaDomain.ativo,
        data_criacao: mockCampanhaDomain.dataCriacao,
        data_atualizacao: mockCampanhaDomain.dataAtualizacao,
        data_exclusao: mockCampanhaDomain.dataExclusao,
      });
    });

    it('deve converter uma entidade Campanha sem opcionais para persistência com null', () => {
      const persistenceData = CampanhaMap.toPersistence(mockCampanhaDomainSemOpcionais);

      expect(persistenceData.descricao).toBeNull(); // undefined da entidade -> null no DB
      expect(persistenceData.data_fim).toBeNull(); // undefined da entidade -> null no DB
    });

    it('deve converter uma entidade Campanha inativa para persistência', () => {
      const persistenceData = CampanhaMap.toPersistence(mockCampanhaDomainInativa);

      expect(persistenceData.ativo).toBe(false);
      expect(persistenceData.data_exclusao).toEqual(mockCampanhaDomainInativa.dataExclusao);
    });
  });

  // --- Testes para toResponseDTO ---
  describe('toResponseDTO', () => {
    it('deve converter uma entidade Campanha completa para CampanhaResponseDTO', () => {
      const dto = CampanhaMap.toResponseDTO(mockCampanhaDomain);

      expect(dto).toEqual({
        id: mockCampanhaDomain.id,
        titulo: mockCampanhaDomain.titulo,
        descricao: mockCampanhaDomain.descricao,
        tipoCampanha: mockCampanhaDomain.tipoCampanha,
        segmentoAlvo: mockCampanhaDomain.segmentoAlvo,
        dataInicio: mockCampanhaDomain.dataInicio.toISOString(),
        dataFim: mockCampanhaDomain.dataFim?.toISOString(),
        templateMensagem: mockCampanhaDomain.templateMensagem,
        formularioId: mockCampanhaDomain.formularioId,
        ativo: mockCampanhaDomain.ativo,
        dataCriacao: mockCampanhaDomain.dataCriacao.toISOString(),
        dataAtualizacao: mockCampanhaDomain.dataAtualizacao.toISOString(),
      });
      expect(dto).not.toHaveProperty('dataExclusao');
    });

    it('deve converter uma entidade Campanha sem opcionais para DTO com undefined', () => {
      const dto = CampanhaMap.toResponseDTO(mockCampanhaDomainSemOpcionais);

      expect(dto.descricao).toBeUndefined();
      expect(dto.dataFim).toBeUndefined();
    });
  });
});