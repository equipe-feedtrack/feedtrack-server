import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

describe('Testes Prisma - Clientes e Produtos', () => {
  
  beforeEach(async () => {
    await prisma.envioFormulario.deleteMany();
    await prisma.clientesOnProdutos.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.pessoa.deleteMany(); // Clear Pessoa table
  });

  it('Deve criar um Cliente', async () => {
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Alexsandro', email: 'alexsandro@email.com', telefone: '99999-9999' },
    });
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Alexsandro',
        cidade: 'Tobias Barreto',
        status: 'ATIVO',
        vendedorResponsavel: 'João',
        pessoaId: pessoa.id,
      },
    });

    expect(cliente).toHaveProperty('id');
    expect(cliente.nome).toBe('Alexsandro');
  });

  it('Deve criar um Produto associado a um Cliente', async () => {
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Alexsandro', email: 'alexsandro@email.com', telefone: '99999-9999' },
    });
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Alexsandro',
        cidade: 'Tobias Barreto',
        status: 'ATIVO',
        vendedorResponsavel: 'João',
        pessoaId: pessoa.id,
      },
    });

    const produto = await prisma.produto.create({
      data: {
        nome: 'Produto Teste',
        descricao: 'Descrição do produto',
        valor: 199.99,
        ativo: true,
        clientes: {
          create: [
            { cliente: { connect: { id: cliente.id } } }
          ]
        }
      },
    });

    expect(produto).toHaveProperty('id');
    expect(produto.nome).toBe('Produto Teste');
    
  });

  it('Deve buscar um Cliente específico', async () => {
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Alexsandro', email: 'alexsandro@email.com', telefone: '99999-9999' },
    });
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Alexsandro',
        cidade: 'Tobias Barreto',
        status: 'ATIVO',
        vendedorResponsavel: 'João',
        pessoaId: pessoa.id,
      },
    });

    const clienteBuscado = await prisma.cliente.findUnique({
      where: { id: cliente.id },
    });

    expect(clienteBuscado).not.toBeNull();
    expect(clienteBuscado?.id).toBe(cliente.id);
  });

  it('Deve atualizar um Cliente existente', async () => {
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Alexsandro', email: 'alexsandro@email.com', telefone: '99999-9999' },
    });
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Alexsandro',
        cidade: 'Tobias Barreto',
        status: 'ATIVO',
        vendedorResponsavel: 'João',
        pessoaId: pessoa.id,
      },
    });

    const clienteAtualizado = await prisma.cliente.update({
      where: { id: cliente.id },
      data: { nome: 'Alex Atualizado', cidade: 'Aracaju' },
    });

    expect(clienteAtualizado.nome).toBe('Alex Atualizado');
    expect(clienteAtualizado.cidade).toBe('Aracaju');
  });

  it('Deve excluir um Cliente', async () => {
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Alexsandro', email: 'alexsandro@email.com', telefone: '99999-9999' },
    });
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Alexsandro',
        cidade: 'Tobias Barreto',
        status: 'ATIVO',
        vendedorResponsavel: 'João',
        pessoaId: pessoa.id,
      },
    });

    const clienteExcluido = await prisma.cliente.delete({
      where: { id: cliente.id },
    });

    const clienteBuscado = await prisma.cliente.findUnique({
      where: { id: cliente.id },
    });

    expect(clienteExcluido).toHaveProperty('id');
    expect(clienteBuscado).toBeNull();
  });

  it('Deve buscar todos os Clientes cadastrados', async () => {
    const pessoa1 = await prisma.pessoa.create({ data: { id: randomUUID(), nome: 'Cliente 1', email: 'cliente1@email.com', telefone: '11111-1111' } });
    const pessoa2 = await prisma.pessoa.create({ data: { id: randomUUID(), nome: 'Cliente 2', email: 'cliente2@email.com', telefone: '22222-2222' } });

    await prisma.cliente.createMany({
      data: [
        { id: randomUUID(), nome: 'Cliente 1', cidade: 'Aracaju', status: 'ATIVO', vendedorResponsavel: 'João', pessoaId: pessoa1.id },
        { id: randomUUID(), nome: 'Cliente 2', cidade: 'São Paulo', status: 'INATIVO', vendedorResponsavel: 'Maria', pessoaId: pessoa2.id },
      ],
    });

    const clientes = await prisma.cliente.findMany();
    expect(clientes.length).toBeGreaterThanOrEqual(2);
  });
});
