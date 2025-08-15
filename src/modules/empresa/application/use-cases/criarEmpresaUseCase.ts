import { TipoUsuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.types";
import { Empresa } from "../../domain/empresa.entity";
import { IEmpresaRepository } from "../../infra/empresa.repository.interface";
import { CriarEmpresaDTO } from "../dto/criarEmpresa.dto";
import { CriarUsuarioEmpresaUseCase } from "@modules/acesso_e_identidade/application/use-cases/criarUsuarioEmpresaUseCase";
import { Usuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.entity";

export class CriarEmpresaUseCase {
    constructor(
      private readonly empresaRepository: IEmpresaRepository,
      private readonly criarUsuarioEmpresaUseCase: CriarUsuarioEmpresaUseCase
    ) {}

    async execute(dto: CriarEmpresaDTO): Promise<{ empresa: Empresa; usuario: Usuario }> {
        const empresa = Empresa.create({
          nome: dto.nome,
          cnpj: dto.cnpj,
          email: dto.email,
          status: dto.status, // Ensure status comes from DTO
          plano: dto.plano,
        });

        const createdEmpresa = await this.empresaRepository.save(empresa);

        // Create a default user for the new company
        const createdUsuario = await this.criarUsuarioEmpresaUseCase.execute({
            empresaId: createdEmpresa.id,
            nomeEmpresa: createdEmpresa.nome,
            tipo: TipoUsuario.ADMIN // Assuming you have a type on the company (ou super admin, não sei)
        });
        return { empresa: createdEmpresa, usuario: createdUsuario };
    }
}