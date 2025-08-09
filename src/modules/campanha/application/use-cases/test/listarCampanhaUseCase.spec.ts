import { describe, it, expect, vi } from 'vitest';
import { ListarCampanhasUseCase } from '../listarCampanhaUseCase';
import { ICampanhaRepository } from '@modules/campanha/infra/campanha/campanha.repository.interface';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CanalEnvio } from '@prisma/client';

describe('ListarCampanhasUseCase', () => {
    it('should return a list of campaigns', async () => {
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
            listar: vi.fn().mockResolvedValue([campanhaMock]),
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new ListarCampanhasUseCase(campanhaRepositoryMock);
        const result = await useCase.execute();

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(campanhaMock.id);
        expect(campanhaRepositoryMock.listar).toHaveBeenCalledOnce();
    });

    it('should return an empty list if no campaigns are found', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            listar: vi.fn().mockResolvedValue([]),
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new ListarCampanhasUseCase(campanhaRepositoryMock);
        const result = await useCase.execute();

        expect(result).toHaveLength(0);
    });
});
