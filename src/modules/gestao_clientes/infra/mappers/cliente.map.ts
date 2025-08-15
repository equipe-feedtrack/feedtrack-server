import { ClienteResponseDTO } from "@modules/gestao_clientes/application/dto/cliente_response.dto";
import { Cliente } from "@modules/gestao_clientes/domain/cliente.entity";
import { ICliente, StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";
import { 
    Cliente as ClientePrisma, 
    StatusUsuario, 
    Prisma 
} from "@prisma/client";

export class ClienteMap {

    private static statusToDomain(status: StatusUsuario): StatusCliente {
        switch (status) {
            case StatusUsuario.ATIVO: return StatusCliente.ATIVO;
            case StatusUsuario.INATIVO: return StatusCliente.INATIVO;
            default: throw new Error(`Status de usuário desconhecido: ${status}`);
        }
    }

    private static statusToPersistence(status: StatusCliente): StatusUsuario {
        switch (status) {
            case StatusCliente.ATIVO: return StatusUsuario.ATIVO;
            case StatusCliente.INATIVO: return StatusUsuario.INATIVO;
            default: throw new Error(`Status de cliente desconhecido: ${status}`);
        }
    }

    public static toDomain(raw: ClientePrisma): Cliente {
        
        const clienteProps: ICliente = {
            id: raw.id,
            nome: raw.nome,
            email: raw.email ?? '',
            telefone: raw.telefone ?? '',
            cidade: raw.cidade ?? null,
            status: this.statusToDomain(raw.status),
            empresaId: raw.empresaId,
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao ?? null,
        };

        return Cliente.recuperar(clienteProps);
    }

    public static toPersistence(cliente: Cliente): Prisma.ClienteCreateInput {
        
        return {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email ?? null,
            telefone: cliente.telefone ?? '',
            cidade: cliente.cidade ?? '',
            status: this.statusToPersistence(cliente.status ?? StatusCliente.ATIVO),
            empresa: { connect: { id: cliente.empresaId } },
            dataCriacao: cliente.dataCriacao,
            dataAtualizacao: cliente.dataAtualizacao,
            dataExclusao: cliente.dataExclusao,
        };
    }

    public static toResponseDTO(cliente: Cliente): ClienteResponseDTO {
        
        return {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            cidade: cliente.cidade ?? null,
            status: cliente.status,
            empresaId: cliente.empresaId,
            dataCriacao: cliente.dataCriacao.toISOString(),
            dataAtualizacao: cliente.dataAtualizacao.toISOString(),
            dataExclusao: cliente.dataExclusao ? cliente.dataExclusao.toISOString() : null,
        };
    }
}