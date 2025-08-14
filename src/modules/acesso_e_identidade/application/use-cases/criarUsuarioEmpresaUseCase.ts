import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { Usuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.entity";
import { IUsuarioRepository } from "@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface";
import { TipoUsuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.types";
import { randomBytes } from 'crypto';

interface CriarUsuarioEmpresaInput {
  empresaId: string;
  nomeEmpresa: string;
}

export class CriarUsuarioEmpresaUseCase implements IUseCase<CriarUsuarioEmpresaInput, Usuario> {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: CriarUsuarioEmpresaInput): Promise<Usuario> {
    const defaultUsername = `admin_${input.nomeEmpresa.toLowerCase().replace(/\s/g, '')}`;
    const generatedPassword = randomBytes(8).toString('hex'); // Generate a random 16-character hex password

    const usuario = await Usuario.criarUsuario({
      nomeUsuario: defaultUsername,
      senhaHash: 'admin123', // This will be hashed inside criarUsuario
      email: null,
      tipo: TipoUsuario.ADMIN, // Or a new EMPRESA_ADMIN type
      empresaId: input.empresaId,
    });

    return this.usuarioRepository.inserir(usuario);
  }
}
