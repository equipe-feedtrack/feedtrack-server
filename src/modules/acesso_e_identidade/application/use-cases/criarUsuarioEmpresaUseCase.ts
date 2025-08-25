import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { Usuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.entity";
import { IUsuarioRepository } from "@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface";
import { TipoUsuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.types";
import { Empresa } from "@modules/empresa/domain/empresa.entity";

interface CriarUsuarioEmpresaInput {
  nomeEmpresa: string;
  empresaId: string;
  tipo: TipoUsuario;
  email: string | null;
}
export class CriarUsuarioEmpresaUseCase implements IUseCase<CriarUsuarioEmpresaInput, Usuario> {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: CriarUsuarioEmpresaInput): Promise<Usuario> {
    const defaultUsername = `admin_${input.nomeEmpresa.toLowerCase().replace(/\s/g, '')}`;


    const usuario = await Usuario.criarUsuario({
      nomeUsuario: defaultUsername,
      senhaHash: 'admin123',
      email: input.email,
      tipo: input.tipo,
      empresaId: input.empresaId,
    });

    try {
      return await this.usuarioRepository.inserir(usuario);
    } catch (error: any) {
      console.error("Erro ao inserir usuário:", error);
      // Se for violação de unicidade
      if (error.code === "P2002") {
        throw new Error(`Usuário já existe: ${error.meta?.target?.join(', ')}`);
      }
      throw error;
    }
  }
}
