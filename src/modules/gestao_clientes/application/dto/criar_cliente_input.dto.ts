export interface CriarClienteInputDTO {
  nome: string;
  email: string | null;
  telefone: string;
  cidade: string | null;
  empresaId: string;
}