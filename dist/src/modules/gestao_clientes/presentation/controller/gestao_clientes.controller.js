"use strict";
// src/modules/produtos/presentation/controllers/produto.controller.ts (Adaptado)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
const cliente_exception_1 = require("@modules/gestao_clientes/domain/cliente.exception");
// Exceções personalizadas (se tiver)
class BadRequestError extends Error {
}
class NotFoundError extends Error {
} // Para quando não encontrar algo
class ClienteController {
    constructor(_criarClienteUseCase, _listarClientesUseCase, _buscarClientePorIdUseCase, _atualizarClienteUseCase, _deletarClienteUseCase, _gerenciarProdutosClienteUseCase) {
        this._criarClienteUseCase = _criarClienteUseCase;
        this._listarClientesUseCase = _listarClientesUseCase;
        this._buscarClientePorIdUseCase = _buscarClientePorIdUseCase;
        this._atualizarClienteUseCase = _atualizarClienteUseCase;
        this._deletarClienteUseCase = _deletarClienteUseCase;
        this._gerenciarProdutosClienteUseCase = _gerenciarProdutosClienteUseCase;
        /**
         * Lida com a requisição para criar um novo cliente.
         * Rota: POST /clientes
         */
        this.criar = async (req, res, next) => {
            try {
                // Os dados de entrada vêm do corpo da requisição.
                const clienteCriadoDTO = await this._criarClienteUseCase.execute(req.body);
                res.status(201).json(clienteCriadoDTO);
            }
            catch (error) {
                // Tratamento de erros genéricos ou de validação.
                next(error);
            }
        };
        /**
         * Lida com a requisição para listar clientes, com filtros opcionais.
         * Rota: GET /clientes
         */
        this.listar = async (req, res, next) => {
            try {
                // Os filtros vêm da query string da URL (ex: /clientes?status=ATIVO).
                const clientesDTO = await this._listarClientesUseCase.execute(req.query);
                res.status(200).json(clientesDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para buscar um cliente por seu ID.
         * Rota: GET /clientes/:id
         */
        this.buscarPorId = async (req, res, next) => {
            try {
                const { id } = req.params;
                const clienteDTO = await this._buscarClientePorIdUseCase.execute(id);
                if (!clienteDTO) {
                    res.status(404).json({ message: 'Cliente não encontrado.' });
                }
                res.status(200).json(clienteDTO);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Lida com a requisição para atualizar um cliente existente.
         * Rota: PUT /clientes/:id
         */
        this.atualizar = async (req, res, next) => {
            try {
                const { id } = req.params;
                // Combina o ID da rota com os dados do corpo da requisição.
                const inputDTO = { id, ...req.body };
                const clienteAtualizadoDTO = await this._atualizarClienteUseCase.execute(inputDTO);
                res.status(200).json(clienteAtualizadoDTO);
            }
            catch (error) {
                // Trata erros específicos, como cliente não encontrado.
                if (error instanceof cliente_exception_1.ClienteExceptions.ClienteNaoEncontrado) {
                    res.status(404).json({ message: error.message });
                }
                next(error);
            }
        };
        /**
         * Lida com a requisição para deletar (logicamente) um cliente.
         * Rota: DELETE /clientes/:id
         */
        this.deletar = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this._deletarClienteUseCase.execute(id);
                // Retorna uma resposta 204 No Content, indicando sucesso sem corpo de resposta.
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof cliente_exception_1.ClienteExceptions.ClienteNaoEncontrado) {
                    res.status(404).json({ message: error.message });
                }
                next(error);
            }
        };
        this.gerenciarProdutos = async (req, res, next) => {
            try {
                const { clienteId } = req.params;
                const { action, produtoId, novoProdutoId } = req.body;
                await this._gerenciarProdutosClienteUseCase.execute({
                    clienteId,
                    action,
                    produtoId,
                    novoProdutoId,
                });
                res.status(200).json({ message: 'Operação de produto concluída com sucesso.' });
            }
            catch (error) {
                if (error instanceof cliente_exception_1.ClienteExceptions.ClienteNaoEncontrado) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof cliente_exception_1.ClienteExceptions.InvalidOperationError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                next(error);
            }
        };
    }
}
exports.ClienteController = ClienteController;
//# sourceMappingURL=gestao_clientes.controller.js.map