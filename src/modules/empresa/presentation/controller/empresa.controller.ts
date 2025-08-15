import { Request, Response } from "express";
import { CriarEmpresaUseCase } from "../../application/use-cases/criarEmpresaUseCase";
import { EmpresaRepositoryPrisma } from "../../infra/empresa.repository.prisma";
import { UsuarioMap } from "@modules/acesso_e_identidade/infra/mappers/usuario.map";

const empresaRepository = new EmpresaRepositoryPrisma();
const criarEmpresaUseCase = new CriarEmpresaUseCase(empresaRepository);

export class EmpresaController {
  async create(req: Request, res: Response): Promise<Response> {
    let { nome, cnpj, email, plano } = req.body;

    // Trata CNPJ vazio como undefined
    cnpj = cnpj?.trim() ? cnpj : undefined;

    try {
      const {empresa, usuario} = await criarEmpresaUseCase.execute({ nome, cnpj, email, plano });
      return res.status(201).json({empresa, usuario: UsuarioMap.toDTO(usuario)});
    } catch (error: any) {
      // Se o erro for de unique constraint, retorna 400 com mensagem amigável
      if (error.code === "P2002" && error.meta?.target?.includes("cnpj")) {
        return res.status(400).json({ message: "CNPJ já cadastrado." });
      }
      return res.status(500).json({ message: error.message });
    }
  }



  async getAll(req: Request, res: Response): Promise<Response> {  
    try {
      const empresas = await empresaRepository.findAll();
      return res.status(200).json(empresas);
      } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {

    const { id } = req.params;

    try {
      const empresa = await empresaRepository.findById(id);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada." });
      }
      return res.status(200).json(empresa);

    } catch(errr: any) {
      return res.status(500).json({ message: errr.message });
    }
  }
}

