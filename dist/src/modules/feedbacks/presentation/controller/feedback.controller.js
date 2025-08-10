"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
/**
 * @description O `FeedbackController` gerencia a lógica de tratamento de requisições
 * HTTP para a entidade Feedback, utilizando o framework Express.
 * Ele orquestra os `use-cases` para cada endpoint.
 */
class FeedbackController {
    constructor(criarFeedbackUseCase, buscarFeedbackPorEnvioUseCase, excluirLogicamenteFeedbackUseCase, buscarTodosFeedbacksUseCase) {
        this.criarFeedbackUseCase = criarFeedbackUseCase;
        this.buscarFeedbackPorEnvioUseCase = buscarFeedbackPorEnvioUseCase;
        this.excluirLogicamenteFeedbackUseCase = excluirLogicamenteFeedbackUseCase;
        this.buscarTodosFeedbacksUseCase = buscarTodosFeedbacksUseCase;
        /**
         * @description Manipulador para criar um novo feedback.
         */
        this.criar = async (req, res, next) => {
            try {
                const body = req.body;
                await this.criarFeedbackUseCase.execute(body);
                res.status(201).send(); // Retorna 201 (Created) sem conteúdo
            }
            catch (error) {
                next(error); // Encaminha o erro para o middleware de tratamento de erros do Express
            }
        };
        /**
         * @description Manipulador para buscar um feedback pelo ID do envio.
         */
        this.buscarPorEnvioId = async (req, res, next) => {
            try {
                const { envioId } = req.params;
                const feedback = await this.buscarFeedbackPorEnvioUseCase.execute(envioId);
                if (!feedback) {
                    res.status(404).json({ message: 'Feedback não encontrado' });
                }
                else {
                    res.status(200).json(feedback);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.buscarTodos = async (req, res, next) => {
            try {
                const feedbacks = await this.buscarTodosFeedbacksUseCase.execute();
                res.status(200).json(feedbacks);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description Manipulador para exclusão lógica de um feedback.
         */
        this.excluirLogicamente = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.excluirLogicamenteFeedbackUseCase.execute(id);
                res.status(204).send(); // Retorna 204 (No Content) após a exclusão
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map