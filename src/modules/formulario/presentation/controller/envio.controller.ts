import { DispararEnvioEmMassaUseCase } from "@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case";
import { DispararEnvioIndividualUseCase } from "@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case";
import { RetentarEnviosPendentesUseCase } from "@modules/formulario/application/use-cases/envio/retentarEnviosPendentes.use-case";
import { NextFunction } from "express";

export class EnvioController {
  constructor(
    private readonly dispararEnvioIndividualUseCase: DispararEnvioIndividualUseCase,
    private readonly dispararEnvioEmMassaUseCase: DispararEnvioEmMassaUseCase,
    private readonly retentarEnviosPendentesUseCase: RetentarEnviosPendentesUseCase,
  ) {}

  /**
   * @description Manipulador para disparar um envio individual de um formulário.
   * Rota: POST /envios/individual
   */
  public dispararIndividual = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clienteId, campanhaId, usuarioId } = req.body;
      await this.dispararEnvioIndividualUseCase.execute({ clienteId, campanhaId, usuarioId });
      res.status(200).json({ message: 'Envio individual disparado com sucesso.' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Manipulador para disparar um envio em massa de um formulário.
   * Rota: POST /envios/massa
   */
  public dispararEmMassa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { campanhaId, quantidade, intervalo } = req.body;
      await this.dispararEnvioEmMassaUseCase.execute(campanhaId, { quantidade, intervalo });
      res.status(200).json({ message: 'Disparo em massa iniciado com sucesso.' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Manipulador para retentar envios pendentes (usado por jobs).
   * Rota: POST /envios/retentar
   */
  public retentarPendentes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.retentarEnviosPendentesUseCase.execute();
      res.status(200).json({ message: 'Retentativa de envios pendentes concluída.' });
    } catch (error) {
      next(error);
    }
  };
}