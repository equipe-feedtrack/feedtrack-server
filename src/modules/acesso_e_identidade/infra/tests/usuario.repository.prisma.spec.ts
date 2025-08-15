import { PrismaClient, StatusUsuario, TipoUsuario } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { UsuarioRepositoryPrisma } from '../usuario/usuario.repository.prisma';

const prisma = new PrismaClient();
const repository = new UsuarioRepositoryPrisma(prisma);

describe('UsuarioRepositoryPrisma (Integration Tests)', () => {
    // =================================================================
    // IDs e Dados Fixos para Testes Determinísticos
    // =================================================================
    const EMPRESA_ID_1 = 'b2e0c90f-0e1d-4f3b-8c5e-0a1d9f8c6b7e';
    const USUARIO_ID_1 = '1c9f22c1-84c1-4b1e-b873-1f1f2a1b9d4e';
    const USUARIO_ID_2 = 'a1b2c3d4-e5f6-7a8b-9c1d-2e3f4a5b6c7d';

    beforeAll(async () => {
        // Setup: Cria a empresa que os usuários vão se referenciar
        await prisma.empresa.create({
            data: {
                id: EMPRESA_ID_1,
                nome: 'Empresa Teste',
                email: 'empresa@example.com',
                plano: 'FREE', // Use o valor do enum
                status: 'ATIVO', // Use o valor do enum
            },
        });
    });

    beforeEach(async () => {
        // Limpeza do Banco ANTES DE CADA TESTE
        await prisma.usuario.deleteMany({});
    });

    afterAll(async () => {
        // Limpeza Final e Desconexão
        await prisma.funcionario.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});
        await prisma.$disconnect();
    });

    // =================================================================
    // TESTES
    // =================================================================

    it('deve inserir um novo usuário e persistir no banco de dados', async () => {
        // 1. Cria a entidade de domínio
        const novoUsuario = await Usuario.criarUsuario({
            nomeUsuario: 'joao.silva',
            senhaHash: 'senha123',
            tipo: TipoUsuario.USER,
            email: 'joao@example.com',
            empresaId: EMPRESA_ID_1,
        }, USUARIO_ID_1);

        // 2. Salva a entidade usando o repositório
        await repository.inserir(novoUsuario);

        // 3. Verifica se o registro foi criado no banco
        const usuarioDoDb = await prisma.usuario.findUnique({
            where: { id: USUARIO_ID_1 },
        });

        // 4. Verifica o resultado
        expect(usuarioDoDb).toBeDefined();
        expect(usuarioDoDb?.id).toBe(USUARIO_ID_1);
        expect(usuarioDoDb?.nome_usuario).toBe('joao.silva');
        expect(usuarioDoDb?.tipo).toBe(TipoUsuario.USER);
        expect(usuarioDoDb?.status).toBe(StatusUsuario.ATIVO);
    });

    it('deve encontrar um usuário pelo seu nome de usuário', async () => {
        // 1. Setup: Cria e salva um usuário
        const usuario = await Usuario.criarUsuario({
            nomeUsuario: 'ana.pereira',
            senhaHash: 'senha456',
            tipo: TipoUsuario.ADMIN,
            email: 'ana@example.com',
            empresaId: EMPRESA_ID_1,
        }, USUARIO_ID_2);
        await repository.inserir(usuario);

        // 2. Busca o usuário pelo nome de usuário
        const usuarioEncontrado = await repository.buscarPorNomeUsuario('ana.pereira');

        // 3. Verifica o resultado
        expect(usuarioEncontrado).toBeDefined();
        expect(usuarioEncontrado?.id).toBe(USUARIO_ID_2);
        expect(usuarioEncontrado?.nomeUsuario).toBe('ana.pereira');
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
        // Busca um nome que não existe
        const usuarioEncontrado = await repository.buscarPorNomeUsuario('nao.existe');

        // Verifica se o resultado é null
        expect(usuarioEncontrado).toBeNull();
    });

    it('deve atualizar o tipo do usuário', async () => {
        // 1. Setup: Cria um usuário com um tipo específico
        const usuario = await Usuario.criarUsuario({
            nomeUsuario: 'user.comum',
            senhaHash: 'senha789',
            email: 'user.comum@example.com',
            tipo: TipoUsuario.USER,
            empresaId: EMPRESA_ID_1,
        });
        await repository.inserir(usuario);

        // 2. Modifica a entidade e a salva
        usuario.alterarTipo(TipoUsuario.ADMIN);
        await repository.alterar(usuario);

        // 3. Busca o usuário do banco para verificar a mudança
        const usuarioDoDb = await prisma.usuario.findUnique({
            where: { id: usuario.id },
        });

        // 4. Verifica se o tipo foi atualizado
        expect(usuarioDoDb?.tipo).toBe(TipoUsuario.ADMIN);
    });

    it('deve inativar um usuário', async () => {
        // 1. Setup: Cria um usuário ativo
        const usuario = await Usuario.criarUsuario({
            nomeUsuario: 'user.ativo',
            senhaHash: 'senha123',
            email: 'user.ativo@example.com',
            tipo: TipoUsuario.USER,
            empresaId: EMPRESA_ID_1,
        });
        await repository.inserir(usuario);

        // 2. Inativa o usuário e salva a mudança
        usuario.inativar();
        await repository.alterar(usuario);

        // 3. Busca o usuário do banco e verifica
        const usuarioDoDb = await prisma.usuario.findUnique({
            where: { id: usuario.id },
        });

        // 4. Verifica se o status foi alterado e a data de exclusão foi registrada
        expect(usuarioDoDb?.status).toBe(StatusUsuario.INATIVO);
        expect(usuarioDoDb?.data_exclusao).toBeInstanceOf(Date);
    });
});