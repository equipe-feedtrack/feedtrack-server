import { describe, it, expect, vi } from 'vitest';
import { CriarCampanhaUseCase } from '../criarCampanhaUseCase';
import { ICampanhaRepository } from '@modules/campanha/infra/campanha/campanha.repository.interface';
import { IFormularioRepository } from '@modules/formulario/infra/formulario/formulario.repository.interface';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { CriarCampanhaInputDTO } from '../../dto/criarCampanhaInputDTO';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CanalEnvio } from '@prisma/client';
import { Campanha } from '@modules/campanha/domain/campanha.entity';

describe('CriarCampanhaUseCase', () => {
    it('should create a new campaign successfully', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const formularioRepositoryMock: IFormularioRepository<Formulario> = {
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn().mockResolvedValue(true),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new CriarCampanhaUseCase(campanhaRepositoryMock, formularioRepositoryMock);

        const input: CriarCampanhaInputDTO = {
            titulo: 'Test Campaign',
            tipoCampanha: TipoCampanha.PROMOCIONAL,
            segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
            dataInicio: new Date(),
            dataFim: null,
            templateMensagem: 'Test template',
            formularioId: 'some-form-id',
            canalEnvio: CanalEnvio.EMAIL,
        };

        const result = await useCase.execute(input);

        expect(result).toBeDefined();
        expect(result.titulo).toBe(input.titulo);
        expect(campanhaRepositoryMock.inserir).toHaveBeenCalledOnce();
    });

    it('should throw an error if the form does not exist', async () => {
        const campanhaRepositoryMock: ICampanhaRepository = {
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn(),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const formularioRepositoryMock: IFormularioRepository<Formulario> = {
            inserir: vi.fn(),
            recuperarPorUuid: vi.fn(),
            listar: vi.fn(),
            existe: vi.fn().mockResolvedValue(false),
            atualizar: vi.fn(),
            deletar: vi.fn(),
        };

        const useCase = new CriarCampanhaUseCase(campanhaRepositoryMock, formularioRepositoryMock);

        const input: CriarCampanhaInputDTO = {
            titulo: 'Test Campaign',
            tipoCampanha: TipoCampanha.PROMOCIONAL,
            segmentoAlvo: SegmentoAlvo.TODOS_CLIENTES,
            dataInicio: new Date(),
            dataFim: null,
            templateMensagem: 'Test template',
            formularioId: 'non-existent-form-id',
            canalEnvio: CanalEnvio.EMAIL,
        };

        await expect(useCase.execute(input)).rejects.toThrow('Formulário com ID non-existent-form-id não encontrado.');
    });
});
