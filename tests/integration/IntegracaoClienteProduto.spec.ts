// import { PrismaClient } from '@prisma/client';
// import { describe, it, expect, beforeEach } from 'vitest';

// const prisma = new PrismaClient();

// describe('Testes Prisma - Clientes e Produtos', () => {
  
//   beforeEach(async () => {
//     await prisma.produto.deleteMany();
//     await prisma.cliente.deleteMany();
//   });

//   it('Deve criar um Cliente', async () => {
//     const cliente = await prisma.cliente.create({
//       data: {
//         nome: 'Alexsandro',
//         telefone: '99999-9999',
//         email: 'alexsandro@email.com',
//         cidade: 'Tobias Barreto',
//         status: 'ATIVO',
//         vendedorResponsavel: 'João',
//       },
//     });

//     expect(cliente).toHaveProperty('id');
//     expect(cliente.nome).toBe('Alexsandro');
//     expect(cliente.email).toBe('alexsandro@email.com');
//   });

//   it('Deve criar um Produto associado a um Cliente', async () => {
//     const cliente = await prisma.cliente.create({
//       data: {
//         nome: 'Alexsandro',
//         telefone: '99999-9999',
//         email: 'alexsandro@email.com',
//         cidade: 'Tobias Barreto',
//         status: 'ATIVO',
//         vendedorResponsavel: 'João',
//       },
//     });

//     const produto = await prisma.produto.create({
//       data: {
//         nome: 'Produto Teste',
//         descricao: 'Descrição do produto',
//         valor: 199.99,
//         status: 'ATIVO',
//         clienteId: cliente.id, 
//       },
//     });

//     expect(produto).toHaveProperty('id');
//     expect(produto.nome).toBe('Produto Teste');
//     expect(produto.clienteId).toBe(cliente.id);
//   });

//   it('Deve buscar um Cliente específico', async () => {
//     const cliente = await prisma.cliente.create({
//       data: {
//         nome: 'Alexsandro',
//         telefone: '99999-9999',
//         email: 'alexsandro@email.com',
//         cidade: 'Tobias Barreto',
//         status: 'ATIVO',
//         vendedorResponsavel: 'João',
//       },
//     });

//     const clienteBuscado = await prisma.cliente.findUnique({
//       where: { id: cliente.id },
//     });

//     expect(clienteBuscado).not.toBeNull();
//     expect(clienteBuscado?.id).toBe(cliente.id);
//   });

//   it('Deve atualizar um Cliente existente', async () => {
//     const cliente = await prisma.cliente.create({
//       data: {
//         nome: 'Alexsandro',
//         telefone: '99999-9999',
//         email: 'alexsandro@email.com',
//         cidade: 'Tobias Barreto',
//         status: 'ATIVO',
//         vendedorResponsavel: 'João',
//       },
//     });

//     const clienteAtualizado = await prisma.cliente.update({
//       where: { id: cliente.id },
//       data: { nome: 'Alex Atualizado', cidade: 'Aracaju' },
//     });

//     expect(clienteAtualizado.nome).toBe('Alex Atualizado');
//     expect(clienteAtualizado.cidade).toBe('Aracaju');
//   });

//   it('Deve excluir um Cliente', async () => {
//     const cliente = await prisma.cliente.create({
//       data: {
//         nome: 'Alexsandro',
//         telefone: '99999-9999',
//         email: 'alexsandro@email.com',
//         cidade: 'Tobias Barreto',
//         status: 'ATIVO',
//         vendedorResponsavel: 'João',
//       },
//     });

//     const clienteExcluido = await prisma.cliente.delete({
//       where: { id: cliente.id },
//     });

//     const clienteBuscado = await prisma.cliente.findUnique({
//       where: { id: cliente.id },
//     });

//     expect(clienteExcluido).toHaveProperty('id');
//     expect(clienteBuscado).toBeNull();
//   });

//   it('Deve buscar todos os Clientes cadastrados', async () => {
//     await prisma.cliente.createMany({
//       data: [
//         { nome: 'Cliente 1', telefone: '11111-1111', email: 'cliente1@email.com', cidade: 'Aracaju', status: 'ATIVO', vendedorResponsavel: 'João' },
//         { nome: 'Cliente 2', telefone: '22222-2222', email: 'cliente2@email.com', cidade: 'São Paulo', status: 'INATIVO', vendedorResponsavel: 'Maria' },
//       ],
//     });

//     const clientes = await prisma.cliente.findMany();
//     expect(clientes.length).toBeGreaterThanOrEqual(2);
//   });
// });
