import { describe, it, expect, vi } from 'vitest';
import { DeletarCampanhaUseCase } from '../deletarCampanhaUseCase';
import { ICampanhaRepository } from '@modules/campanha/infra/campanha/campanha.repository.interface';
import { CampanhaNaoEncontradaException } from '../../exceptions/campanha.exception';

describe('DeletarCampanhaUseCase', () => {
    it('should delete a campaign successfully', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            existe: vi.fn().mockResolvedValue(true),
            deletar: vi.fn(),
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            atualizar: vi.fn(),
        };

        const useCase = new DeletarCampanhaUseCase(campanhaRepositoryMock);
        await useCase.execute('some-id');

        expect(campanhaRepositoryMock.existe).toHaveBeenCalledWith('some-id');
        expect(campanhaRepositoryMock.deletar).toHaveBeenCalledWith('some-id');
    });

    it('should throw an error if the campaign does not exist', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            existe: vi.fn().mockResolvedValue(false),
            deletar: vi.fn(),
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            atualizar: vi.fn(),
        };

        const useCase = new DeletarCampanhaUseCase(campanhaRepositoryMock);

        await expect(useCase.execute('non-existent-id')).rejects.toThrow(CampanhaNaoEncontradaException);
    });
});
