import { Request, Response, NextFunction } from 'express';
import { DispararEnvioEmMassaRealtimeUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioEmMassa.use-case';
import { DispararEnvioIndividualUseCase } from '@modules/formulario/application/use-cases/envio/dispararEnvioIndividual.use-case';
import { ListarEnviosPorEmpresaUseCase } from '@modules/formulario/application/use-cases/envio/listarEnviosPorEmpresa.use-case';



/**
 * @description O `EnvioController` gerencia a lógica de tratamento de requisições
 * HTTP para o envio de formulários, utilizando o framework Express.
 */
export class EnvioController {
  constructor(
    private readonly dispararEnvioIndividualUseCase: DispararEnvioIndividualUseCase,
    private readonly dispararEnvioEmMassaUseCase: DispararEnvioEmMassaRealtimeUseCase,
    private readonly listarEnviosPorEmpresaUseCase: ListarEnviosPorEmpresaUseCase
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
    const { campanhaId, empresaId, produtoId } = req.body;
    console.log(`Recebido pedido de envio em massa para campanhaId: ${campanhaId}`);


    await this.dispararEnvioEmMassaUseCase.execute(
      campanhaId,
      empresaId,
      produtoId,
    );

    res.status(200).json({ message: 'Disparo em massa iniciado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

  public listarEnviosPorEmpresa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { empresaId } = req.params;

      console.log(`Listando envios para empresaId: ${empresaId}`);
      const envios = await this.listarEnviosPorEmpresaUseCase.execute(empresaId);
      res.status(200).json(envios);
    } catch (error) {
      next(error);
    }
  }
}