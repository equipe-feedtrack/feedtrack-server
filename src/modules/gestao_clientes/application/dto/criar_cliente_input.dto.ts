export interface CriarClienteInputDTO {
  nome: string;
  email: string | null;
  telefone: string;
  cidade: string | null;
  estado: string | null;
  empresaId: string;
}