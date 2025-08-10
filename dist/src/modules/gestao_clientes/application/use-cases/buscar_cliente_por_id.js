"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarClientePorIdUseCase = void 0;
const cliente_map_1 = require("@modules/gestao_clientes/infra/mappers/cliente.map");
/**
 * Caso de uso para buscar um cliente pelo seu ID único.
 */
class BuscarClientePorIdUseCase {
    constructor(clienteRepository) {
        this._clienteRepository = clienteRepository;
    }
    /**
     * Executa a busca pelo cliente.
     * @param id O ID (UUID) do cliente a ser buscado.
     * @returns Um DTO com os dados do cliente se encontrado, ou null caso contrário.
     */
    async execute(id) {
        // 1. Pede ao repositório para recuperar a entidade de domínio.
        const cliente = await this._clienteRepository.recuperarPorUuid(id);
        // 2. Se a entidade não for encontrada, retorna null.
        if (!cliente) {
            return null;
        }
        // 3. Se encontrada, usa o mapper para converter a entidade em um DTO de resposta.
        return cliente_map_1.ClienteMap.toResponseDTO(cliente);
    }
}
exports.BuscarClientePorIdUseCase = BuscarClientePorIdUseCase;
//# sourceMappingURL=buscar_cliente_por_id.js.map