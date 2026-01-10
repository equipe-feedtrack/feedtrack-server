import { Request, Response } from "express";
import { CriarEmpresaUseCase } from "../../application/use-cases/criarEmpresaUseCase";
import { EmpresaRepositoryPrisma } from "../../infra/empresa.repository.prisma";
import { UsuarioMap } from "@modules/acesso_e_identidade/infra/mappers/usuario.map";

const empresaRepository = new EmpresaRepositoryPrisma();
const criarEmpresaUseCase = new CriarEmpresaUseCase(empresaRepository);

export class EmpresaController {
  async create(req: Request, res: Response): Promise<Response> {
    let { nome, cnpj, email, plano } = req.body;
    cnpj = cnpj?.trim() ? cnpj : undefined;

    try {
      const { empresa, usuario } = await criarEmpresaUseCase.execute({
        nome,
        cnpj,
        email,
        plano,
      });

      // Conteúdo do e-mail
      const html = `
        <h2>Bem-vindo(a) à FeedTrack 🚀</h2>
        <p>Sua empresa <b>${empresa.props.nome}</b> foi criada com sucesso!</p>
        <p>Aqui estão os dados do seu usuário principal:</p>
        <ul>
          <li><b>Nome:</b> ${usuario.nomeUsuario}</li>
          <li><b>Senha Padrão:</b>admin123</li>
          <li><b>Email:</b> ${usuario.email}</li>
          <li><b>Tipo de usuário:</b> ${usuario.tipo}</li>
        </ul>
        <p>Agora você já pode acessar o sistema e começar a usar.</p>
        <p>Atenciosamente,<br/>Equipe FeedTrack</p>
      `;

      // Envia o e-mail
      await fetch("https://sendemails-lqua.onrender.com/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email, // e-mail da empresa
          subject: "📢 FeedTrack - Dados do seu usuário",
          html,
        }),
      });

      return res
        .status(201)
        .json({ empresa, usuario: UsuarioMap.toDTO(usuario) });
    } catch (error: any) {
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Atualiza uma empresa existente
async update(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const { nome, cnpj, email } = req.body;

  try {
    const empresa = await empresaRepository.findById(id);
    if (!empresa) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    // Atualiza apenas os campos fornecidos
    const novosProps = { ...empresa.props };
    if (nome !== undefined) novosProps.nome = nome;
    if (cnpj !== undefined) novosProps.cnpj = cnpj;
    if (email !== undefined) novosProps.email = email;

    const empresaAtualizada = await empresaRepository.update(id, { props: novosProps });

    return res.status(200).json(empresaAtualizada);
  } catch (error: any) {
    console.error("[Erro ao atualizar empresa]", error);
    return res.status(500).json({ message: "Erro interno ao atualizar empresa." });
  }
}


  // Remove uma empresa existente
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const empresa = await empresaRepository.findById(id);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada." });
      }

      await empresaRepository.delete(id);
      return res.status(200).json({ message: "Empresa removida com sucesso." });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
