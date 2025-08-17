// src/modules/formulario/infra/http/controllers/feedback.controller.ts
import { CriarFeedbackDTO } from '@modules/feedbacks/application/dto/criarFeedbackDTO';
import { BuscarFeedbackPorEnvioUseCase } from '@modules/feedbacks/application/use-cases/buscarFeedbackUseCase';
import { BuscarTodosFeedbacksUseCase } from '@modules/feedbacks/application/use-cases/buscarTodosFeedbacksUseCase';
import { CriarFeedbackUseCase } from '@modules/feedbacks/application/use-cases/criarFeedbackUseCase';
import { ExcluirLogicamenteFeedbackUseCase } from '@modules/feedbacks/application/use-cases/excluirFeedbackUseCase';
import { Request, Response, NextFunction } from 'express';
import { CriarFeedbackManualUseCase } from '@modules/feedbacks/application/use-cases/criarFeedbackManualUseCase';
import { CriarFeedbackManualProps } from '@modules/feedbacks/domain/feedback.types';

/**
 * @description O `FeedbackController` gerencia a lógica de tratamento de requisições
 * HTTP para a entidade Feedback, utilizando o framework Express.
 * Ele orquestra os `use-cases` para cada endpoint.
 */
export class FeedbackController {
  constructor(
    private readonly criarFeedbackUseCase: CriarFeedbackUseCase,
    private readonly buscarFeedbackPorEnvioUseCase: BuscarFeedbackPorEnvioUseCase,
    private readonly excluirLogicamenteFeedbackUseCase: ExcluirLogicamenteFeedbackUseCase,
    private readonly buscarTodosFeedbacksUseCase: BuscarTodosFeedbacksUseCase,
    private readonly criarFeedbackManualUseCase: CriarFeedbackManualUseCase,
  ) {}

  /**
   * @description Manipulador para criar um novo feedback.
   */
  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: CriarFeedbackDTO = req.body;
      await this.criarFeedbackUseCase.execute(body);
      res.status(201).send(); // Retorna 201 (Created) sem conteúdo
    } catch (error) {
      next(error); // Encaminha o erro para o middleware de tratamento de erros do Express
    }
  };

  /**
   * @description Manipulador para criar um novo feedback manual.
   */
  public criarManual = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { empresaId } = req.params;
      const { clienteNome, produtoNome, respostas, vendaId } = req.body;

      const feedback = await this.criarFeedbackManualUseCase.execute({
        clienteNome: clienteNome,
        produtoNome: produtoNome,
        respostas,
        vendaId,
        empresaId
      });

      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  };


  /**
   * @description Manipulador para buscar um feedback pelo ID do envio.
   */
  public buscarPorEnvioId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { envioId } = req.params;
      const feedback = await this.buscarFeedbackPorEnvioUseCase.execute(envioId);
      
      if (!feedback) {
        res.status(404).json({ message: 'Feedback não encontrado' });
      } else {
        res.status(200).json(feedback);
      }
    } catch (error) {
      next(error);
    }
  };

  public buscarTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const feedbacks = await this.buscarTodosFeedbacksUseCase.execute();
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Manipulador para exclusão lógica de um feedback.
   */
  public excluirLogicamente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.excluirLogicamenteFeedbackUseCase.execute(id);
      res.status(204).send(); // Retorna 204 (No Content) após a exclusão
    } catch (error) {
      next(error);
    }
  };
}
