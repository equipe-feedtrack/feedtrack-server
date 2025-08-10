import { describe, it, expect, vi } from 'vitest';
import { AtualizarCampanhaUseCase } from '../atualizarCampanhaUseCase';
import { ICampanhaRepository } from '@modules/campanha/infra/campanha/campanha.repository.interface';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CanalEnvio } from '@prisma/client';
import { CampanhaNaoEncontradaException } from '../../exceptions/campanha.exception';

describe('AtualizarCampanhaUseCase', () => {
    it('should update a campaign successfully', async () => {
        const campanhaMock = Campanha.criar({
            titulo: 'Old Title',
            tipoCampanha: TipoCampanha.PROMOCIONAL,
            segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
            dataInicio: new Date(),
            dataFim: null,
            templateMensagem: 'Old template',
            formularioId: 'form-id',
            canalEnvio: CanalEnvio.EMAIL,
        });

        const campanhaRepositoryMock: ICampanhaRepository = {
            recuperarPorUuid: vi.fn().mockResolvedValue(campanhaMock),
            atualizar: vi.fn(),
            inserir: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new AtualizarCampanhaUseCase(campanhaRepositoryMock);

        const input = {
            id: campanhaMock.id,
            ativo: false,
        };

        const result = await useCase.execute(input);

        expect(result).toBeDefined();
        expect(result.ativo).toBe(false);
        expect(campanhaRepositoryMock.recuperarPorUuid).toHaveBeenCalledWith(input.id);
        expect(campanhaRepositoryMock.atualizar).toHaveBeenCalledOnce();
    });

    it('should throw an error if the campaign is not found', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            recuperarPorUuid: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn(),
            inserir: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new AtualizarCampanhaUseCase(campanhaRepositoryMock);

        const input = {
            id: 'non-existent-id',
            ativo: true,
        };

        await expect(useCase.execute(input)).rejects.toThrow(CampanhaNaoEncontradaException);
    });
});
