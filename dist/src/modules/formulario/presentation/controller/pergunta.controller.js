"use strict";
// src/modules/formulario/infra/http/controllers/pergunta.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaController = void 0;
const pergunta_exception_1 = require("@modules/formulario/domain/pergunta/pergunta.exception");
/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Perguntas.
 */
class PerguntaController {
    constructor(_criarPerguntaUseCase, _buscarPerguntaPorIdUseCase, _listarPerguntasUseCase, _atualizarPerguntaUseCase, _deletarPerguntaUseCase) {
        this._criarPerguntaUseCase = _criarPerguntaUseCase;
        this._buscarPerguntaPorIdUseCase = _buscarPerguntaPorIdUseCase;
        this._listarPerguntasUseCase = _listarPerguntasUseCase;
        this._atualizarPerguntaUseCase = _atualizarPerguntaUseCase;
        this._deletarPerguntaUseCase = _deletarPerguntaUseCase;
        /**
         * Lida com a requisição para criar uma nova pergunta.
         * Rota: POST /perguntas
         */
        this.criar = async (req, res, next) => {
            try {
                const perguntaCriadaDTO = await this._criarPerguntaUseCase.execute(req.body);
                res.status(201).json(perguntaCriadaDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para buscar uma pergunta por seu ID.
         * Rota: GET /perguntas/:id
         */
        this.buscarPorId = async (req, res, next) => {
            try {
                const { id } = req.params;
                const perguntaDTO = await this._buscarPerguntaPorIdUseCase.execute(id);
                if (!perguntaDTO) {
                    res.status(404).json({ message: 'Pergunta não encontrada.' });
                }
                res.status(200).json(perguntaDTO);
            }
            catch (error) {
                next(error);
            }
        };
        this.listar = async (req, res, next) => {
            try {
                const { ativo } = req.query;
                const filtros = {};
                if (ativo !== undefined) {
                    // Converte a string 'true'/'false' da query para um booleano
                    filtros.ativo = ativo === 'true';
                }
                const perguntasDTO = await this._listarPerguntasUseCase.execute(filtros);
                res.status(200).json(perguntasDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para atualizar uma pergunta existente.
         * Rota: PUT /perguntas/:id
         */
        this.atualizar = async (req, res, next) => {
            try {
                const { id } = req.params;
                const inputDTO = { id, ...req.body };
                const perguntaAtualizadaDTO = await this._atualizarPerguntaUseCase.execute(inputDTO);
                res.status(200).json(perguntaAtualizadaDTO);
            }
            catch (error) {
                if (error instanceof pergunta_exception_1.PerguntaException) {
                    res.status(404).json({ message: error.message });
                }
                else {
                    next(error);
                }
            }
        };
        /**
         * Lida com a requisição para deletar uma pergunta.
         * Rota: DELETE /perguntas/:id
         */
        this.deletar = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this._deletarPerguntaUseCase.execute(id);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof pergunta_exception_1.PerguntaException) {
                    res.status(404).json({ message: error.message });
                }
                else {
                    next(error);
                }
            }
        };
    }
}
exports.PerguntaController = PerguntaController;
//# sourceMappingURL=pergunta.controller.js.map