import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';
import { compare } from 'bcryptjs';
import { LoginInputDTO, LoginOutputDTO } from '../dto/login.dto';
import { UsuarioNaoEncontradoException } from '../exceptions/usuario.exception';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export class LoginUseCase implements IUseCase<LoginInputDTO, LoginOutputDTO> {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(props: LoginInputDTO): Promise<LoginOutputDTO> {
    const usuario = await this.usuarioRepository.buscarPorNomeUsuario(props.nomeUsuario);

    if (!usuario) {
      throw new UsuarioNaoEncontradoException();
    }

    const senhaValida = await compare(props.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, nomeUsuario: usuario.nomeUsuario },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Retorna dados do usuário sem a senha
    return {
        id: usuario.id,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email || null,
        tipo: usuario.tipo, 
        empresaId: usuario.empresaId,
        token
    };
  }
}
