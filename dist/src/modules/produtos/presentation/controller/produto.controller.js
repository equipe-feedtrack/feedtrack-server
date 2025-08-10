"use strict";
// src/modules/produtos/presentation/controllers/produto.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
// Exceções personalizadas (se tiver)
class BadRequestError extends Error {
}
class NotFoundError extends Error {
} // Para quando não encontrar algo
class ProdutoController {
    constructor(criarProdutoUseCase, buscarProdutoPorIdUseCase, atualizarProdutoUseCase, deletarProdutoUseCase, listarProdutosUseCase) {
        this.criarProdutoUseCase = criarProdutoUseCase;
        this.buscarProdutoPorIdUseCase = buscarProdutoPorIdUseCase;
        this.atualizarProdutoUseCase = atualizarProdutoUseCase;
        this.deletarProdutoUseCase = deletarProdutoUseCase;
        this.listarProdutosUseCase = listarProdutosUseCase;
        // Métodos do Controlador
        this.criarProduto = async (req, res, next) => {
            try {
                // ... (validações de input) ...
                const inputDTO = req.body; // Requisição direta
                const produtoCriado = await this.criarProdutoUseCase.execute(inputDTO);
                res.status(201).json(produtoCriado);
            }
            catch (error) {
                next(error); // Encaminha o erro para o middleware de erros global
            }
        };
        this.buscarProdutoPorId = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id)
                    throw new BadRequestError('ID do produto é obrigatório.');
                const produto = await this.buscarProdutoPorIdUseCase.execute(id);
                if (!produto)
                    throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
                res.status(200).json(produto);
            }
            catch (error) {
                next(error);
            }
        };
        this.listarProdutos = async (req, res, next) => {
            try {
                // Implementar lógica de filtros a partir de req.query
                const { ativo, cliente_id } = req.query; // Tipagem básica para filtros
                let ativoBoolean;
                if (typeof ativo === 'string') {
                    ativoBoolean = ativo.toLowerCase() === 'true'; // Converte "true" para true, "false" para false
                }
                const filtros = {
                    ativo: ativoBoolean, // Passa o booleano convertido
                    cliente_id: typeof cliente_id === 'string' ? cliente_id : undefined, // Garante que cliente_id é string ou undefined
                };
                const produtos = await this.listarProdutosUseCase.execute(filtros);
                res.status(200).json(produtos);
            }
            catch (error) {
                next(error);
            }
        };
        this.atualizarProduto = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id)
                    throw new BadRequestError('ID do produto é obrigatório para atualização.');
                const inputDTO = { id, ...req.body };
                const produtoAtualizado = await this.atualizarProdutoUseCase.execute(inputDTO);
                res.status(200).json(produtoAtualizado);
            }
            catch (error) {
                next(error);
            }
        };
        this.deletarProduto = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id)
                    throw new BadRequestError('ID do produto é obrigatório para exclusão.');
                await this.deletarProdutoUseCase.execute(id);
                res.json({ message: 'Produto deletado com sucesso.' });
                res.status(204).send(); // 204 No Content para deleção bem-sucedida
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ProdutoController = ProdutoController;
//# sourceMappingURL=produto.controller.js.map