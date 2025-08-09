import { describe, it, expect, vi } from 'vitest';
import { BuscarCampanhaPorIdUseCase } from '../buscarCampanhaUseCase';
import { ICampanhaRepository } from '@modules/campanha/infra/campanha/campanha.repository.interface';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CanalEnvio } from '@prisma/client';

describe('BuscarCampanhaPorIdUseCase', () => {
    it('should return a campaign when found', async () => {
        const campanhaMock = Campanha.criar({
            titulo: 'Test Campaign',
            tipoCampanha: TipoCampanha.PROMOCIONAL,
            segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
            dataInicio: new Date(),
            dataFim: null,
            templateMensagem: 'Test template',
            formularioId: 'form-id',
            canalEnvio: CanalEnvio.EMAIL,
        });

        const campanhaRepositoryMock: ICampanhaRepository = {
            recuperarPorUuid: vi.fn().mockResolvedValue(campanhaMock),
            inserir: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new BuscarCampanhaPorIdUseCase(campanhaRepositoryMock);
        const result = await useCase.execute(campanhaMock.id);

        expect(result).toBeDefined();
        expect(result?.id).toBe(campanhaMock.id);
        expect(campanhaRepositoryMock.recuperarPorUuid).toHaveBeenCalledWith(campanhaMock.id);
    });

    it('should return null when a campaign is not found', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            recuperarPorUuid: vi.fn().mockResolvedValue(null),
            inserir: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new BuscarCampanhaPorIdUseCase(campanhaRepositoryMock);
        const result = await useCase.execute('non-existent-id');

        expect(result).toBeNull();
    });
});
