import { Request, Response } from "express";
import { CriarVendaUseCase } from "../../application/use-cases/criarVendaUseCase";
import { VendaRepositoryPrisma } from "../../infra/venda.repository.prisma";

const vendaRepository = new VendaRepositoryPrisma();
const criarVendaUseCase = new CriarVendaUseCase(vendaRepository);

export class VendaController {
  async create(req: Request, res: Response): Promise<Response> {
    const { clienteId, produtoId, empresaId } = req.body;
    try {
      const venda = await criarVendaUseCase.execute({ clienteId, produtoId, empresaId });
      return res.status(201).json(venda);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
