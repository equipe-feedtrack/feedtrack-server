import { Request, Response } from 'express';
import { CriarVendaUseCase } from '@modules/venda/application/use-cases/criarVendaUseCase'; 
import { RecuperarVendaPorIdUseCase } from '../../application/use-cases/recuperar-venda-por-id.use-case';
import { RecuperarTodasVendasUseCase } from '../../application/use-cases/recuperar-todas-vendas.use-case';
import { DeletarVendaUseCase } from '@modules/venda/application/use-cases/deletarVendaUseCase';
import { VendaExceptions } from '@modules/venda/domain/venda.exception';

export class VendaController {
  constructor(
    private criarVendaUseCase: CriarVendaUseCase,
    private recuperarVendaPorIdUseCase: RecuperarVendaPorIdUseCase,
    private recuperarTodasVendasUseCase: RecuperarTodasVendasUseCase,
    private _deletarVendaUseCase: DeletarVendaUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const venda = await this.criarVendaUseCase.execute(req.body);
      res.status(201).json(venda);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const venda = await this.recuperarVendaPorIdUseCase.execute(id);
      if (!venda) {
        return res.status(404).json({ message: 'Venda não encontrada' });
      }
      res.json(venda);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const empresaId = req.query.empresaId as string;
      if (!empresaId) return res.status(400).json({ message: "empresaId é obrigatório." });

      const vendas = await this.recuperarTodasVendasUseCase.execute(empresaId);
      res.json(vendas);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id, empresaId } = req.params;
      if (!empresaId) return res.status(400).json({ message: "empresaId é obrigatório." });

      await this._deletarVendaUseCase.execute({ id, empresaId });

      // Retorna 204 No Content
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof VendaExceptions.VendaNaoEncontradaException) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof VendaExceptions.VendaNaoPermitidaException) {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }
}
