import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, setupApp } from 'src/main/presentation/http/server'; // Importa a instância do app Express
import { PrismaClient } from '@prisma/client';
import { TipoUsuario, StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

const prisma = new PrismaClient();

describe('Integração - Módulo Acesso e Identidade', () => {
  let server: any;

  beforeAll(() => {
    setupApp(); // Setup the app
    server = app.listen(3001); // Start the server on a test port
  });

  afterAll(() => {
    server.close(); // Close the server after all tests are done
  });

  beforeEach(async () => {
    // Limpar o banco de dados antes de cada teste
    await prisma.funcionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.pessoa.deleteMany();
  });

  afterEach(async () => {
    // Limpar o banco de dados após cada teste também, para garantir isolamento
    await prisma.funcionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.pessoa.deleteMany();
  });

  describe('Rotas de Usuário', () => {
    it('POST /api/v1/usuarios - Deve criar um novo usuário', async () => {
      // Add a small delay to ensure the server is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      const pessoaResponse = await request(server)
        .post('/api/v1/pessoas') // Assumindo que você tem uma rota para criar pessoas
        .send({
          nome: 'Teste Usuario',
          email: 'usuario@example.com',
          telefone: '11999999999',
        });

      expect(pessoaResponse.statusCode).toBe(201);
      const pessoaId = pessoaResponse.body.id;

      const response = await request(app)
        .post('/api/v1/usuarios')
        .send({
          nomeUsuario: 'testuser',
          senhaHash: 'hashedpassword',
          tipo: TipoUsuario.USER,
          pessoaId: pessoaId,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nomeUsuario).toBe('testuser');
      expect(response.body.tipo).toBe(TipoUsuario.USER);
    });

    it('GET /api/v1/usuarios/:id - Deve buscar um usuário por ID', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Busca Teste', email: 'busca@example.com', telefone: '11988888888' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'userbusca',
          senha_hash: 'hashbusca',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app).get(`/api/v1/usuarios/${usuario.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(usuario.id);
      expect(response.body.nomeUsuario).toBe('userbusca');
    });

    it('PUT /api/v1/usuarios/:id - Deve atualizar um usuário', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Atualiza Teste', email: 'atualiza@example.com', telefone: '11977777777' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'userantigo',
          senha_hash: 'hashantigo',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app)
        .put(`/api/v1/usuarios/${usuario.id}`)
        .send({ nomeUsuario: 'usernovo', tipo: TipoUsuario.ADMIN });

      expect(response.statusCode).toBe(200);
      expect(response.body.nomeUsuario).toBe('usernovo');
      expect(response.body.tipo).toBe(TipoUsuario.ADMIN);
    });

    it('DELETE /api/v1/usuarios/:id - Deve deletar um usuário', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Deleta Teste', email: 'deleta@example.com', telefone: '11966666666' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'userdeleta',
          senha_hash: 'hashdeleta',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app).delete(`/api/v1/usuarios/${usuario.id}`);

      expect(response.statusCode).toBe(204);

      const findResponse = await request(app).get(`/api/v1/usuarios/${usuario.id}`);
      expect(findResponse.statusCode).toBe(404); // Deve retornar 404 após a exclusão
    });
  });

  describe('Rotas de Funcionário', () => {
    it('POST /api/v1/funcionarios - Deve criar um novo funcionário', async () => {
      const pessoaResponse = await request(app)
        .post('/api/v1/pessoas') // Assumindo que você tem uma rota para criar pessoas
        .send({
          nome: 'Teste Funcionario',
          email: 'funcionario@example.com',
          telefone: '11955555555',
        });

      expect(pessoaResponse.statusCode).toBe(201);
      const pessoaId = pessoaResponse.body.id;

      const usuarioResponse = await request(app)
        .post('/api/v1/usuarios')
        .send({
          nomeUsuario: 'funcuser',
          senhaHash: 'funchash',
          tipo: TipoUsuario.USER,
          pessoaId: pessoaId,
        });

      expect(usuarioResponse.statusCode).toBe(201);
      const usuarioId = usuarioResponse.body.id;

      const response = await request(app)
        .post('/api/v1/funcionarios')
        .send({
          cargo: 'Desenvolvedor',
          dataAdmissao: new Date().toISOString(),
          usuarioId: usuarioId,
          pessoaId: pessoaId,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.cargo).toBe('Desenvolvedor');
      expect(response.body.usuarioId).toBe(usuarioId);
    });

    it('GET /api/v1/funcionarios/:id - Deve buscar um funcionário por ID', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Busca Func', email: 'buscafunc@example.com', telefone: '11944444444' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'userfuncbusca',
          senha_hash: 'hashfuncbusca',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });
      const funcionario = await prisma.funcionario.create({
        data: {
          cargo: 'QA',
          data_admissao: new Date(),
          status: StatusUsuario.ATIVO,
          usuarioId: usuario.id,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app).get(`/api/v1/funcionarios/${funcionario.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(funcionario.id);
      expect(response.body.cargo).toBe('QA');
    });

    it('PUT /api/v1/funcionarios/:id - Deve atualizar um funcionário', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Atualiza Func', email: 'atualizafunc@example.com', telefone: '11933333333' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'funcantigo',
          senha_hash: 'hashfuncantigo',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });
      const funcionario = await prisma.funcionario.create({
        data: {
          cargo: 'Dev Junior',
          data_admissao: new Date(),
          status: StatusUsuario.ATIVO,
          usuarioId: usuario.id,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app)
        .put(`/api/v1/funcionarios/${funcionario.id}`)
        .send({ cargo: 'Dev Pleno', status: StatusUsuario.INATIVO });

      expect(response.statusCode).toBe(200);
      expect(response.body.cargo).toBe('Dev Pleno');
      expect(response.body.status).toBe(StatusUsuario.INATIVO);
    });

    it('DELETE /api/v1/funcionarios/:id - Deve deletar um funcionário', async () => {
      const pessoa = await prisma.pessoa.create({
        data: { nome: 'Estagiario', email: 'deletafunc@example.com', telefone: '11922222222' },
      });
      const usuario = await prisma.usuario.create({
        data: {
          nome_usuario: 'funcdeleta',
          senha_hash: 'hashfuncdeleta',
          tipo: TipoUsuario.USER,
          status: StatusUsuario.ATIVO,
          pessoaId: pessoa.id,
        },
      });
      const funcionario = await prisma.funcionario.create({
        data: {
          cargo: 'Estagiario',
          data_admissao: new Date(),
          status: StatusUsuario.ATIVO,
          usuarioId: usuario.id,
          pessoaId: pessoa.id,
        },
      });

      const response = await request(app).delete(`/api/v1/funcionarios/${funcionario.id}`);

      expect(response.statusCode).toBe(204);

      const findResponse = await request(app).get(`/api/v1/funcionarios/${funcionario.id}`);
      expect(findResponse.statusCode).toBe(404); // Deve retornar 404 após a exclusão
    });
  });
});
