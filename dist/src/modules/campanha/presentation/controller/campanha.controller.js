"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampanhaController = void 0;
/**
 * Controller responsável por gerir as requisições HTTP para o recurso de Campanhas.
 * A refatoração utiliza arrow functions para manter o contexto do 'this' e o
 * parâmetro 'next' para um tratamento de erros mais robusto.
 */
class CampanhaController {
    constructor(_criarCampanhaUseCase, _listarCampanhasUseCase, _buscarCampanhaPorIdUseCase, _atualizarCampanhaUseCase, _deletarCampanhaUseCase) {
        this._criarCampanhaUseCase = _criarCampanhaUseCase;
        this._listarCampanhasUseCase = _listarCampanhasUseCase;
        this._buscarCampanhaPorIdUseCase = _buscarCampanhaPorIdUseCase;
        this._atualizarCampanhaUseCase = _atualizarCampanhaUseCase;
        this._deletarCampanhaUseCase = _deletarCampanhaUseCase;
        /**
         * Lida com a requisição para criar uma nova campanha.
         * Rota: POST /campanhas
         */
        this.criar = async (req, res, next) => {
            try {
                const campanhaCriadaDTO = await this._criarCampanhaUseCase.execute(req.body);
                res.status(201).json(campanhaCriadaDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para listar todas as campanhas.
         * Rota: GET /campanhas
         */
        this.listar = async (req, res, next) => {
            try {
                const campanhasDTO = await this._listarCampanhasUseCase.execute();
                res.status(200).json(campanhasDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para buscar uma campanha por seu ID.
         * Rota: GET /campanhas/:id
         */
        this.buscarPorId = async (req, res, next) => {
            try {
                const { id } = req.params;
                const campanhaDTO = await this._buscarCampanhaPorIdUseCase.execute(id);
                if (!campanhaDTO) {
                    res.status(404).json({ message: 'Campanha não encontrada.' });
                    return;
                }
                res.status(200).json(campanhaDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para atualizar uma campanha existente.
         * Rota: PUT /campanhas/:id
         */
        this.atualizar = async (req, res, next) => {
            try {
                const { id } = req.params;
                const inputDTO = { id, ...req.body };
                const campanhaAtualizadaDTO = await this._atualizarCampanhaUseCase.execute(inputDTO);
                res.status(200).json(campanhaAtualizadaDTO);
            }
            catch (error) {
                if (error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                next(error);
            }
        };
        /**
         * Lida com a requisição para deletar uma campanha.
         * Rota: DELETE /campanhas/:id
         */
        this.deletar = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this._deletarCampanhaUseCase.execute(id);
                res.status(204).send();
            }
            catch (error) {
                if (error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                next(error);
            }
        };
    }
}
exports.CampanhaController = CampanhaController;
//# sourceMappingURL=campanha.controller.js.map