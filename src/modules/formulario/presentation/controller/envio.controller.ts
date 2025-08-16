import { Request, Response, NextFunction } from 'express';
import { DispararEnvioEmMassaRealtimeUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case';
import { DispararEnvioIndividualUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case';



/**
 * @description O `EnvioController` gerencia a lógica de tratamento de requisições
 * HTTP para o envio de formulários, utilizando o framework Express.
 */
export class EnvioController {
  constructor(
    private readonly dispararEnvioIndividualUseCase: DispararEnvioIndividualUseCase,
    private readonly dispararEnvioEmMassaUseCase: DispararEnvioEmMassaRealtimeUseCase,
  ) {}

  /**
   * @description Manipulador para disparar um envio individual de um formulário.
   * Rota: POST /envios/individual
   */
  public dispararIndividual = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { campanhaId, vendaId, empresaId } = req.body;
      console.log(`Recebido pedido de envio individual para vendaId: ${vendaId}`);
      
      
      await this.dispararEnvioIndividualUseCase.execute({ campanhaId, vendaId, empresaId });
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
    const { campanhaId, intervalo, empresaId, produtoId } = req.body;

    await this.dispararEnvioEmMassaUseCase.execute(
      campanhaId,
      empresaId,
      produtoId,
      { intervaloChecagemMinutos: intervalo }
    );

    res.status(200).json({ message: 'Disparo em massa iniciado com sucesso.' });
  } catch (error) {
    next(error);
  }
};


  // /**
  //  * @description Manipulador para retentar envios pendentes (usado por jobs).
  //  * Rota: POST /envios/retentar
  //  */
  // public retentarPendentes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const { clienteId, campanhaId } = req.body;
  //     // Passa os parâmetros opcionais para o use-case
  //     await this.retentarEnviosPendentesUseCase.execute({ clienteId, campanhaId });
  //     res.status(200).json({ message: 'Retentativa de envios pendentes concluída.' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

