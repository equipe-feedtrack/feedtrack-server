import { SegmentoAlvo } from '@modules/campanha/domain/campanha.types'; // Para buscar por segmento
import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';

interface ListarClientesInput {
  status?: StatusCliente;
  segmentoAlvo?: SegmentoAlvo; // Para reutilizar a lógica de busca por segmento
  // Adicione outros filtros (ex: vendedorId, cidade, nome)
}

export class ListarClientesUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(filtros?: ListarClientesInput): Promise<ClienteResponseDTO[]> {
    let clientes;

    if (filtros?.segmentoAlvo) {
      // Reutiliza a lógica de buscarPorSegmento do repositório
      clientes = await this.clienteRepository.buscarPorSegmento(filtros.segmentoAlvo);
    } else {
      // Se não há filtro de segmento, use um método listar geral (se existir no repositório)
      // Você precisaria adicionar um método `listar` ao seu IClienteRepository
      // e implementá-lo em ClienteRepositoryPrisma.
      clientes = await this.clienteRepository.listar({ status: filtros?.status }); // Exemplo de filtro simples
    }
    
    return clientes.map(ClienteMap.toResponseDTO);
  }
}