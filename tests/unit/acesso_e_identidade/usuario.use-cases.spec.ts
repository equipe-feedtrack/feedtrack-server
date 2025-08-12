import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { CriarUsuarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/criarUsuarioUseCase';
import { BuscarUsuarioPorIdUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarUsuarioPorIdUseCase';
import { BuscarUsuarioPorNomeUsuarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarUsuarioPorNomeUsuarioUseCase';
import { AtualizarUsuarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/atualizarUsuarioUseCase';
import { DeletarUsuarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/deletarUsuarioUseCase';
import { TipoUsuario, StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { randomUUID } from 'crypto';

// Mock do repositório de usuário
const mockUsuarioRepository: IUsuarioRepository = {
  inserir: vi.fn(),
  buscarPorId: vi.fn(),
  buscarPorNomeUsuario: vi.fn(),
  alterar: vi.fn(),
  deletar: vi.fn(),
};

describe('Usuario Use Cases', () => {
  let criarUsuarioUseCase: CriarUsuarioUseCase;
  let buscarUsuarioPorIdUseCase: BuscarUsuarioPorIdUseCase;
  let buscarUsuarioPorNomeUsuarioUseCase: BuscarUsuarioPorNomeUsuarioUseCase;
  let atualizarUsuarioUseCase: AtualizarUsuarioUseCase;
  let deletarUsuarioUseCase: DeletarUsuarioUseCase;

  beforeEach(() => {
    criarUsuarioUseCase = new CriarUsuarioUseCase(mockUsuarioRepository);
    buscarUsuarioPorIdUseCase = new BuscarUsuarioPorIdUseCase(mockUsuarioRepository);
    buscarUsuarioPorNomeUsuarioUseCase = new BuscarUsuarioPorNomeUsuarioUseCase(mockUsuarioRepository);
    atualizarUsuarioUseCase = new AtualizarUsuarioUseCase(mockUsuarioRepository);
    deletarUsuarioUseCase = new DeletarUsuarioUseCase(mockUsuarioRepository);

    // Resetar mocks antes de cada teste
    vi.clearAllMocks();
  });

  it('Deve criar um novo usuário', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Teste', email: 'teste@example.com', telefone: '11999999999' });
    const usuarioProps = {
      nomeUsuario: 'testuser',
      senhaHash: 'hashedpassword',
      tipo: TipoUsuario.USER,
      pessoa: pessoa,
    };
    const usuarioCriado = Usuario.criarUsuario(usuarioProps, randomUUID());

    vi.spyOn(mockUsuarioRepository, 'inserir').mockResolvedValue(usuarioCriado);

    const result = await criarUsuarioUseCase.execute(usuarioProps);

    expect(result).toEqual(usuarioCriado);
    expect(mockUsuarioRepository.inserir).toHaveBeenCalledWith(expect.any(Usuario));
  });

  it('Deve buscar um usuário por ID', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Teste', email: 'teste@example.com', telefone: '11999999999' });
    const existingId = randomUUID();
    const usuarioExistente = Usuario.criarUsuario({
      nomeUsuario: 'existinguser',
      senhaHash: 'hashedpassword',
      tipo: TipoUsuario.ADMIN,
      pessoa: pessoa,
    }, existingId);

    vi.spyOn(mockUsuarioRepository, 'buscarPorId').mockResolvedValue(usuarioExistente);

    const result = await buscarUsuarioPorIdUseCase.execute(existingId);

    expect(result).toEqual(usuarioExistente);
    expect(mockUsuarioRepository.buscarPorId).toHaveBeenCalledWith(existingId);
  });

  it('Deve retornar null se o usuário não for encontrado por ID', async () => {
    vi.spyOn(mockUsuarioRepository, 'buscarPorId').mockResolvedValue(null);

    const result = await buscarUsuarioPorIdUseCase.execute(randomUUID());

    expect(result).toBeNull();
    expect(mockUsuarioRepository.buscarPorId).toHaveBeenCalledWith(expect.any(String));
  });

  it('Deve buscar um usuário por nome de usuário', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Teste', email: 'teste@example.com', telefone: '11999999999' });
    const existingId = randomUUID();
    const usuarioExistente = Usuario.criarUsuario({
      nomeUsuario: 'existinguser',
      senhaHash: 'hashedpassword',
      tipo: TipoUsuario.ADMIN,
      pessoa: pessoa,
    }, existingId);

    vi.spyOn(mockUsuarioRepository, 'buscarPorNomeUsuario').mockResolvedValue(usuarioExistente);

    const result = await buscarUsuarioPorNomeUsuarioUseCase.execute('existinguser');

    expect(result).toEqual(usuarioExistente);
    expect(mockUsuarioRepository.buscarPorNomeUsuario).toHaveBeenCalledWith('existinguser');
  });

  it('Deve retornar null se o usuário não for encontrado por nome de usuário', async () => {
    vi.spyOn(mockUsuarioRepository, 'buscarPorNomeUsuario').mockResolvedValue(null);

    const result = await buscarUsuarioPorNomeUsuarioUseCase.execute('non-existent-username');

    expect(result).toBeNull();
    expect(mockUsuarioRepository.buscarPorNomeUsuario).toHaveBeenCalledWith('non-existent-username');
  });

  it('Deve atualizar um usuário existente', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Teste', email: 'teste@example.com', telefone: '11999999999' });
    const updateId = randomUUID();
    const usuarioParaAtualizar = Usuario.criarUsuario({
      nomeUsuario: 'oldusername',
      senhaHash: 'oldpassword',
      tipo: TipoUsuario.USER,
      pessoa: pessoa,
    }, updateId);

    const usuarioAtualizado = Usuario.criarUsuario({
      nomeUsuario: 'newusername',
      senhaHash: 'newpassword',
      tipo: TipoUsuario.ADMIN,
      pessoa: pessoa,
    }, updateId);

    vi.spyOn(mockUsuarioRepository, 'alterar').mockResolvedValue(usuarioAtualizado);

    const result = await atualizarUsuarioUseCase.execute(usuarioParaAtualizar);

    expect(result).toEqual(usuarioAtualizado);
    expect(mockUsuarioRepository.alterar).toHaveBeenCalledWith(usuarioParaAtualizar);
  });

  it('Deve deletar um usuário', async () => {
    vi.spyOn(mockUsuarioRepository, 'deletar').mockResolvedValue(true);

    const result = await deletarUsuarioUseCase.execute(randomUUID());

    expect(result).toBe(true);
    expect(mockUsuarioRepository.deletar).toHaveBeenCalledWith(expect.any(String));
  });

  it('Deve retornar false se o usuário não for encontrado para deletar', async () => {
    vi.spyOn(mockUsuarioRepository, 'deletar').mockResolvedValue(false);

    const result = await deletarUsuarioUseCase.execute(randomUUID());

    expect(result).toBe(false);
    expect(mockUsuarioRepository.deletar).toHaveBeenCalledWith(expect.any(String));
  });
});
