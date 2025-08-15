import { StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";

export interface ClienteResponseDTO {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    cidade: string | null;
    status: StatusCliente | undefined;
    empresaId: string;
    dataCriacao: string;
    dataAtualizacao: string;
    dataExclusao?: string | null;
}