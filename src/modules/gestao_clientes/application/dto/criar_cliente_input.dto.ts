export interface CriarClienteInputDTO {
  pessoa: {
    nome: string;
    email: string | null;
    telefone: string;
  };
  cidade: string | null;
  vendedorResponsavel: string;
  idsProdutos: string[]; // Recebemos os IDs dos produtos a serem associados.
}