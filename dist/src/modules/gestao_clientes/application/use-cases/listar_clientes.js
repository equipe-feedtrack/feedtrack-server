"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarClientesUseCase = void 0;
const cliente_map_1 = require("@modules/gestao_clientes/infra/mappers/cliente.map");
class ListarClientesUseCase {
    constructor(clienteRepository) {
        this._clienteRepository = clienteRepository;
    }
    /**
     * Executa a listagem de clientes.
     * @param filtros Um objeto opcional com os filtros a serem aplicados.
     * @returns Uma promessa que resolve com um array de DTOs de cliente.
     */
    async execute(filtros) {
        let clientes;
        // Se um filtro de segmento for fornecido, ele tem prioridade.
        if (filtros?.segmentoAlvo) {
            clientes = await this._clienteRepository.buscarPorSegmento(filtros.segmentoAlvo);
        }
        else {
            // Caso contrário, usa o método de listagem geral do repositório,
            // passando os filtros disponíveis (como o status).
            clientes = await this._clienteRepository.listar({ status: filtros?.status });
        }
        // Mapeia a lista de entidades de domínio para uma lista de DTOs de resposta.
        return clientes.map(cliente => cliente_map_1.ClienteMap.toResponseDTO(cliente));
    }
}
exports.ListarClientesUseCase = ListarClientesUseCase;
//# sourceMappingURL=listar_clientes.js.map