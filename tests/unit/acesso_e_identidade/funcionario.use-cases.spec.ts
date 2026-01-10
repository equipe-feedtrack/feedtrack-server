import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { IFuncionarioRepository } from '@modules/acesso_e_identidade/infra/funcionario/funcionario.repository.interface';
import { CriarFuncionarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/criarFuncionarioUseCase';
import { BuscarFuncionarioPorIdUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarFuncionarioPorIdUseCase';
import { BuscarFuncionarioPorUsuarioIdUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarFuncionarioPorUsuarioIdUseCase';
import { AtualizarFuncionarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/atualizarFuncionarioUseCase';
import { DeletarFuncionarioUseCase } from '@modules/acesso_e_identidade/application/use-cases/deletarFuncionarioUseCase';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { randomUUID } from 'crypto';

// Mock do repositório de funcionário
const mockFuncionarioRepository: IFuncionarioRepository = {
  inserir: vi.fn(),
  buscarPorId: vi.fn(),
  buscarPorUsuarioId: vi.fn(),
  alterar: vi.fn(),
  deletar: vi.fn(),
};

describe('Funcionario Use Cases', () => {
  let criarFuncionarioUseCase: CriarFuncionarioUseCase;
  let buscarFuncionarioPorIdUseCase: BuscarFuncionarioPorIdUseCase;
  let buscarFuncionarioPorUsuarioIdUseCase: BuscarFuncionarioPorUsuarioIdUseCase;
  let atualizarFuncionarioUseCase: AtualizarFuncionarioUseCase;
  let deletarFuncionarioUseCase: DeletarFuncionarioUseCase;

  beforeEach(() => {
    criarFuncionarioUseCase = new CriarFuncionarioUseCase(mockFuncionarioRepository);
    buscarFuncionarioPorIdUseCase = new BuscarFuncionarioPorIdUseCase(mockFuncionarioRepository);
    buscarFuncionarioPorUsuarioIdUseCase = new BuscarFuncionarioPorUsuarioIdUseCase(mockFuncionarioRepository);
    atualizarFuncionarioUseCase = new AtualizarFuncionarioUseCase(mockFuncionarioRepository);
    deletarFuncionarioUseCase = new DeletarFuncionarioUseCase(mockFuncionarioRepository);

    // Resetar mocks antes de cada teste
    vi.clearAllMocks();
  });

  it('Deve criar um novo funcionário', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Funcionario Teste', email: 'func@example.com', telefone: '11988888888' });
    const funcionarioProps = {
      cargo: 'Desenvolvedor',
      dataAdmissao: new Date(),
      usuarioId: randomUUID(),
      pessoa: pessoa,
    };
    const funcionarioCriado = Funcionario.criarFuncionario(funcionarioProps, randomUUID());

    vi.spyOn(mockFuncionarioRepository, 'inserir').mockResolvedValue(funcionarioCriado);

    const result = await criarFuncionarioUseCase.execute(funcionarioProps);

    expect(result).toEqual(funcionarioCriado);
    expect(mockFuncionarioRepository.inserir).toHaveBeenCalledWith(expect.any(Funcionario));
  });

  it('Deve buscar um funcionário por ID', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Funcionario Teste', email: 'func@example.com', telefone: '11988888888' });
    const existingFuncionarioId = randomUUID();
    const funcionarioExistente = Funcionario.criarFuncionario({
      cargo: 'Gerente',
      dataAdmissao: new Date(),
      usuarioId: randomUUID(),
      pessoa: pessoa,
    }, existingFuncionarioId);

    vi.spyOn(mockFuncionarioRepository, 'buscarPorId').mockResolvedValue(funcionarioExistente);

    const result = await buscarFuncionarioPorIdUseCase.execute(existingFuncionarioId);

    expect(result).toEqual(funcionarioExistente);
    expect(mockFuncionarioRepository.buscarPorId).toHaveBeenCalledWith(existingFuncionarioId);
  });

  it('Deve retornar null se o funcionário não for encontrado por ID', async () => {
    vi.spyOn(mockFuncionarioRepository, 'buscarPorId').mockResolvedValue(null);

    const result = await buscarFuncionarioPorIdUseCase.execute(randomUUID());

    expect(result).toBeNull();
    expect(mockFuncionarioRepository.buscarPorId).toHaveBeenCalledWith(expect.any(String));
  });

  it('Deve buscar um funcionário por ID de usuário', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Funcionario Teste', email: 'func@example.com', telefone: '11988888888' });
    const existingFuncionarioId = randomUUID();
    const existingUserId = randomUUID();
    const funcionarioExistente = Funcionario.criarFuncionario({
      cargo: 'Analista',
      dataAdmissao: new Date(),
      usuarioId: existingUserId,
      pessoa: pessoa,
    }, existingFuncionarioId);

    vi.spyOn(mockFuncionarioRepository, 'buscarPorUsuarioId').mockResolvedValue(funcionarioExistente);

    const result = await buscarFuncionarioPorUsuarioIdUseCase.execute(existingUserId);

    expect(result).toEqual(funcionarioExistente);
    expect(mockFuncionarioRepository.buscarPorUsuarioId).toHaveBeenCalledWith(existingUserId);
  });

  it('Deve retornar null se o funcionário não for encontrado por ID de usuário', async () => {
    vi.spyOn(mockFuncionarioRepository, 'buscarPorUsuarioId').mockResolvedValue(null);

    const result = await buscarFuncionarioPorUsuarioIdUseCase.execute(randomUUID());

    expect(result).toBeNull();
    expect(mockFuncionarioRepository.buscarPorUsuarioId).toHaveBeenCalledWith(expect.any(String));
  });

  it('Deve atualizar um funcionário existente', async () => {
    const pessoa = Pessoa.criar({ id: randomUUID(), nome: 'Funcionario Teste', email: 'func@example.com', telefone: '11988888888' });
    const updateFuncionarioId = randomUUID();
    const updateUserId = randomUUID();
    const funcionarioParaAtualizar = Funcionario.criarFuncionario({
      cargo: 'Estagiário',
      dataAdmissao: new Date(),
      usuarioId: updateUserId,
      pessoa: pessoa,
    }, updateFuncionarioId);

    const funcionarioAtualizado = Funcionario.criarFuncionario({
      cargo: 'Desenvolvedor Junior',
      dataAdmissao: new Date(),
      usuarioId: updateUserId,
      pessoa: pessoa,
    }, updateFuncionarioId);

    vi.spyOn(mockFuncionarioRepository, 'alterar').mockResolvedValue(funcionarioAtualizado);

    const result = await atualizarFuncionarioUseCase.execute(funcionarioParaAtualizar);

    expect(result).toEqual(funcionarioAtualizado);
    expect(mockFuncionarioRepository.alterar).toHaveBeenCalledWith(funcionarioParaAtualizar);
  });

  it('Deve deletar um funcionário', async () => {
    vi.spyOn(mockFuncionarioRepository, 'deletar').mockResolvedValue(true);

    const result = await deletarFuncionarioUseCase.execute(randomUUID());

    expect(result).toBe(true);
    expect(mockFuncionarioRepository.deletar).toHaveBeenCalledWith(expect.any(String));
  });

  it('Deve retornar false se o funcionário não for encontrado para deletar', async () => {
    vi.spyOn(mockFuncionarioRepository, 'deletar').mockResolvedValue(false);

    const result = await deletarFuncionarioUseCase.execute(randomUUID());

    expect(result).toBe(false);
    expect(mockFuncionarioRepository.deletar).toHaveBeenCalledWith(expect.any(String));
  });
});
