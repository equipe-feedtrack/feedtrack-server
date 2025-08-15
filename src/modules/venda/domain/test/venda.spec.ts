import { describe, expect, it, vi } from 'vitest';
import { Venda } from '../venda.entity';
import { CriarVendaProps, VendaProps } from '../venda.types';
import { randomUUID } from 'crypto';

describe('Venda (Domain Tests)', () => {
    // Mock para datas
    const mockDate = new Date('2025-01-01T10:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    // =================================================================
    // MOCKS DE DADOS FIXOS
    // =================================================================
    const mockProps: CriarVendaProps = {
        clienteId: randomUUID(),
        produtoId: randomUUID(),
        empresaId: randomUUID(),
    };

    // =================================================================
    // TESTES DE CRIAÇÃO
    // =================================================================

    it('deve criar uma nova venda com dados válidos', () => {
        const venda = Venda.create(mockProps);

        expect(venda).toBeInstanceOf(Venda);
        expect(venda.id).toBeDefined();
        expect(venda.clienteId).toBe(mockProps.clienteId);
        expect(venda.produtoId).toBe(mockProps.produtoId);
        expect(venda.empresaId).toBe(mockProps.empresaId);
        expect(venda.dataVenda).toEqual(mockDate);
    });

    // =================================================================
    // TESTES DE RECUPERAÇÃO (re-hidratação de entidade do banco)
    // =================================================================

    it('deve recuperar uma venda existente com todas as propriedades', () => {
        const recuperacaoProps: VendaProps = {
            id: randomUUID(),
            ...mockProps,
            dataVenda: new Date('2024-12-31T15:00:00.000Z'),
        };

        const venda = Venda.recuperar(recuperacaoProps);

        expect(venda).toBeInstanceOf(Venda);
        expect(venda.id.toString()).toBe(recuperacaoProps.id.toString());
        expect(venda.clienteId).toBe(mockProps.clienteId);
        expect(venda.dataVenda).toEqual(recuperacaoProps.dataVenda);
    });
});