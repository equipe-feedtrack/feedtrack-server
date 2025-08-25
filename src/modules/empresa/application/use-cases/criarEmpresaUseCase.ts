import { Empresa } from "../../domain/empresa.entity";
import { IEmpresaRepository } from "../../infra/empresa.repository.interface";
import { CriarEmpresaDTO } from "../dto/criarEmpresa.dto";
import { CriarUsuarioEmpresaUseCase } from "@modules/acesso_e_identidade/application/use-cases/criarUsuarioEmpresaUseCase";
import { UsuarioRepositoryPrisma } from "@modules/acesso_e_identidade/infra/usuario/usuario.repository.prisma";
import { PrismaClient } from "@prisma/client";
import { Usuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.entity";
import { TipoUsuario } from "@modules/acesso_e_identidade/domain/usuario/usuario.types";

const prisma = new PrismaClient();
const usuarioRepository = new UsuarioRepositoryPrisma(prisma);
const criarUsuarioEmpresaUseCase = new CriarUsuarioEmpresaUseCase(usuarioRepository);

export class CriarEmpresaUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(dto: CriarEmpresaDTO): Promise<{empresa: Empresa, usuario: Usuario}> {
    const empresa = Empresa.create({
      nome: dto.nome,
      cnpj: dto.cnpj,
      email: dto.email,
      status: "ATIVO",
      plano: dto.plano,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    });

    const createdEmpresa = await this.empresaRepository.save(empresa);

    // Create a default user for the new company
    const createdUsuario = await criarUsuarioEmpresaUseCase.execute({
      empresaId: createdEmpresa.id,
      nomeEmpresa: createdEmpresa.props.nome,
      tipo: TipoUsuario.ADMIN,
      email: createdEmpresa.props.email
    });

    return {empresa: createdEmpresa, usuario: createdUsuario};
  }
}
