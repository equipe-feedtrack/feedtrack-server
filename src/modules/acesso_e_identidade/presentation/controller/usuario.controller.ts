import { Request, Response } from 'express';
import { CriarUsuarioUseCase } from '../../application/use-cases/criarUsuarioUseCase';
import { BuscarUsuarioPorIdUseCase } from '../../application/use-cases/buscarUsuarioPorIdUseCase';
import { BuscarUsuarioPorNomeUsuarioUseCase } from '../../application/use-cases/buscarUsuarioPorNomeUsuarioUseCase';
import { AtualizarUsuarioUseCase } from '../../application/use-cases/atualizarUsuarioUseCase';
import { DeletarUsuarioUseCase } from '../../application/use-cases/deletarUsuarioUseCase';
import { Usuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.entity';
import { BuscarTodosUsuariosUseCase } from '@modules/acesso_e_identidade/application/use-cases/buscarTodosUsuariosUseCase';

export class UsuarioController {
  constructor(
    private criarUsuarioUseCase: CriarUsuarioUseCase,
    private buscarUsuarioPorIdUseCase: BuscarUsuarioPorIdUseCase,
    private buscarUsuarioPorNomeUsuarioUseCase: BuscarUsuarioPorNomeUsuarioUseCase,
    private atualizarUsuarioUseCase: AtualizarUsuarioUseCase,
    private deletarUsuarioUseCase: DeletarUsuarioUseCase,
    private buscarTodosUsuariosUseCase: BuscarTodosUsuariosUseCase
  ) {}

  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await this.criarUsuarioUseCase.execute(req.body);
      return res.status(201).json(usuario);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const usuario = await this.buscarUsuarioPorIdUseCase.execute(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(200).json(usuario);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscarTodos(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await this.buscarTodosUsuariosUseCase.execute();
      return res.status(200).json(usuarios);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscarPorNomeUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { nomeUsuario } = req.params;
      const usuario = await this.buscarUsuarioPorNomeUsuarioUseCase.execute(nomeUsuario);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(200).json(usuario);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const usuarioExistente = await this.buscarUsuarioPorIdUseCase.execute(id);
      if (!usuarioExistente) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      // Assuming the request body contains the updated fields
      const usuarioAtualizado = Usuario.recuperar({ ...usuarioExistente, ...req.body });
      const result = await this.atualizarUsuarioUseCase.execute(usuarioAtualizado);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const result = await this.deletarUsuarioUseCase.execute(id);
      if (!result) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
