import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient, Plano, StatusEmpresa } from '@prisma/client';
import { EmpresaRepositoryPrisma } from '../../infra/empresa.repository.prisma';
import { Empresa } from '../../domain/empresa.entity';

const prisma = new PrismaClient();
const repository = new EmpresaRepositoryPrisma(prisma);

describe('EmpresaRepositoryPrisma (Integration Tests)', () => {
  // =================================================================
  // IDs e Datas Fixas para Testes Determinísticos
  // =================================================================
  const EMPRESA_ID_1 = 'b2e0c90f-0e1d-4f3b-8c5e-0a1d9f8c6b7e';
  const EMPRESA_ID_2 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';

  beforeEach(async () => {
    // 1. Limpeza do Banco ANTES DE CADA TESTE
    // A ordem de exclusão é crucial para evitar erros de chave estrangeira
    await prisma.usuario.deleteMany({});
    await prisma.funcionario.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.produto.deleteMany({});
    await prisma.campanha.deleteMany({});
    await prisma.venda.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.pergunta.deleteMany({});
    await prisma.logAtividade.deleteMany({});
    await prisma.envioFormulario.deleteMany({});
    // Agora você pode apagar a tabela 'pai'
    await prisma.empresa.deleteMany({});
  });

  afterAll(async () => {
    // 2. Limpeza Final e Desconexão
    // Repete a limpeza para garantir que o banco esteja vazio
    await prisma.usuario.deleteMany({});
    await prisma.funcionario.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.produto.deleteMany({});
    await prisma.campanha.deleteMany({});
    await prisma.venda.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.pergunta.deleteMany({});
    await prisma.logAtividade.deleteMany({});
    await prisma.envioFormulario.deleteMany({});
    await prisma.empresa.deleteMany({});
    await prisma.$disconnect();
  });

  // =================================================================
  // TESTES
  // =================================================================

  it('deve inserir uma nova empresa no banco de dados', async () => {
    // 1. Cria a entidade de domínio
    const novaEmpresa = Empresa.create({
      nome: 'Empresa Teste',
      cnpj: '12345678901234',
      email: 'contato@empresa.com',
      plano: Plano.FREE,
      status: StatusEmpresa.ATIVO,
    });

    // 2. Salva a entidade usando o repositório
    const empresaSalva = await repository.save(novaEmpresa);

    // 3. Verifica o resultado
    expect(empresaSalva).toBeInstanceOf(Empresa);
    expect(empresaSalva.id).toBe(novaEmpresa.id);
    expect(empresaSalva.nome).toBe('Empresa Teste');
    expect(empresaSalva.status).toBe(StatusEmpresa.ATIVO);
  });

  it('deve atualizar os dados de uma empresa existente', async () => {
    // 1. Setup: Cria uma empresa para ser atualizada
    const empresaOriginal = Empresa.create({
      nome: 'Empresa Antiga',
      cnpj: '11111111111111',
      email: 'antiga@empresa.com',
      plano: Plano.FREE,
      status: StatusEmpresa.ATIVO,
    });
    await repository.save(empresaOriginal);

    // 2. Modifica a entidade de domínio
    empresaOriginal.nome = 'Empresa Atualizada';
    empresaOriginal.email = 'atualizada@empresa.com';

    // 3. Salva a entidade modificada
    const empresaAtualizada = await repository.save(empresaOriginal);

    // 4. Recupera do banco para verificar a mudança
    const empresaDoDb = await prisma.empresa.findUnique({
      where: { id: empresaOriginal.id },
    });

    // 5. Verifica as alterações
    expect(empresaAtualizada.nome).toBe('Empresa Atualizada');
    expect(empresaDoDb?.email).toBe('atualizada@empresa.com');
  });

  it('deve encontrar uma empresa pelo ID', async () => {
    // 1. Setup: Cria e salva uma empresa com um ID fixo usando o Prisma
    const empresaCriada = await prisma.empresa.create({
      data: {
        id: EMPRESA_ID_1,
        nome: 'Empresa ID 1',
        cnpj: '22222222222222',
        email: 'id1@empresa.com',
        plano: Plano.FREE,
        status: StatusEmpresa.ATIVO,
      },
    });

    // 2. Busca a empresa pelo ID usando o repositório
    const empresaEncontrada = await repository.findById(EMPRESA_ID_1);

    // 3. Verifica o resultado
    expect(empresaEncontrada).toBeDefined();
    expect(empresaEncontrada?.id).toBe(EMPRESA_ID_1);
    expect(empresaEncontrada?.nome).toBe('Empresa ID 1');
  });

  it('deve retornar null se a empresa não for encontrada pelo ID', async () => {
    // Busca um ID que não existe
    const empresaEncontrada = await repository.findById('non-existent-id');

    // Verifica se o resultado é null
    expect(empresaEncontrada).toBeNull();
  });

  it('deve encontrar uma empresa pelo CNPJ', async () => {
    // 1. Setup: Cria e salva uma empresa com CNPJ
    const empresa = Empresa.create({
      nome: 'Empresa CNPJ',
      cnpj: '33333333333333',
      email: 'cnpj@empresa.com',
      plano: Plano.FREE,
      status: StatusEmpresa.ATIVO,
    });
    await repository.save(empresa);

    // 2. Busca a empresa pelo CNPJ
    const empresaEncontrada = await repository.findByCnpj('33333333333333');

    // 3. Verifica o resultado
    expect(empresaEncontrada).toBeDefined();
    expect(empresaEncontrada?.cnpj).toBe('33333333333333');
  });

  it('deve retornar null se a empresa não for encontrada pelo CNPJ', async () => {
    // Busca um CNPJ que não existe
    const empresaEncontrada = await repository.findByCnpj('99999999999999');

    // Verifica se o resultado é null
    expect(empresaEncontrada).toBeNull();
  });

  it('deve encontrar todas as empresas cadastradas', async () => {
    // 1. Setup: Cria várias empresas
    const empresa1 = Empresa.create({ nome: 'Empresa A', cnpj: '44444444444444', email: 'a@a.com', plano: Plano.FREE, status: StatusEmpresa.ATIVO });
    const empresa2 = Empresa.create({ nome: 'Empresa B', cnpj: '55555555555555', email: 'b@b.com', plano: Plano.BASIC, status: StatusEmpresa.ATIVO });

    await repository.save(empresa1);
    await repository.save(empresa2);

    // 2. Busca todas as empresas
    const empresas = await repository.findAll();

    // 3. Verifica o resultado
    expect(empresas).toHaveLength(2);
    expect(empresas.some(e => e.id === empresa1.id)).toBe(true);
    expect(empresas.some(e => e.id === empresa2.id)).toBe(true);
  });
});