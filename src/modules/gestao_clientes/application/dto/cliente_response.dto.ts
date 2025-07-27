import { StatusCliente } from "@modules/gestao_clientes/domain/cliente/cliente.types";

interface PessoaResponseDTO {
    nome: string;
    email?: string;
    telefone?: string;
}

export interface ClienteResponseDTO {
    id: string;
    pessoa: PessoaResponseDTO; // Ou apenas { nome: string; email?: string; telefone?: string; }
    cidade?: string;
    vendedorResponsavel: string;
    status: StatusCliente | undefined; // DTOs geralmente expõem o status real
    produtos: Array<any>; // <--- Ajuste para ProdutoResponseDTO[] quando tiver um
    dataCriacao: string; // ISO string
    dataAtualizacao: string; // ISO string
    dataExclusao?: string | null; // ISO string ou null/undefined
}