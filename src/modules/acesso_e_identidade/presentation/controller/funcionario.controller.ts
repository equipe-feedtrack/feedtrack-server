import { Request, Response } from 'express';
import { CriarFuncionarioUseCase } from '../../application/use-cases/criarFuncionarioUseCase';
import { BuscarFuncionarioPorIdUseCase } from '../../application/use-cases/buscarFuncionarioPorIdUseCase';
import { BuscarFuncionarioPorUsuarioIdUseCase } from '../../application/use-cases/buscarFuncionarioPorUsuarioIdUseCase';
import { AtualizarFuncionarioUseCase } from '../../application/use-cases/atualizarFuncionarioUseCase';
import { DeletarFuncionarioUseCase } from '../../application/use-cases/deletarFuncionarioUseCase';
import { Funcionario } from '@modules/acesso_e_identidade/domain/funcionario/funcionario.entity';
import { BuscarTodosFuncionariosUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarTodosFuncionariosUseCase';

export class FuncionarioController {
  constructor(
    private criarFuncionarioUseCase: CriarFuncionarioUseCase,
    private buscarFuncionarioPorIdUseCase: BuscarFuncionarioPorIdUseCase,
    private buscarFuncionarioPorUsuarioIdUseCase: BuscarFuncionarioPorUsuarioIdUseCase,
    private atualizarFuncionarioUseCase: AtualizarFuncionarioUseCase,
    private deletarFuncionarioUseCase: DeletarFuncionarioUseCase,
    private buscarTodosFuncionariosUseCase: BuscarTodosFuncionariosUseCase
  ) {}

  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const funcionario = await this.criarFuncionarioUseCase.execute(req.body);
      return res.status(201).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const funcionario = await this.buscarFuncionarioPorIdUseCase.execute(id);
      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
      }
      return res.status(200).json(funcionario);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscarTodos(req: Request, res: Response): Promise<Response> {
    try {
      const funcionarios = await this.buscarTodosFuncionariosUseCase.execute();
      return res.status(200).json(funcionarios);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscarPorUsuarioId(req: Request, res: Response): Promise<Response> {
    try {
      const { usuarioId } = req.params;
      const funcionario = await this.buscarFuncionarioPorUsuarioIdUseCase.execute(usuarioId);
      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
      }
      return res.status(200).json(funcionario);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const funcionarioExistente = await this.buscarFuncionarioPorIdUseCase.execute(id);
      if (!funcionarioExistente) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
      }
      // Assuming the request body contains the updated fields
      const funcionarioAtualizado = Funcionario.recuperar({ ...funcionarioExistente, ...req.body });
      const result = await this.atualizarFuncionarioUseCase.execute(funcionarioAtualizado);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const result = await this.deletarFuncionarioUseCase.execute(id);
      if (!result) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
      }
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
