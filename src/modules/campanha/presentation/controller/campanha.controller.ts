// src/modules/campanha/infra/http/controllers/campanha.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AtualizarCampanhaUseCase } from "@modules/campanha/application/use-cases/atualizarCampanhaUseCase";
import { BuscarCampanhaPorIdUseCase } from "@modules/campanha/application/use-cases/buscarCampanhaUseCase";
import { CriarCampanhaUseCase } from "@modules/campanha/application/use-cases/criarCampanhaUseCase";
import { DeletarCampanhaUseCase } from "@modules/campanha/application/use-cases/deletarCampanhaUseCase";
import { ListarCampanhasUseCase } from "@modules/campanha/application/use-cases/listarCampanhaUseCase";
import { CampanhaNaoEncontradaException } from '@modules/campanha/application/exceptions/campanha.exception';
import { CriarCampanhaValidationDTO } from '../validation/CriarCampanha.dto';

export class CampanhaController {
  constructor(
    private readonly _criarCampanhaUseCase: CriarCampanhaUseCase,
    private readonly _listarCampanhasUseCase: ListarCampanhasUseCase,
    private readonly _buscarCampanhaPorIdUseCase: BuscarCampanhaPorIdUseCase,
    private readonly _atualizarCampanhaUseCase: AtualizarCampanhaUseCase,
    private readonly _deletarCampanhaUseCase: DeletarCampanhaUseCase
  ) {}

public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Pega direto do body, que o frontend deve enviar
    const empresaId = req.body.empresaId;

    if (!empresaId) {
      res.status(201).json(CriarCampanhaValidationDTO);
    }

    const campanhaCriadaDTO = await this._criarCampanhaUseCase.execute({ ...req.body, empresaId });
    res.status(201).json(campanhaCriadaDTO);
  } catch (error: any) {
    next(error);
  }
};


public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { empresaId } = req.query; // ou req.params, dependendo de como o frontend envia
    if (!empresaId) {
      res.status(400).json({ message: "empresaId é obrigatório" });
      return;
    }

    const campanhasDTO = await this._listarCampanhasUseCase.execute(empresaId as string);
    res.status(200).json(campanhasDTO);
  } catch (error: any) {
    next(error);
  }
};


public buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, empresaId } = req.params; // <- adicionado empresaId

    console.log('Parametros recebidos:', { id, empresaId });


    const campanhaDTO = await this._buscarCampanhaPorIdUseCase.execute({ id, empresaId });
    if (!campanhaDTO) {
      throw new CampanhaNaoEncontradaException();
    }

    res.status(200).json(campanhaDTO);
  } catch (error: any) {
    if (error instanceof CampanhaNaoEncontradaException) {
      res.status(404).json({ message: error.message });
      return;
    }
    next(error);
  }
};

  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const empresaId = (req as any).user?.empresaId;

      const inputDTO = { id, empresaId, ...req.body };
      const campanhaAtualizadaDTO = await this._atualizarCampanhaUseCase.execute(inputDTO);

      res.status(200).json(campanhaAtualizadaDTO);
    } catch (error: any) {
      if (error instanceof CampanhaNaoEncontradaException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, empresaId } = req.params;

      await this._deletarCampanhaUseCase.execute({ id, empresaId });
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof CampanhaNaoEncontradaException) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
