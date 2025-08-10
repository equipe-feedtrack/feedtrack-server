"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarClienteUseCase = void 0;
const cliente_exception_1 = require("@modules/gestao_clientes/domain/cliente.exception");
/**
 * Caso de Uso para realizar a exclusão lógica de um Cliente.
 * Altera o status do cliente para INATIVO e registra a data de exclusão.
 */
class DeletarClienteUseCase {
    constructor(clienteRepository) {
        this._clienteRepository = clienteRepository;
    }
    /**
     * Executa a exclusão lógica do cliente.
     * @param id O ID (UUID) do cliente a ser deletado.
     * @returns Uma promessa que resolve como void se a operação for bem-sucedida.
     * @throws {ClienteExceptions.ClienteNaoEncontrado} Se o cliente com o ID fornecido não for encontrado.
     */
    async execute(id) {
        // 1. Recuperar a entidade Cliente pelo ID
        const cliente = await this._clienteRepository.recuperarPorUuid(id);
        // 2. Verificar se o cliente existe
        if (!cliente) {
            throw new cliente_exception_1.ClienteExceptions.ClienteNaoEncontrado(id);
        }
        // 3. Realizar a exclusão lógica na entidade de domínio
        // Este método deve definir o status para INATIVO e a dataExclusao.
        cliente.inativar();
        // 4. Persistir a entidade Cliente atualizada
        await this._clienteRepository.atualizar(cliente);
        // Não há retorno explícito para uma exclusão lógica bem-sucedida.
    }
}
exports.DeletarClienteUseCase = DeletarClienteUseCase;
//# sourceMappingURL=deletar_cliente.js.map