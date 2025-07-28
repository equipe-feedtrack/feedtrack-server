/**
 * DTO (Data Transfer Object) para a resposta de Produto na API.
 * Contém apenas as propriedades que serão expostas ao cliente.
 */
export interface ProdutoResponseDTO {
    id: string;
    nome: string;
    descricao: string;
    valor: number;
    ativo: boolean;
    cliente_id?: string; // Inclua se o cliente_id for relevante para a resposta da API
    dataCriacao: string; // Convertido para formato string ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    dataAtualizacao: string; // Convertido para formato string ISO
    dataExclusao?: string | null; // Convertido para string ISO, pode ser null
}