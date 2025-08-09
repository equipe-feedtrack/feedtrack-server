"use strict";
// src/modules/formulario/infra/http/controllers/formulario.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioController = void 0;
const formulario_exception_1 = require("@modules/formulario/domain/formulario/formulario.exception");
/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Formulários.
 * A refatoração utiliza arrow functions para manter o contexto do 'this' e o
 * parâmetro 'next' para um tratamento de erros mais robusto.
 */
class FormularioController {
    constructor(_criarFormularioUseCase, _listarFormulariosUseCase, _buscarFormularioPorIdUseCase, _atualizarFormularioUseCase, _deletarFormularioUseCase) {
        this._criarFormularioUseCase = _criarFormularioUseCase;
        this._listarFormulariosUseCase = _listarFormulariosUseCase;
        this._buscarFormularioPorIdUseCase = _buscarFormularioPorIdUseCase;
        this._atualizarFormularioUseCase = _atualizarFormularioUseCase;
        this._deletarFormularioUseCase = _deletarFormularioUseCase;
        /**
         * Lida com a requisição para criar um novo formulário.
         * Rota: POST /formularios
         */
        this.criar = async (req, res, next) => {
            try {
                const formularioCriadoDTO = await this._criarFormularioUseCase.execute(req.body);
                res.status(201).json(formularioCriadoDTO);
            }
            catch (error) {
                // Em vez de tratar o erro aqui, passamos para o próximo middleware
                next(error);
            }
        };
        /**
         * Lida com a requisição para listar formulários.
         * Rota: GET /formularios
         */
        this.listar = async (req, res, next) => {
            try {
                const formulariosDTO = await this._listarFormulariosUseCase.execute(req.query);
                res.status(200).json(formulariosDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para buscar um formulário por seu ID.
         * Rota: GET /formularios/:id
         */
        this.buscarPorId = async (req, res, next) => {
            try {
                const { id } = req.params;
                const formularioDTO = await this._buscarFormularioPorIdUseCase.execute(id);
                if (!formularioDTO) {
                    res.status(404).json({ message: 'Formulário não encontrado.' });
                    return;
                }
                res.status(200).json(formularioDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para atualizar um formulário existente.
         * Rota: PUT /formularios/:id
         */
        this.atualizar = async (req, res, next) => {
            try {
                const { id } = req.params;
                const inputDTO = { id, ...req.body };
                const formularioAtualizadoDTO = await this._atualizarFormularioUseCase.execute(inputDTO);
                res.status(200).json(formularioAtualizadoDTO);
            }
            catch (error) {
                if (error instanceof formulario_exception_1.FormularioException) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                next(error);
            }
        };
        /**
         * Lida com a requisição para deletar um formulário.
         * Rota: DELETE /formularios/:id
         */
        this.deletar = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this._deletarFormularioUseCase.execute(id);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof formulario_exception_1.FormularioException) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                next(error);
            }
        };
    }
}
exports.FormularioController = FormularioController;
//# sourceMappingURL=formulario.controller.js.map