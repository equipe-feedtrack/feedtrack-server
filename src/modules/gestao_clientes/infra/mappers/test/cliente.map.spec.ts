import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cliente as ClientePrisma, StatusUsuario as StatusPrisma } from '@prisma/client';
import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { CriarClienteProps, StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { ClienteMap } from '../cliente.map';
import { randomUUID } from 'node:crypto';

// =================================================================
// MOCKS DE DADOS FIXOS
// =================================================================

const mockClienteDomain = Cliente.recuperar({
  id: randomUUID(),
  nome: 'Carlos Silva',
  email: 'carlos@example.com',
  telefone: '11999998888',
  cidade: 'Curitiba',
  status: StatusCliente.ATIVO,
  dataCriacao: new Date('2024-01-01T10:00:00.000Z'),
  dataAtualizacao: new Date('2024-01-01T11:00:00.000Z'),
  dataExclusao: null,
  empresaId: randomUUID(),
});

// =================================================================
// SUITE DE TESTES
// =================================================================

describe('ClienteMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TESTES PARA toDomain ---
  describe('toDomain', () => {
    it('deve converter dados crus do Prisma para uma entidade Cliente', () => {
      // DADO: Um objeto mock que simula a resposta do Prisma
      const rawClientePrisma = {
        id: mockClienteDomain.id,
        nome: mockClienteDomain.nome,
        email: mockClienteDomain.email,
        telefone: mockClienteDomain.telefone,
        cidade: mockClienteDomain.cidade,
        status: StatusPrisma.ATIVO,
        dataCriacao: mockClienteDomain.dataCriacao,
        dataAtualizacao: mockClienteDomain.dataAtualizacao,
        dataExclusao: mockClienteDomain.dataExclusao,
        empresaId: mockClienteDomain.empresaId,
      };

      // QUANDO: O método toDomain é chamado com o mock
      const cliente = ClienteMap.toDomain(rawClientePrisma as any);

      // ENTÃO: A conversão deve ser bem-sucedida
      expect(cliente).toBeInstanceOf(Cliente);
      expect(cliente.id).toBe(rawClientePrisma.id);
      expect(cliente.nome).toBe(rawClientePrisma.nome);
    });
  });

  // --- TESTES PARA toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Cliente para um objeto de persistência do Prisma', () => {
      const persistenceData = ClienteMap.toPersistence(mockClienteDomain);
      
      expect(persistenceData.id).toBe(mockClienteDomain.id);
      expect(persistenceData.nome).toBe(mockClienteDomain.nome);
      expect(persistenceData.email).toBe(mockClienteDomain.email);
      expect(persistenceData.status).toBe(StatusPrisma.ATIVO);
      expect(persistenceData.dataExclusao).toBeNull();
    });

    it('deve lidar com campos opcionais ausentes (email e telefone)', () => {
      const clienteSemInfoContato = Cliente.criarCliente({
        nome: 'Cliente sem contato',
        email: null,
        telefone: '79999999999',
        cidade: 'São Paulo',
        empresaId: randomUUID(),
      });
      
      const persistenceData = ClienteMap.toPersistence(clienteSemInfoContato);
      
      expect(persistenceData.email).toBeNull();
    });

    it('deve mapear corretamente um cliente INATIVO', () => {
      const clienteInativo = Cliente.recuperar({
        id: randomUUID(),
        nome: 'Cliente Inativo',
        email: 'inativo@teste.com',
        telefone: '99999999999',
        cidade: 'Recife',
        status: StatusCliente.INATIVO,
        dataExclusao: new Date('2025-06-20T15:30:00Z'),
        dataCriacao: new Date('2023-01-15T10:00:00Z'),
        dataAtualizacao: new Date('2025-06-20T15:30:00Z'),
        empresaId: randomUUID(),
      });

      const persistenceData = ClienteMap.toPersistence(clienteInativo);

      expect(persistenceData.status).toBe(StatusPrisma.INATIVO);
      expect(persistenceData.dataExclusao).toBeInstanceOf(Date);
    });
  });
});